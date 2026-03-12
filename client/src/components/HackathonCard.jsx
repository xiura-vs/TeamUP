import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HackathonCard.css';

const formatDate = (dateStr) => {
  if (!dateStr) return 'TBA';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const platformColors = {
  Devpost: '#003e54',
  Devfolio: '#3770FF',
  MLH: '#D94B60',
  SIH: '#FF6B00',
  ETHGlobal: '#6F7CBA',
  NASA: '#0B3D91',
  default: '#6C47FF',
};

export default function HackathonCard({ hackathon }) {
  const navigate = useNavigate();
  const {
    title,
    platform,
    location,
    startDate,
    endDate,
    isOnline,
    description,
    prize,
    url,
    image,
  } = hackathon;

  const accentColor = platformColors[platform] || platformColors.default;

  return (
    <div className="hack-card">
      {image && (
        <div className="hack-card-image" style={{ backgroundImage: `url(${image})` }} />
      )}
      {!image && (
        <div className="hack-card-image hack-card-image--placeholder" style={{ background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)` }}>
          <span className="hack-card-emoji">⚡</span>
        </div>
      )}

      <div className="hack-card-body">
        <div className="hack-card-header">
          <span className="hack-card-platform" style={{ background: accentColor }}>
            {platform}
          </span>
          <span className={`hack-card-badge ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? '🌐 Online' : '📍 Offline'}
          </span>
        </div>

        <h3 className="hack-card-title">{title}</h3>

        {description && (
          <p className="hack-card-desc">{description.slice(0, 100)}{description.length > 100 ? '...' : ''}</p>
        )}

        <div className="hack-card-meta">
          <div className="hack-card-meta-row">
            <span className="meta-icon">📅</span>
            <span>{formatDate(startDate)} – {formatDate(endDate)}</span>
          </div>
          <div className="hack-card-meta-row">
            <span className="meta-icon">📍</span>
            <span>{location || 'Online'}</span>
          </div>
          {prize && (
            <div className="hack-card-meta-row">
              <span className="meta-icon">🏆</span>
              <span className="hack-card-prize">{prize}</span>
            </div>
          )}
        </div>

        <div className="hack-card-actions">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-view"
            style={{ '--accent': accentColor }}
          >
            View Hackathon ↗
          </a>
          <button
            className="btn-team"
            onClick={() => navigate('/browse-profiles')}
          >
            Find Team
          </button>
        </div>
      </div>
    </div>
  );
}
