import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import "./ChatDrawer.css";

const socket = io("https://teamup-jdzz.onrender.com");

export default function ChatDrawer({ user, conversationId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [resolvedConversationId, setResolvedConversationId] = useState(null);

  const bottomRef = useRef(null);
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const otherUserId = user?._id || user?.id;

  useEffect(() => {
  if (!currentUser) return;

  const userId = currentUser._id || currentUser.id;

  socket.emit("join", userId);

}, [currentUser]);

  useEffect(() => {
    if (!user) return;

    if (!conversationId && !otherUserId) {
      console.error("ChatDrawer: otherUserId missing", user);
      return;
    }

    const resolveConversation = async () => {
      try {
        if (conversationId) {
          setResolvedConversationId(conversationId);
          return;
        }

        const res = await fetch(
          `https://teamup-jdzz.onrender.com/api/chat/conversation/${otherUserId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) throw new Error("Failed to resolve conversation");

        const data = await res.json();
        setResolvedConversationId(data.conversationId);
      } catch (err) {
        console.error("Resolve conversation error:", err);
      }
    };

    resolveConversation();
  }, [conversationId, otherUserId, token, user]);

  useEffect(() => {
    if (!resolvedConversationId) return;

    fetch(`https://teamup-jdzz.onrender.com/api/chat/messages/${resolvedConversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      })
      .catch((err) => console.error("Fetch messages error:", err));
  }, [resolvedConversationId, token]);

  useEffect(() => {
    if (!resolvedConversationId) return;

    const handleReceive = (msg) => {
      if (msg.sender === currentUser._id || currentUser.id) return;
      if (msg.conversation !== resolvedConversationId) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [resolvedConversationId, currentUser.id]);

  useEffect(() => {
    if (!resolvedConversationId) return;

    fetch(`https://teamup-jdzz.onrender.com/api/chat/read/${resolvedConversationId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }, [resolvedConversationId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !resolvedConversationId) return;

    try {
      const res = await fetch("https://teamup-jdzz.onrender.com/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: otherUserId,
          text,
        }),
      });

      const data = await res.json();
      if (!data.message) return;

      setMessages((prev) => [...prev, data.message]);
      setText("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  if (!user || !resolvedConversationId) return null;

  return (
    <motion.div
      className="chat-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="chat-drawer"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
      >
        {/* HEADER */}
        <div className="chat-header">
          <div className="chat-user">
            <div className="chat-avatar">
              {user.fullName[0]}
              <span className="online-dot" />
            </div>
            <div>
              <h4 style={{ color: "#fff" }}>{user.fullName}</h4>
              <p style={{ color: "#fff" }}>{user.college}</p>
            </div>
          </div>
          <button
            className="close-btn"
            onClick={onClose}
            style={{ color: "#333" }}
          >
            ✕
          </button>
        </div>

        {/* MESSAGES */}
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
      <span className="time">
        {new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  ))}
  <div ref={bottomRef} />
</div>

        {/* INPUT */}
        <div className="chat-input">
          <input
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button className="send-btn" onClick={sendMessage}>
            ➤
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
