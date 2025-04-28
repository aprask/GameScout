import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
import { Producer } from "../config/producer.js";

dotenv.config();

interface Game {
  game_name: string;
  is_supported: boolean;
  summary: string;
  release_date: Date;
  cover_id: string;
}

export default async function gameJob() {
  const producer = new Producer("GAME_DATA", "");
  const games: Game[] = [];

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  cron.schedule(
    "0 08 22 * * 0",
    async () => {
      console.log("Starting game data job...");
      try {
        const { data: tokenData } = await axios.post(
          `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT}&client_secret=${process.env.IGDB_SECRET}&grant_type=client_credentials`,
          null
        );
        const accessToken = tokenData.access_token;
        let lastDate = 0;
        // const MAX_PULL = 1e6; // 1 mill iterations
        const MAX_PULL = 2;
        let i = 0;
        while (i < MAX_PULL) { // loop until no more data or safety MAX_PULL limit reached
          const { data: gameData } = await axios.post(
            "https://api.igdb.com/v4/games",
            `fields name, cover, updated_at, involved_companies, summary, first_release_date;
             where first_release_date > ${lastDate};
             sort first_release_date asc;
             limit 5;`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Client-ID": process.env.IGDB_CLIENT,
                "Content-Type": "text/plain",
              },
            }
          );

          if (gameData.length === 0) { // this means we have no more games left to pull
            console.log('No more data to pull'); 
            break;
          }
          
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
            await sleep(5000);
          }
          let maxDate = 0;
          for (const game of gameData) {
            if (game.first_release_date > maxDate) {
              maxDate = game.first_release_date;
            }
          }
          lastDate = maxDate; // this tells us where we need to begin in the next batch
          i++;
        }

        console.log(`Fetched ${games.length} games.`);

        producer.setMessage(JSON.stringify(games));
        await producer.producerConfig();

      } catch (error) {
        console.error("Error during game job:", error);
      }
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );
}
