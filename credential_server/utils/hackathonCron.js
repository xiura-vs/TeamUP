const cron = require('node-cron');
const { aggregateHackathons } = require('../controllers/hackathonController');

function startHackathonCron() {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[CRON] Refreshing hackathons...');
    await aggregateHackathons();
    console.log('[CRON] Hackathon refresh done.');
  });

  // Run once on startup
  aggregateHackathons().catch(console.error);

  console.log('[CRON] Hackathon scheduler started.');
}

module.exports = { startHackathonCron };
