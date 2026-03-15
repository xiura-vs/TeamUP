import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ChatDrawer from "./ChatDrawer";
import "./AllProfiles.css";

export default function AllProfiles() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChatUser, setActiveChatUser] = useState(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id || currentUser?._id;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("https://teamup-jdzz.onrender.com/api/auth/all-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        toast.error("Failed to load users ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  // remove self

  return (
    <div className="all-profiles-container">
      <h1>All Profiles</h1>
      <p className="subtitle">Browse and connect with all available users</p>

      {loading && <p>Loading profiles...</p>}

      <div className="profiles-grid">
        {users.map((user) => (
          <motion.div key={user._id} className="profile-card">
            {console.log(
              "RENDERING:",
              users.map((u) => u.fullName),
            )}
            <div className="profile-header">
              <div className="avatar">{user.fullName[0]}</div>

              <div className="profile-basic">
                <h4>{user.fullName}</h4>
                <p className="college">{user.college}</p>
              </div>
            </div>

            <p className="bio">{user.bio || "No bio added yet"}</p>

            <div className="skills">
              {user.skills?.map((skill) => (
                <span key={skill} className="skill-pill">
                  {skill}
                </span>
              ))}
            </div>

            <div className="profile-actions">
              <button
                className="btn-primary"
                onClick={async () => {
                  console.log("CONNECT CLICKED", user._id);

                  try {
                    const res = await fetch(
                      "https://teamup-jdzz.onrender.com/api/connections/send",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ receiverId: user._id }),
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
                onClick={() => setActiveChatUser(user)}
              >
                💬 Message
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CHAT DRAWER */}
      {activeChatUser && (
        <ChatDrawer
          user={activeChatUser}
          conversationId={null}
          onClose={() => setActiveChatUser(null)}
        />
      )}
    </div>
  );
}
