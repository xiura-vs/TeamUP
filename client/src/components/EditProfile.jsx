import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./EditProfile.css";

export default function EditProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    fullName: "",
    college: "",
    gender: "prefer-not-to-say",
    bio: "",
    skills: "",
    linkedin: "",
    github: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setForm({
          fullName: res.data.fullName || "",
          college: res.data.college || "",
          gender: res.data.gender || "prefer-not-to-say",
          bio: res.data.bio || "",
          skills: res.data.skills?.join(", ") || "",
          linkedin: res.data.linkedin || "",
          github: res.data.github || "",
        });
      } catch (err) {
        toast.error("Failed to load profile ❌");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          ...form,
          skills: form.skills.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Profile updated successfully 🎉");
      navigate(`/dashboard/${userId}`);
    } catch {
      toast.error("Failed to update profile ❌");
    }
  };

  return (
    <div className="edit-profile-container">
      <form className="edit-profile-card" onSubmit={handleSubmit}>
        <h2>Edit Profile</h2>
        <p className="subtitle">Keep your profile fresh and professional</p>

        <div className="form-group">
          <label>Full Name</label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>College</label>
          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            maxLength={120}
            value={form.bio}
            onChange={handleChange}
            placeholder="Short bio (max 120 characters)"
          />
        </div>

        <div className="form-group">
          <label>Skills</label>
          <input
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
          />
        </div>

        <div className="form-group">
          <label>LinkedIn Profile</label>
          <input
            name="linkedin"
            type="url"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="https://www.linkedin.com/in/your-profile"
          />
        </div>

        <div className="form-group">
          <label>GitHub Profile</label>
          <input
            name="github"
            type="url"
            value={form.github}
            onChange={handleChange}
            placeholder="https://github.com/your-username"
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
