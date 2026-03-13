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

  let hackathons = results.flatMap((r) =>
    r.status === 'fulfilled' ? r.value : []
  );

  if (hackathons.length === 0) {
    console.log('All scrapers failed, using fallback data.');
    hackathons = getFallbackHackathons();
  }

  let saved = 0;

  for (const h of hackathons) {
    try {
      await Hackathon.findOneAndUpdate(
        { url: h.url },
        h,
        { upsert: true, new: true }
      );
      saved++;
    } catch (err) {}
  }

  console.log(`Aggregated ${saved} hackathons.`);
}

async function getHackathons(req, res) {
  try {

    const allHackathons = await Hackathon.find().lean();

    const now = new Date();

    const live = allHackathons.filter(
      (h) => h.startDate && h.endDate && h.startDate <= now && h.endDate >= now
    );

    const upcoming = allHackathons.filter(
      (h) => h.startDate && h.startDate > now
    );

    const gujarat = allHackathons.filter((h) =>
      isGujarat(h.location)
    );

    const india = allHackathons.filter((h) =>
      isIndia(h.location, h.country)
    );

    const global = allHackathons.filter(
      (h) => !isIndia(h.location, h.country)
    );

    res.json({
      all: allHackathons,
      live,
      upcoming,
      gujarat,
      india,
      global,
    });

  } catch (err) {
    console.error('getHackathons error:', err);
    res.status(500).json({ message: 'Failed to fetch hackathons' });
  }
}


async function getLiveHackathons(req, res) {
  try {

    const now = new Date();

    const data = await Hackathon.find({
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).lean();

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch live hackathons' });
  }
}



async function getUpcomingHackathons(req, res) {
  try {

    const now = new Date();

    const data = await Hackathon.find({
      startDate: { $gt: now },
    })
      .sort({ startDate: 1 })
      .lean();

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch upcoming hackathons' });
  }
}

async function getIndiaHackathons(req, res) {
  try {

    const all = await Hackathon.find().lean();

    res.json(
      all.filter((h) => isIndia(h.location, h.country))
    );

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch India hackathons' });
  }
}


async function getGujaratHackathons(req, res) {
  try {

    const all = await Hackathon.find().lean();

    res.json(
      all.filter((h) => isGujarat(h.location))
    );

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch Gujarat hackathons' });
  }
}



async function getGlobalHackathons(req, res) {
  try {

    const all = await Hackathon.find().lean();

    res.json(
      all.filter((h) => !isIndia(h.location, h.country))
    );

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