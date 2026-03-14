import React, { useState } from 'react';
import { removeMember, leaveTeam } from '../api';
import InviteMemberModal from './InviteMemberModal';
import './TeamMembers.css';

export default function TeamMembers({ team, currentUserId, onUpdate }) {
  const [showInvite, setShowInvite] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const isLeader = team.leader._id === currentUserId;

  const handleRemove = async (memberId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    setLoadingId(memberId);
    try {
      await removeMember(team._id, memberId);
      onUpdate();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member');
    } finally {
      setLoadingId(null);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    try {
      await leaveTeam(team._id);
      window.location.href = '/dashboard/' + currentUserId;
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave team');
    }
  };

  const getInitials = (name) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="tm-section">
      <div className="tm-header">
        <h3>
          Members{' '}
          <span className="tm-count">
            {team.members.length}/{team.maxMembers}
          </span>
        </h3>
        {isLeader && (
          <button className="tm-invite-btn" onClick={() => setShowInvite(true)}>
            + Invite
          </button>
        )}
      </div>

      <div className="tm-list">
        {team.members.map((member) => {
          const isThisLeader = member._id === team.leader._id;
          const isCurrentUser = member._id === currentUserId;
          return (
            <div key={member._id} className="tm-member">
              <div className="tm-avatar">{getInitials(member.fullName)}</div>
              <div className="tm-info">
                <div className="tm-name">
                  {member.fullName}
                  {isCurrentUser && <span className="tm-you"> (you)</span>}
                </div>
                <div className={`tm-role ${isThisLeader ? 'tm-role--leader' : ''}`}>
                  {isThisLeader ? '👑 Leader' : 'Member'}
                </div>
              </div>
              <div className="tm-actions">
                {isLeader && !isThisLeader && (
                  <button
                    className="tm-remove-btn"
                    onClick={() => handleRemove(member._id)}
                    disabled={loadingId === member._id}
                  >
                    {loadingId === member._id ? '...' : 'Remove'}
                  </button>
                )}
                {!isLeader && isCurrentUser && (
                  <button className="tm-leave-btn" onClick={handleLeave}>
                    Leave
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showInvite && (
        <InviteMemberModal
          teamId={team._id}
          onClose={() => setShowInvite(false)}
        />
      )}
    </div>
  );
}
