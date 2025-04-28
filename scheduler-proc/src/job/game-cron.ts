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

  cron.schedule(
    "0 8 15 * * 5",
    async () => {
      console.log("Starting game data job...");

      try {
        // Get OAuth token
        const { data: tokenData } = await axios.post(
          `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT}&client_secret=${process.env.IGDB_SECRET}&grant_type=client_credentials`,
          null
        );
        const accessToken = tokenData.access_token;

        // Fetch game data
        const { data: gameData } = await axios.post(
          "https://api.igdb.com/v4/games",
          "fields name, cover, updated_at, involved_companies, summary, first_release_date; limit 500;",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-ID": process.env.IGDB_CLIENT,
              "Content-Type": "text/plain",
            },
          }
        );

        for (const game of gameData) {
          const { cover, first_release_date, name, summary, updated_at } = game;
          if (!cover) continue;

          const releaseDate = new Date(first_release_date * 1000);
          const updatedDate = new Date(updated_at * 1000);
          const isSupported = (updatedDate.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24) < 365;

          // Fetch cover image
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
            summary,
            release_date: releaseDate,
            cover_id: imageId,
          });
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
