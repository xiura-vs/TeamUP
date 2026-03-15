import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ChatDrawer from "./ChatDrawer";
import "./FindTeammates.css";
import { useNavigate } from "react-router-dom";

export default function FindTeammates() {
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  const [projectIdea, setProjectIdea] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const navigate = useNavigate();

  const filteredMatches = matches.filter(
    ({ user }) => user.id !== currentUserId,
  );

  const flushSkillInput = () => {
    if (!skillInput.trim()) return [];

    const newSkills = skillInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    setSkills((prev) => Array.from(new Set([...prev, ...newSkills])));
    setSkillInput("");
    return newSkills;
  };

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      flushSkillInput();
    }
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleFindMatches = async () => {
    if (!projectIdea.trim()) {
      setError("Please enter a project description");
      return;
    }

    const flushedSkills = flushSkillInput();
    const finalSkills = [...skills, ...flushedSkills];

    try {
      setLoading(true);
      setError("");
      setMatches([]);
      setHasSearched(true);

      const res = await fetch("https://teamup-jdzz.onrender.com/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          projectDescription: projectIdea,
          requiredSkills: finalSkills,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Matching failed");
        return;
      }

      setMatches(data.matchedTeammates || []);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="find-container">
      <button
        className="btn-outline"
        onClick={() => navigate("/browse-profiles")}
      >
        Browse All Profiles
      </button>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="title"
      >
        Find Your Perfect Teammates
      </motion.h1>

      <p className="card-subtitle">
        Describe your project and required skills to get AI-matched suggestions.
      </p>

      <div className="content">
        {/* LEFT PANEL */}
        <motion.div
          className="search-card"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h3>Search Criteria</h3>
          <p className="hint">Refine your search to get better matches</p>

          <label>Project Idea / Description</label>
          <textarea
            placeholder="e.g. Building a fintech app..."
            value={projectIdea}
            onChange={(e) => setProjectIdea(e.target.value)}
          />

          <label>Required Skills</label>
          <input
            type="text"
            placeholder="Type skills (comma separated)"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleAddSkill}
          />

          <div className="skills">
            {skills.map((skill) => (
              <span key={skill} onClick={() => removeSkill(skill)}>
                {skill} ✕
              </span>
            ))}
          </div>

          <button
            className="find-btn"
            onClick={handleFindMatches}
            disabled={loading}
          >
            {loading ? "Finding matches..." : "Find Matches"}
          </button>
        </motion.div>

        {/* RIGHT RESULTS */}
        <motion.div
          className="results-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* LOADING */}
          {loading && <p>🔄 Matching teammates...</p>}

          {/* ERROR */}
          {!loading && error && <p className="error-text">{error}</p>}

          {/* INITIAL STATE */}
          {!loading && !error && !hasSearched && (
            <div className="results-placeholder">
              <div className="search-icon">🔍</div>
              <h3>Ready to search?</h3>
              <p>Enter your project details to see matched teammates here.</p>
            </div>
          )}

          {/* NO RESULTS */}
          {!loading &&
            !error &&
            hasSearched &&
            filteredMatches.length === 0 && (
              <div className="no-results">
                <div className="no-results-icon">😕</div>
                <h3>No matching teammates found</h3>
                <p>Try adjusting your skills or project description.</p>
              </div>
            )}

          {/* RESULTS */}
          {!loading && !error && filteredMatches.length > 0 && (
            <div className="results-grid">
              {filteredMatches.map(({ user, score }) => (
                <motion.div
                  key={user.id}
                  className="match-row"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="match-left">
                    <div className="avatar-block">
                      <div className="avatar">{user.fullName.charAt(0)}</div>
                      <span className="match-score">{score}% Match</span>
                    </div>

                    <div className="match-info">
                      <h4>{user.fullName}</h4>
                      <p className="card-subtitle">
                        student • {user.bio?.slice(0, 30) || "TeamUP Member"}
                      </p>

                      <div className="skills-block">
                        <span className="skills-title">MATCHING SKILLS</span>
                        <div className="skills">
                          {user.skills.map((skill) => (
                            <span key={skill} className="skill-pill">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="match-actions">
                    <button
                      className="btn-primary"
                      onClick={async () => {
                        try {
                          const res = await fetch(
                            "https://teamup-jdzz.onrender.com/api/connections/send",
                            {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                              body: JSON.stringify({ receiverId: user.id }),
                            },
                          );

                          const data = await res.json();

                          if (!res.ok) {
                            if (data.status === "accepted") {
                              toast.error("You are already connected ❌");
                              return;
                            }

                            if (data.status === "pending") {
                              toast.info("Connection request already sent ⏳");
                              return;
                            }

                            if (data.status === "rejected") {
                              toast.info(
                                "Request was rejected earlier. You can send again 👍",
                              );
                              return;
                            }

                            toast.error(data.message || "Request failed");
                            return;
                          }

                          // 🟢 SUCCESS (pending)
                          toast.success("Connection request sent 🚀");
                        } catch (err) {
                          toast.error("Server error ⚠️");
                        }
                      }}
                    >
                      🤝 Connect
                    </button>

                    <button
                      className="btn-outline"
                      onClick={() => {
                        setActiveChatUser(user);
                        setConversationId(null);
                      }}
                    >
                      💬 Message
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* CHAT DRAWER */}
      {activeChatUser && (
        <ChatDrawer
          user={activeChatUser}
          conversationId={conversationId}
          onClose={() => {
            setActiveChatUser(null);
            setConversationId(null);
          }}
        />
      )}
    </div>
  );
}
