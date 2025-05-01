import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
import { Producer } from "../config/producer.js";

dotenv.config();

const apiUrl = process.env.API_URL;

const API_MANAGEMENT_KEY = process.env.API_MANAGEMENT_KEY;

interface Game {
  game_name: string;
  is_supported: boolean;
  summary: string;
  release_date: Date;
  cover_id: string;
}

let lastDate = 0;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function previousDateInDB(): Promise<void> {
  const res = await axios.get(
    `${apiUrl}/game`,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${API_MANAGEMENT_KEY}`
      }
    }
  );
  let currDate = 0;
  for (let i = 0; i < res.data.games.length; ++i)  {
    const dateString = res.data.games[i].release_date;
    const msDate = new Date(dateString).getTime();
    if (msDate > currDate) currDate = msDate;
  }
  lastDate = currDate;

}


export default async function gameJob() {
  await sleep(20000); // to prevent calling api prior to startup
  const producer = new Producer("GAME_DATA", "");

  await previousDateInDB();
  console.log(`Last saved date was ${lastDate}ms since Unix epoch`);

  cron.schedule(
    "0 30 * * * *", // every 30 mins
    async () => {
      const games: Game[] = [];
      console.log("Starting game data job...");
      console.log(`Last Date: ${lastDate}`);
      try {
        const { data: tokenData } = await axios.post(
          `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT}&client_secret=${process.env.IGDB_SECRET}&grant_type=client_credentials`,
          null
        );
        const accessToken = tokenData.access_token;
        const { data: gameData } = await axios.post(
          "https://api.igdb.com/v4/games",
          `fields name, cover, updated_at, involved_companies, summary, first_release_date;
           where first_release_date > ${lastDate};
           sort first_release_date asc;
           limit 100;`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-ID": process.env.IGDB_CLIENT,
              "Content-Type": "text/plain",
            },
          }
        );
        
        for (const game of gameData) {
          console.log('Pulling game');
          const { cover, first_release_date, name, summary, updated_at } = game;
          if (!cover) continue;

          const releaseDate = new Date(first_release_date * 1000);
          const updatedDate = new Date(updated_at * 1000);
          const isSupported = (updatedDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24) < 365;

          const { data: coverData } = await axios.post(
            "https://api.igdb.com/v4/covers",
            `fields image_id; where id = ${cover};`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-ID": process.env.IGDB_CLIENT,
                "Content-Type": "text/plain",
              },
            }
          );

          const imageId = coverData[0]?.image_id;
          if (!imageId) continue;
          games.push({
            game_name: name,
            is_supported: isSupported,
            summary: summary,
            release_date: releaseDate,
            cover_id: imageId,
          });

          let maxDate = 0;
          
          for (const game of gameData) {
            if (game.first_release_date > maxDate) {
              maxDate = game.first_release_date;
            }
          }
          lastDate = maxDate; // this tells us where we need to begin in the next batch
          sleep(3000);
        
        } 
        } catch (error) {
          console.error("Error during game job:", error);
        }
        console.log(`Fetched ${games.length} games.`);
        producer.setMessage(JSON.stringify(games));
        await producer.producerConfig();
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );
}


