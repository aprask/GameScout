import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const apiUrl = process.env.API_URL;

const API_MANAGEMENT_KEY = process.env.API_MANAGEMENT_KEY;

export default async function vectorJob() {

  cron.schedule(
    "0 8 15 * * 5",
    async () => {
        await axios.post(
            `${apiUrl}/chatbot/rebuild/database`,
            {},
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `${API_MANAGEMENT_KEY}`
                }
            }
        );
    },
    {
      scheduled: true,
      timezone: "America/New_York",
    }
  );
}


