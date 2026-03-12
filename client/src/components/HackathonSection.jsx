import React from 'react';
import HackathonCard from './HackathonCard';
import './HackathonSection.css';

export default function HackathonSection({ title, emoji, hackathons, emptyMsg }) {
  if (!hackathons || hackathons.length === 0) return null;

  return (
    <section className="hack-section">
      <div className="hack-section-header">
        <span className="hack-section-emoji">{emoji}</span>
        <h2 className="hack-section-title">{title}</h2>
        <span className="hack-section-count">{hackathons.length}</span>
      </div>
      <div className="hack-section-grid">
        {hackathons.map((h) => (
          <HackathonCard key={h._id || h.url} hackathon={h} />
        ))}
      </div>
      {hackathons.length === 0 && emptyMsg && (
        <p className="hack-section-empty">{emptyMsg}</p>
      )}
    </section>
  );
}
