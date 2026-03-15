import React, { useState, useEffect, useRef } from "react";
import { getMessages, sendMessage } from "../api";
import "./TeamChat.css";

export default function TeamChat({ teamId, currentUserId, members }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await getMessages(teamId);
      setMessages(res.data.messages);
    } catch (err) {
      console.error("Failed to load messages", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); // poll every 5s
    return () => clearInterval(interval);
  }, [teamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      const res = await sendMessage(teamId, text.trim());
      setText("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString();
  };

  // Group messages by date
  const grouped = messages.reduce((acc, msg) => {
    const date = formatDate(msg.createdAt);
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="tc-wrap">
      <div className="tc-messages">
        {messages.length === 0 && (
          <div className="tc-empty">
            <span>💬</span>
            <p>No messages yet. Say hello to your team!</p>
          </div>
        )}

        {Object.entries(grouped).map(([date, msgs]) => (
          <div key={date}>
            <div className="tc-date-divider">
              <span>{date}</span>
            </div>
            {msgs.map((msg) => {
              const isMe = msg.senderId._id === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`tc-bubble-row ${isMe ? "tc-bubble-row--me" : ""}`}
                >
                  {!isMe && (
                    <div className="tc-avatar">
                      {msg.senderId.fullName?.[0]?.toUpperCase() || "?"}
                    </div>
                  )}
                  <div className={`tc-bubble ${isMe ? "tc-bubble--me" : ""}`}>
                    {!isMe && (
                      <div className="tc-sender">{msg.senderId.fullName}</div>
                    )}
                    <div className="tc-text">{msg.message}</div>
                    <div className="tc-time">{formatTime(msg.createdAt)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form className="tc-input-row" onSubmit={handleSend}>
        <input
          className="tc-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <button
          className="tc-send-btn"
          type="submit"
          disabled={sending || !text.trim()}
        >
          {sending ? "…" : "➤"}
        </button>
      </form>
    </div>
  );
}
