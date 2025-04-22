import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import { Producer } from "../config/producer.js";

dotenv.config();

interface Game {
  game_name: string;
  game_art: Buffer;
  is_supported: boolean;
  summary: string;
  release_date: Date;
}

export default async function gameJob() {
  const producer = new Producer("GAME_DATA", "");
  const games: Game[] = [];
  cron.schedule('0 16 13 * * 1',
     async () => {
      console.log("starting job");
      try {
        let response = await axios.post(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.IGDB_CLIENT}&client_secret=${process.env.IGDB_SECRET}&grant_type=client_credentials`,
            null,
        );
        const { access_token } = response.data;
        response = await axios.post(
          'https://api.igdb.com/v4/games?limit=50&fields=name,cover,updated_at,involved_companies,summary,first_release_date',
          null,
          {
            headers: {
              'Authorization': `Bearer ${access_token}`,
              'Client-ID': process.env.IGDB_CLIENT,
              'Content-Type': 'application/json'
            }
          }
        )
        for (let i = 0; i < response.data.length; i++) {
          const { cover, first_release_date, name, summary, updated_at, } = response.data[i];
      
          const convert_release_date = new Date(first_release_date*1000);
          const convert_recent_date = new Date(updated_at*1000);
          const diffDates = convert_recent_date.getTime() - convert_release_date.getTime();
          const diffDays = Math.floor(diffDates / (1000 * 60 * 60 * 24));
          let is_supported = false;
          if (diffDays < 365) is_supported = true;
        
          let innerResponse = await axios.post(
            `https://api.igdb.com/v4/covers?id=${cover}&fields=url,game,height,width,image_id`,
            null,
            {
            headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Client-ID': process.env.IGDB_CLIENT,
                    'Content-Type': 'application/json'
                }
            }
          )
      
          const { url } = innerResponse.data[0];
          innerResponse = await axios.get(
              `https:${url}`,
              {responseType: 'arraybuffer' }
          );
          const game_art = Buffer.from(response.data);
          games.push({
            game_name: name,
            game_art: game_art,
            is_supported: is_supported,
            summary: summary,
            release_date: first_release_date
          });
        }
        console.log(games);
        } catch (error) {
          console.error('Error:', error);
      }
      producer.setMessage(JSON.stringify(games));
      await producer.producerConfig();
    },
    {
      scheduled: true,
      timezone: 'America/New_York'
    }
  );
}
