import React, { useState } from 'react';
import { addTask } from '../api';
import TaskCard from './TaskCard';
import './TaskBoard.css';

const COLUMNS = [
  { key: 'todo', label: '📋 To Do' },
  { key: 'inprogress', label: '⚡ In Progress' },
  { key: 'completed', label: '✅ Completed' },
];

export default function TaskBoard({ teamId, tasks, members, onUpdate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', assignedTo: '' });
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      await addTask(teamId, {
        title: form.title.trim(),
        assignedTo: form.assignedTo || undefined,
      });
      setForm({ title: '', assignedTo: '' });
      setShowForm(false);
      onUpdate();
    } catch (err) {
      console.error('Failed to add task', err);
    } finally {
      setLoading(false);
    }
  };

  const byStatus = (status) => tasks.filter((t) => t.status === status);

  return (
    <div className="tb-wrap">
      <div className="tb-toolbar">
        <button className="tb-add-btn" onClick={() => setShowForm((v) => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Task'}
        </button>
      </div>

      {showForm && (
        <form className="tb-form" onSubmit={handleAdd}>
          <input
            className="tb-input"
            placeholder="Task title…"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            autoFocus
          />
          <select
            className="tb-select"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName}
              </option>
            ))}
          </select>
          <button className="tb-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Adding…' : 'Add Task'}
          </button>
        </form>
      )}

      <div className="tb-board">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`tb-col tb-col--${col.key}`}>
            <div className="tb-col-header">
              <span>{col.label}</span>
              <span className="tb-col-count">{byStatus(col.key).length}</span>
            </div>
            <div className="tb-col-cards">
              {byStatus(col.key).length === 0 ? (
                <div className="tb-empty">No tasks here</div>
              ) : (
                byStatus(col.key).map((task) => (
                  <TaskCard key={task._id} task={task} onUpdate={onUpdate} />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
