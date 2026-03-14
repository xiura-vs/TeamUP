import React, { useState } from 'react';
import { addResource } from '../api';
import './ResourceList.css';

const getLinkIcon = (url) => {
  if (url.includes('github.com')) return '🐙';
  if (url.includes('drive.google.com') || url.includes('docs.google.com')) return '📁';
  if (url.includes('notion.so') || url.includes('notion.site')) return '📝';
  if (url.includes('figma.com')) return '🎨';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return '▶️';
  return '🔗';
};

export default function ResourceList({ teamId, resources, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', url: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.url.trim()) return;
    setLoading(true);
    try {
      let url = form.url.trim();
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
      await addResource(teamId, { title: form.title.trim(), url });
      setForm({ title: '', url: '' });
      setShowForm(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to add resource', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rl-wrap">
      <div className="rl-toolbar">
        <button className="rl-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancel' : '+ Share Link'}
        </button>
      </div>

      {showForm && (
        <form className="rl-form" onSubmit={handleAdd}>
          <input
            className="rl-input"
            placeholder="Title (e.g. GitHub Repo)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            autoFocus
          />
          <input
            className="rl-input"
            placeholder="URL (e.g. https://github.com/…)"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
          />
          <button className="rl-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Adding…' : 'Add'}
          </button>
        </form>
      )}

      {resources.length === 0 && !showForm ? (
        <div className="rl-empty">
          <span>📂</span>
          <p>No resources shared yet. Add a GitHub repo, Notion doc, or any useful link.</p>
        </div>
      ) : (
        <div className="rl-list">
          {resources.map((r) => (
            <a
              key={r._id}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rl-item"
            >
              <span className="rl-icon">{getLinkIcon(r.url)}</span>
              <div className="rl-info">
                <div className="rl-title">{r.title}</div>
                <div className="rl-url">{r.url}</div>
              </div>
              <div className="rl-meta">
                <span className="rl-by">{r.addedBy?.fullName}</span>
                <span className="rl-arrow">↗</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
