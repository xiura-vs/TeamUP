import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./DashboardChat.css";
import { useNavigate } from "react-router-dom";

export default function DashboardChat({ user, conversationId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/chat/messages/${conversationId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);

  }, [conversationId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !user) return;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chat/send",
        {
          receiverId: user._id || user.id,
          text,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.message) {
        setMessages((prev) => [...prev, res.data.message]);
        setText("");
      }
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (!user) {
    return <div className="chat-placeholder">Select a conversation</div>;
  }

  return (
    <div className="dashboard-chat">
      <div className="chat-header">
        <div className="chat-avatar">{user.fullName[0]}</div>
        <div>
          <h4>{user.fullName}</h4>
          <p style={{color:"#fff"}}>{user.college}</p>
        </div>
      </div>

      <div className="chat-body">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`msg ${
              String(msg.sender) === String(currentUser._id || currentUser.id)
                ? "outgoing"
                : "incoming"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <input
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}