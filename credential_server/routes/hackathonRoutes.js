const express = require('express');
const router = express.Router();
const {
  getHackathons,
  getLiveHackathons,
  getUpcomingHackathons,
  getIndiaHackathons,
  getGujaratHackathons,
  getGlobalHackathons,
} = require('../controllers/hackathonController');

router.get('/', getHackathons);
router.get('/live', getLiveHackathons);
router.get('/upcoming', getUpcomingHackathons);
router.get('/india', getIndiaHackathons);
router.get('/gujarat', getGujaratHackathons);
router.get('/global', getGlobalHackathons);

module.exports = router;
