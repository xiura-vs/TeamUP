const Hackathon = require('../models/Hackathon');
const {
  fetchDevpostHackathons,
  fetchDevfolioHackathons,
  fetchMLHHackathons,
  getFallbackHackathons,
} = require('../utils/hackathonScrapers');

const GUJARAT_KEYWORDS = ['gujarat', 'ahmedabad', 'vadodara', 'surat', 'gandhinagar', 'rajkot'];
const INDIA_KEYWORDS = ['india'];

const isGujarat = (loc = '') =>
  GUJARAT_KEYWORDS.some((kw) => loc.toLowerCase().includes(kw));

const isIndia = (loc = '', country = '') =>
  [...INDIA_KEYWORDS, ...GUJARAT_KEYWORDS].some(
    (kw) => loc.toLowerCase().includes(kw) || country.toLowerCase().includes(kw)
  );

async function aggregateHackathons() {
  const results = await Promise.allSettled([
    fetchDevpostHackathons(),
    fetchDevfolioHackathons(),
    fetchMLHHackathons(),
  ]);

  let hackathons = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  if (hackathons.length === 0) {
    console.log('All scrapers failed, using fallback data.');
    hackathons = getFallbackHackathons();
  }

  let saved = 0;
  for (const h of hackathons) {
    try {
      await Hackathon.findOneAndUpdate({ url: h.url }, h, { upsert: true, new: true });
      saved++;
    } catch (_) {}
  }

  console.log(`Aggregated ${saved} hackathons.`);
}

async function getHackathons(req, res) {
  try {
    const now = new Date();
    const all = await Hackathon.find().sort({ startDate: 1 }).lean();

    if (all.length === 0) {
      await aggregateHackathons();
    }

    const fresh = await Hackathon.find().sort({ startDate: 1 }).lean();

    const live = fresh.filter(
      (h) => h.startDate && h.endDate && h.startDate <= now && h.endDate >= now
    );
    const upcoming = fresh.filter((h) => !h.startDate || h.startDate > now);
    const india = fresh.filter(
      (h) => isIndia(h.location, h.country) && !isGujarat(h.location)
    );
    const gujarat = fresh.filter((h) => isGujarat(h.location));
    const global = fresh.filter(
      (h) =>
        !isIndia(h.location, h.country) &&
        !isGujarat(h.location) &&
        (h.isOnline || (!h.startDate || h.startDate > now))
    );

    res.json({ live, upcoming, india, gujarat, global, all: fresh });
  } catch (err) {
    console.error('getHackathons error:', err);
    res.status(500).json({ message: 'Failed to fetch hackathons' });
  }
}

async function getLiveHackathons(req, res) {
  try {
    const now = new Date();
    const data = await Hackathon.find({ startDate: { $lte: now }, endDate: { $gte: now } }).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch live hackathons' });
  }
}

async function getUpcomingHackathons(req, res) {
  try {
    const now = new Date();
    const data = await Hackathon.find({ startDate: { $gt: now } }).sort({ startDate: 1 }).lean();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch upcoming hackathons' });
  }
}

async function getIndiaHackathons(req, res) {
  try {
    const all = await Hackathon.find().lean();
    res.json(all.filter((h) => isIndia(h.location, h.country)));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch India hackathons' });
  }
}

async function getGujaratHackathons(req, res) {
  try {
    const all = await Hackathon.find().lean();
    res.json(all.filter((h) => isGujarat(h.location)));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Gujarat hackathons' });
  }
}

async function getGlobalHackathons(req, res) {
  try {
    const all = await Hackathon.find().lean();
    res.json(all.filter((h) => !isIndia(h.location, h.country)));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch global hackathons' });
  }
}

module.exports = {
  aggregateHackathons,
  getHackathons,
  getLiveHackathons,
  getUpcomingHackathons,
  getIndiaHackathons,
  getGujaratHackathons,
  getGlobalHackathons,
};
