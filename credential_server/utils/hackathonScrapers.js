const axios = require('axios');
const cheerio = require('cheerio');

const normalizeDate = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d) ? null : d;
};

async function fetchDevpostHackathons() {
  try {
    const { data } = await axios.get(
      'https://devpost.com/api/hackathons?status[]=open&status[]=upcoming&order_by=deadline&per_page=30',
      { timeout: 10000, headers: { 'Accept': 'application/json' } }
    );

    return (data.hackathons || []).map((h) => ({
      title: h.title || 'Untitled',
      platform: 'Devpost',
      location: h.displayed_location?.location || 'Online',
      country: h.displayed_location?.country || '',
      startDate: normalizeDate(h.submission_period_dates?.split('–')[0]),
      endDate: normalizeDate(h.submission_period_dates?.split('–')[1]),
      isOnline: h.online_only ?? true,
      description: h.tagline || '',
      prize: h.prize_amount ? `$${h.prize_amount}` : '',
      url: h.url || `https://devpost.com/hackathons/${h.id}`,
      image: h.thumbnail_url || '',
      source: 'devpost',
    }));
  } catch (err) {
    console.error('Devpost fetch error:', err.message);
    return [];
  }
}

async function fetchDevfolioHackathons() {
  try {
    const { data } = await axios.get(
      'https://api.devfolio.co/api/hackathons?type=open&page=1&page_size=30',
      {
        timeout: 10000,
        headers: {
          Accept: 'application/json',
          'X-Client': 'web',
        },
      }
    );

    const list = data?.results || data?.hackathons || [];
    return list.map((h) => ({
      title: h.name || 'Untitled',
      platform: 'Devfolio',
      location: h.city || (h.is_online ? 'Online' : 'India'),
      country: h.country || 'India',
      startDate: normalizeDate(h.starts_at),
      endDate: normalizeDate(h.ends_at),
      isOnline: h.is_online ?? true,
      description: h.tagline || h.desc || '',
      prize: h.prize_amount ? `₹${h.prize_amount}` : '',
      url: `https://devfolio.co/hackathons/${h.slug}`,
      image: h.cover_image_url || '',
      source: 'devfolio',
    }));
  } catch (err) {
    console.error('Devfolio fetch error:', err.message);
    return [];
  }
}

async function fetchMLHHackathons() {
  try {
    const { data: html } = await axios.get('https://mlh.io/seasons/2026/events', {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TeamUP/1.0)',
      },
    });

    const $ = cheerio.load(html);
    const hackathons = [];

    $('.event').each((_, el) => {
      const title = $(el).find('.event-name').text().trim();
      const location = $(el).find('.event-location').text().trim();
      const dateText = $(el).find('.event-date').text().trim();
      const url = $(el).find('a.event-link').attr('href') || 'https://mlh.io';
      const image = $(el).find('img.event-image').attr('src') || '';

      const isOnline = location.toLowerCase().includes('online');

      hackathons.push({
        title: title || 'MLH Event',
        platform: 'MLH',
        location: location || 'Online',
        country: isOnline ? '' : 'USA',
        startDate: normalizeDate(dateText.split('–')[0]?.trim()),
        endDate: normalizeDate(dateText.split('–')[1]?.trim()),
        isOnline,
        description: 'An MLH Season 2026 official hackathon.',
        prize: '',
        url,
        image,
        source: 'mlh',
      });
    });

    return hackathons;
  } catch (err) {
    console.error('MLH scrape error:', err.message);
    return [];
  }
}

// Fallback mock data for when scrapers fail
function getFallbackHackathons() {
  const now = new Date();
  const future = (days) => new Date(now.getTime() + days * 86400000);

  return [
    {
      title: 'Smart India Hackathon 2026',
      platform: 'SIH',
      location: 'India',
      country: 'India',
      startDate: future(5),
      endDate: future(7),
      isOnline: false,
      description: 'National level hackathon organized by Government of India.',
      prize: '₹1,00,000',
      url: 'https://www.sih.gov.in',
      image: '',
      source: 'fallback',
    },
    {
      title: 'HackVadodara 2026',
      platform: 'Devfolio',
      location: 'Vadodara, Gujarat',
      country: 'India',
      startDate: future(10),
      endDate: future(11),
      isOnline: false,
      description: 'Gujarat\'s premier student hackathon.',
      prize: '₹50,000',
      url: 'https://devfolio.co/hackathons',
      image: '',
      source: 'fallback',
    },
    {
      title: 'Global AI Hackathon 2026',
      platform: 'Devpost',
      location: 'Online',
      country: '',
      startDate: future(2),
      endDate: future(4),
      isOnline: true,
      description: 'Build the next generation of AI-powered applications.',
      prize: '$50,000',
      url: 'https://devpost.com/hackathons',
      image: '',
      source: 'fallback',
    },
    {
      title: 'HackMIT 2026',
      platform: 'MLH',
      location: 'Cambridge, MA',
      country: 'USA',
      startDate: future(15),
      endDate: future(16),
      isOnline: false,
      description: 'MIT\'s flagship undergraduate hackathon.',
      prize: '$10,000',
      url: 'https://hackmit.org',
      image: '',
      source: 'fallback',
    },
    {
      title: 'ETHGlobal Bangkok',
      platform: 'ETHGlobal',
      location: 'Bangkok, Thailand',
      country: 'Thailand',
      startDate: future(20),
      endDate: future(22),
      isOnline: false,
      description: 'Build on Ethereum with the global Web3 community.',
      prize: '$500,000',
      url: 'https://ethglobal.com',
      image: '',
      source: 'fallback',
    },
    {
      title: 'Devfolio Open Hack',
      platform: 'Devfolio',
      location: 'Online',
      country: '',
      startDate: future(1),
      endDate: future(3),
      isOnline: true,
      description: 'Open hackathon for all developers across India.',
      prize: '₹25,000',
      url: 'https://devfolio.co',
      image: '',
      source: 'fallback',
    },
    {
      title: 'Hack Ahmedabad 2026',
      platform: 'Devfolio',
      location: 'Ahmedabad, Gujarat',
      country: 'India',
      startDate: future(25),
      endDate: future(26),
      isOnline: false,
      description: 'Ahmedabad\'s biggest student hackathon. Build. Learn. Win.',
      prize: '₹75,000',
      url: 'https://devfolio.co/hackathons',
      image: '',
      source: 'fallback',
    },
    {
      title: 'MLH Local Hack Day 2026',
      platform: 'MLH',
      location: 'Online',
      country: '',
      startDate: future(0),
      endDate: future(1),
      isOnline: true,
      description: 'A global hackathon day with thousands of hackers.',
      prize: '',
      url: 'https://mlh.io',
      image: '',
      source: 'fallback',
    },
    {
      title: 'Surat Startup Hackathon',
      platform: 'Local',
      location: 'Surat, Gujarat',
      country: 'India',
      startDate: future(30),
      endDate: future(31),
      isOnline: false,
      description: 'Connect with Surat\'s startup ecosystem and build solutions.',
      prize: '₹30,000',
      url: 'https://devfolio.co',
      image: '',
      source: 'fallback',
    },
    {
      title: 'NASA Space Apps Challenge',
      platform: 'NASA',
      location: 'Global / Online',
      country: '',
      startDate: future(45),
      endDate: future(47),
      isOnline: true,
      description: 'Build space tech solutions with NASA open data.',
      prize: 'Trips to NASA facilities',
      url: 'https://www.spaceappschallenge.org',
      image: '',
      source: 'fallback',
    },
  ];
}

module.exports = {
  fetchDevpostHackathons,
  fetchDevfolioHackathons,
  fetchMLHHackathons,
  getFallbackHackathons,
};
