import cron from 'node-cron';

export default function gameJob() {
  cron.schedule('0 0 18 * * 6',
     async () => { // this will occur once a week (6 pm every Sat) https://www.npmjs.com/package/node-cron?activeTab=readme
      console.log(`[${new Date().toISOString()}] Running job`);
    },
    {
      scheduled: true,
      timezone: 'America/New_York'
    }
  );
}
