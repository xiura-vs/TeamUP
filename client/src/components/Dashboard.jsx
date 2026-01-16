import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

const avatarMap = {
  male: ["/avatars/male1.jpg", "/avatars/male2.jpg"],
  female: ["/avatars/female1.png", "/avatars/female2.webp"],
  others: ["/avatars/others.jpg"],
};

function getRandomAvatar(gender) {
  const options = avatarMap[gender] || avatarMap.others;
  return options[Math.floor(Math.random() * options.length)];
}

export default function Dashboard() {
  const { userId } = useParams(); // <-- get userId from URL
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="welcome-card">
        <div className="dashboad-avatar-wrapper">
          <img
            src={getRandomAvatar(user.gender)}
            alt="avatar"
            className="dashboad-avatar"
          />
        </div>
        <div className="dashboad-welcome-text">
          <h1>Welcome back, {user.fullName}!</h1>
          <p>Ready to find your next winning team?</p>

          {user.skills && user.skills.length > 0 ? (
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
          <button className="dashboad-btn-primary">Find Teammates</button>
          <button className="dashboad-btn-outline">Edit Profile</button>
        </div>
      </div>
      <div className="recommended-hacakathons">
        <h2>Recommended Hackathons</h2>
      </div>
    </div>
  );
}
