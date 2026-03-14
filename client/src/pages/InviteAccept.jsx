import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInviteInfo, acceptInvite } from '../api';
import './InviteAccept.css';

export default function InviteAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const [invite, setInvite] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | accepting | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        const res = await getInviteInfo(token);
        setInvite(res.data.invite);
        setStatus('ready');
      } catch (err) {
        setMessage(err.response?.data?.message || 'Invalid or expired invitation link.');
        setStatus('error');
      }
    };
    fetchInvite();
  }, [token]);

  const handleAccept = async () => {
    if (!isLoggedIn) {
      // Store token in session so after login they can be redirected back
      sessionStorage.setItem('pendingInviteToken', token);
      navigate(`/login?redirect=/invite/${token}`);
      return;
    }
    setStatus('accepting');
    try {
      const res = await acceptInvite(token);
      setStatus('success');
      setMessage(res.data.message);
      setTimeout(() => navigate(`/team/${res.data.teamId}`), 1800);
    } catch (err) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to accept invite.');
    }
  };

  return (
    <div className="ia-page">
      <div className="ia-card">
        {status === 'loading' && (
          <div className="ia-loading">
            <div className="ia-spinner" />
            <p>Verifying invitation...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="ia-state ia-state--error">
            <div className="ia-icon">❌</div>
            <h2>Invitation Invalid</h2>
            <p>{message}</p>
            <Link to="/" className="ia-link-btn">Go Home</Link>
          </div>
        )}

        {status === 'success' && (
          <div className="ia-state ia-state--success">
            <div className="ia-icon">🎉</div>
            <h2>You're in!</h2>
            <p>{message} Redirecting to your team workspace…</p>
          </div>
        )}

        {(status === 'ready' || status === 'accepting') && invite && (
          <div className="ia-content">
            <div className="ia-badge">Team Invitation</div>
            <div className="ia-icon">🤝</div>
            <h1>You've been invited!</h1>
            <p className="ia-sub">Join the team on TeamUP</p>

            <div className="ia-team-card">
              <div className="ia-team-name">{invite.teamId?.name}</div>
              <div className="ia-team-idea">💡 {invite.teamId?.projectIdea}</div>
            </div>

            <button
              className="ia-btn"
              onClick={handleAccept}
              disabled={status === 'accepting'}
            >
              {status === 'accepting'
                ? 'Joining...'
                : isLoggedIn
                ? 'Accept Invitation →'
                : 'Log in to Accept →'}
            </button>

            {!isLoggedIn && (
              <p className="ia-signup-hint">
                Don't have an account?{' '}
                <Link to={`/signup?redirect=/invite/${token}`}>Sign up free</Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
