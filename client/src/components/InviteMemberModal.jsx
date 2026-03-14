import React, { useState } from 'react';
import { inviteMember } from '../api';
import './InviteMemberModal.css';

export default function InviteMemberModal({ teamId, onClose }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setMessage('');
    try {
      await inviteMember(teamId, email.trim());
      setStatus('success');
      setMessage(`Invitation sent to ${email}!`);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to send invite');
    }
  };

  return (
    <div className="imm-overlay" onClick={onClose}>
      <div className="imm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="imm-header">
          <h3>✉️ Invite a Member</h3>
          <button className="imm-close" onClick={onClose}>✕</button>
        </div>
        <p className="imm-desc">
          Enter the email address of the person you'd like to invite.
        </p>

        <form onSubmit={handleInvite} className="imm-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teammate@example.com"
            className="imm-input"
            required
          />
          <button
            type="submit"
            className="imm-btn"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send Invite'}
          </button>
        </form>

        {message && (
          <div className={`imm-msg imm-msg--${status}`}>{message}</div>
        )}
      </div>
    </div>
  );
}
