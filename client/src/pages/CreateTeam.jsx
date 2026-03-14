import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTeam } from '../api';
import './CreateTeam.css';

export default function CreateTeam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    projectIdea: '',
    description: '',
    requiredSkills: '',
    maxMembers: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        requiredSkills: form.requiredSkills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        maxMembers: parseInt(form.maxMembers, 10),
      };
      const res = await createTeam(payload);
      navigate(`/team/${res.data.team._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ct-page">
      <div className="ct-card">
        <div className="ct-header">
          <div className="ct-icon">🚀</div>
          <h1>Create a Team</h1>
          <p>Start collaborating with the right people</p>
        </div>

        {error && <div className="ct-error">{error}</div>}

        <form onSubmit={handleSubmit} className="ct-form">
          <div className="ct-field">
            <label>Team Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. AI Builders"
              required
            />
          </div>

          <div className="ct-field">
            <label>Project Idea *</label>
            <input
              name="projectIdea"
              value={form.projectIdea}
              onChange={handleChange}
              placeholder="e.g. AI-powered Resume Analyzer"
              required
            />
          </div>

          <div className="ct-field">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="What are you building and why?"
              rows={4}
            />
          </div>

          <div className="ct-field">
            <label>Required Skills</label>
            <input
              name="requiredSkills"
              value={form.requiredSkills}
              onChange={handleChange}
              placeholder="React, Node.js, Python (comma-separated)"
            />
          </div>

          <div className="ct-field">
            <label>Max Team Size</label>
            <select
              name="maxMembers"
              value={form.maxMembers}
              onChange={handleChange}
            >
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} members
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="ct-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Team →'}
          </button>
        </form>
      </div>
    </div>
  );
}
