import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { toast } from "react-toastify";
import DashboardChat from "./DashboardChat";

const avatarMap = {
  male: "/avatars/male1.jpg",
  female: "/avatars/female1.png",
  others: "/avatars/others.jpg",
};

function getRandomAvatar(gender) {
  const options = avatarMap[gender] || avatarMap.others;
  return options[Math.floor(Math.random() * options.length)];
}

export default function Dashboard() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [showFullBio, setShowFullBio] = useState(false);

  const [connectionsCount, setConnectionsCount] = useState(0);
  const [requests, setRequests] = useState([]);

  const [inbox, setInbox] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const fetchConnectionsCount = async () => {
    const res = await fetch("http://localhost:5000/api/connections/count", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setConnectionsCount(data.count);
  };

  const fetchRequests = async () => {
    const res = await fetch("http://localhost:5000/api/connections/requests", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setRequests(data.requests || []);
  };

  const respondToRequest = async (requestId, action) => {
    await fetch("http://localhost:5000/api/connections/respond", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId, action }),
    });

    fetchRequests();
    fetchConnectionsCount();
  };

  useEffect(() => {
    fetchConnectionsCount();
    fetchRequests();

    const interval = setInterval(() => {
      fetchRequests();
      fetchConnectionsCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setUser(res.data);

        // ✅ generate avatar once
        setAvatar(getRandomAvatar(res.data.gender));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [userId, token]);

  useEffect(() => {
  if (!token) return;

  const fetchInbox = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/chat/inbox",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInbox(res.data.inbox || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  fetchInbox();

  // Poll every 4 seconds
  const interval = setInterval(fetchInbox, 4000);

  return () => clearInterval(interval);

}, [token]);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <div className="dashboad-avatar-wrapper">
          <img
            src={avatarMap[user.gender] || avatarMap.others}
            alt="avatar"
            className="dashboad-avatar"
          />
        </div>

        <div className="dashboad-welcome-text">
          <h1>Welcome back, {user.fullName}!</h1>
          <p>Ready to find your next winning team?</p>

          {user.bio && (
            <div className="dashboard-bio">
              <p className={`bio-text ${showFullBio ? "expanded" : ""}`}>
                {user.bio}
              </p>
              {user.bio.length > 80 && (
                <button
                  className="bio-toggle"
                  onClick={() => setShowFullBio((p) => !p)}
                >
                  {showFullBio ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {user.skills?.length > 0 ? (
            user.skills.map((skill, i) => (
              <span key={i} className="dashboad-skill-tag">
                {skill}
              </span>
            ))
          ) : (
            <p className="no-skills">No skills added yet</p>
          )}
        </div>

        <div className="dashboad-welcome-actions">
          <button
            className="dashboad-btn-primary"
            onClick={() => navigate(`/find-teammates/${userId}`)}
          >
            Find Teammates
          </button>
          <button
            className="dashboad-btn-outline"
            onClick={() => navigate(`/edit-profile/${user._id}`)}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="dashboard-stat">
        <h3>{connectionsCount}</h3>
        <p>Connections</p>
      </div>

      <h2 className="section-title">Connection Requests</h2>

      {requests.length === 0 && (
        <div className="no-requests">No new connection requests</div>
      )}

      {requests.map((req) => (
        <div key={req._id} className="request-card">
          <div className="request-user">
            <div className="request-avatar">{req.sender.fullName[0]}</div>
            <div>
              <h4>{req.sender.fullName}</h4>
              <p>{req.sender.college}</p>
            </div>
          </div>

          <div className="request-actions">
            <button
              className="accept-btn"
              onClick={() => {
                respondToRequest(req._id, "accepted");
                toast.success("Connection accepted 🎉");
              }}
            >
              Accept
            </button>

            <button
              className="reject-btn"
              onClick={() => {
                respondToRequest(req._id, "rejected");
                toast("Request rejected");
              }}
            >
              Reject
            </button>
          </div>
        </div>
      ))}

      <div className="dashboard-messages-layout">
        <div className="dashboard-messages-list">
          <h2>Messages</h2>

          {inbox.map((chat) => (
            <div
              key={chat.conversationId}
              className={`message-preview ${
                activeConversationId === chat.conversationId ? "active" : ""
              }`}
              onClick={() => {
                setActiveChatUser(chat.user);
                setActiveConversationId(chat.conversationId);
              }}
            >
              <div className="message-avatar">{chat.user.fullName[0]}</div>

              <div className="message-info">
                <h4>{chat.user.fullName}</h4>
                <p>{chat.lastMessage || "Start the conversation"}</p>
              </div>
            </div>
          ))}
        </div>

        <DashboardChat
          user={activeChatUser}
          conversationId={activeConversationId}
        />
      </div>
    </div>
  );
}
