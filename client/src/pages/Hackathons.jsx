import React, { useState, useEffect, useMemo } from 'react';
import HackathonSection from '../components/HackathonSection';
import api from '../api';
import './Hackathons.css';

const SECTIONS = [
  { key: 'live',     emoji: '🔴', title: 'Live Hackathons',     empty: 'No live hackathons right now.' },
  { key: 'upcoming', emoji: '🚀', title: 'Upcoming Hackathons', empty: 'No upcoming hackathons.' },
  { key: 'gujarat',  emoji: '🏛️', title: 'Gujarat Hackathons',  empty: 'No Gujarat hackathons found.' },
  { key: 'india',    emoji: '🇮🇳', title: 'India Hackathons',   empty: 'No India hackathons found.' },
  { key: 'global',   emoji: '🌍', title: 'Global Hackathons',   empty: 'No global hackathons found.' },
];

export default function Hackathons() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ mode: 'all', platform: 'all' });
  const [sort, setSort] = useState('nearest');

  useEffect(() => {
    api.get('/hackathons')
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load hackathons. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const platforms = useMemo(() => {
    const all = data.all || [];
    return ['all', ...new Set(all.map((h) => h.platform).filter(Boolean))];
  }, [data]);

  const filterAndSort = (list = []) => {
    let result = list;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (h) =>
          h.title?.toLowerCase().includes(q) ||
          h.location?.toLowerCase().includes(q) ||
          h.platform?.toLowerCase().includes(q) ||
          h.description?.toLowerCase().includes(q)
      );
    }

    if (filters.mode !== 'all') {
      result = result.filter((h) =>
        filters.mode === 'online' ? h.isOnline : !h.isOnline
      );
    }

    if (filters.platform !== 'all') {
      result = result.filter((h) => h.platform === filters.platform);
    }

    result = [...result].sort((a, b) => {
      if (sort === 'nearest') {
        return new Date(a.startDate || 0) - new Date(b.startDate || 0);
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return result;
  };

  const hasFilters = search || filters.mode !== 'all' || filters.platform !== 'all';

  return (
    <div className="hackathons-page">
      {/* Hero */}
      <div className="hack-hero">
        <div className="hack-hero-content">
          <div className="hack-hero-badge">⚡ Updated regularly</div>
          <h1 className="hack-hero-title">
            Find Your Next<br />
            <span className="hack-hero-accent">Hackathon</span>
          </h1>
          <p className="hack-hero-sub">
            Browse hackathons from Devpost, Devfolio, MLH and more. Find your team. Win together.
          </p>
        </div>
        <div className="hack-hero-decoration" aria-hidden="true">
          <div className="hack-orb hack-orb--1" />
          <div className="hack-orb hack-orb--2" />
        </div>
      </div>

      {/* Controls */}
      <div className="hack-controls">
        <div className="hack-search-wrap">
          <span className="hack-search-icon">🔍</span>
          <input
            className="hack-search"
            type="text"
            placeholder="Search hackathons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="hack-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>

        <div className="hack-filters">
          <select
            className="hack-select"
            value={filters.mode}
            onChange={(e) => setFilters((f) => ({ ...f, mode: e.target.value }))}
          >
            <option value="all">All Modes</option>
            <option value="online">Online Only</option>
            <option value="offline">Offline Only</option>
          </select>

          <select
            className="hack-select"
            value={filters.platform}
            onChange={(e) => setFilters((f) => ({ ...f, platform: e.target.value }))}
          >
            {platforms.map((p) => (
              <option key={p} value={p}>{p === 'all' ? 'All Platforms' : p}</option>
            ))}
          </select>

          <select
            className="hack-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="nearest">Nearest Date</option>
            <option value="newest">Newest Added</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="hack-content">
        {loading && (
          <div className="hack-state">
            <div className="hack-spinner" />
            <p>Fetching hackathons from Devpost, Devfolio, MLH...</p>
          </div>
        )}

        {error && !loading && (
          <div className="hack-state hack-state--error">
            <span style={{ fontSize: '2rem' }}>😕</span>
            <p>{error}</p>
            <button className="hack-retry" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {hasFilters ? (
              <HackathonSection
                title={`Search Results`}
                emoji="🔎"
                hackathons={filterAndSort(data.all)}
                emptyMsg="No hackathons match your filters."
              />
            ) : (
              SECTIONS.map((sec) => (
                <HackathonSection
                  key={sec.key}
                  title={sec.title}
                  emoji={sec.emoji}
                  hackathons={filterAndSort(data[sec.key])}
                  emptyMsg={sec.empty}
                />
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
