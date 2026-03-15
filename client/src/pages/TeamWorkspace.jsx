import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTeamWorkspace, completeProject } from "../api";
import TeamMembers from "../components/TeamMembers";
import TeamChat from "../components/TeamChat";
import TaskBoard from "../components/TaskBoard";
import ResourceList from "../components/ResourceList";
import { toast } from "react-toastify";
import "./TeamWorkspace.css";

const TABS = ["Chat", "Tasks", "Resources"];

export default function TeamWorkspace() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Chat");
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchWorkspace();

    const interval = setInterval(() => {
      fetchWorkspace();
    }, 3000); // refresh every 3 seconds

    return () => clearInterval(interval);
  }, [teamId]);

  // Decode current user from JWT stored in localStorage
  const getCurrentUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id || payload._id || payload.userId;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const fetchWorkspace = useCallback(async () => {
    try {
      const res = await getTeamWorkspace(teamId);
      setWorkspace(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workspace");
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  const handleComplete = () => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <p>Mark this project as completed?</p>
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            <button
              className="confirm-btn"
              onClick={() => {
                closeToast();
                completeProject(); // your API call
              }}
            >
              Yes, Complete
            </button>

            <button className="cancel-btn" onClick={closeToast}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
      },
    );
  };

  if (loading) {
    return (
      <div className="tw-loading">
        <div className="tw-spinner" />
        <p>Loading workspace…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tw-error-page">
        <div className="tw-error-card">
          <div className="tw-error-icon">🔒</div>
          <h2>Access Denied</h2>
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="tw-back-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { team, tasks, resources } = workspace;
  const isLeader = team.leader._id === currentUserId;

  return (
    <div className="tw-page">
      {/* ── Hero Header ── */}
      <div
        className={`tw-hero ${team.status === "completed" ? "tw-hero--done" : ""}`}
      >
        <div className="tw-hero-inner">
          <div className="tw-hero-left">
            <div className="tw-status-badge">
              {team.status === "completed" ? "✅ Completed" : "🚀 Active"}
            </div>
            <h1 className="tw-team-name">{team.name}</h1>
            <p className="tw-project-idea">💡 {team.projectIdea}</p>
            {team.description && (
              <p className="tw-description">{team.description}</p>
            )}
            {team.requiredSkills.length > 0 && (
              <div className="tw-skills">
                {team.requiredSkills.map((s) => (
                  <span key={s} className="tw-skill-tag">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="tw-hero-right">
            {isLeader && team.status === "active" && (
              <button
                className="tw-complete-btn"
                onClick={handleComplete}
                disabled={completing}
              >
                {completing ? "Updating…" : "🏁 Mark Completed"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="tw-layout">
        {/* Sidebar: Members */}
        <aside className="tw-sidebar">
          <TeamMembers
            team={team}
            currentUserId={currentUserId}
            onUpdate={fetchWorkspace}
          />
        </aside>

        {/* Main content: Tabs */}
        <main className="tw-main">
          <div className="tw-tabs">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`tw-tab ${activeTab === tab ? "tw-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Chat" && "💬 "}
                {tab === "Tasks" && "📋 "}
                {tab === "Resources" && "🔗 "}
                {tab}
              </button>
            ))}
          </div>

          <div className="tw-tab-content">
            {activeTab === "Chat" && (
              <TeamChat
                teamId={teamId}
                currentUserId={currentUserId}
                members={team.members}
              />
            )}
            {activeTab === "Tasks" && (
              <TaskBoard
                teamId={teamId}
                tasks={tasks}
                members={team.members}
                onUpdate={fetchWorkspace}
              />
            )}
            {activeTab === "Resources" && (
              <ResourceList
                teamId={teamId}
                resources={resources}
                onUpdate={fetchWorkspace}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
