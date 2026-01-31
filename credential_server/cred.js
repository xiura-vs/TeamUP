// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");

// dotenv.config();
// connectDB();

// const app = express();

// // security basics
// app.use(cors()); // configure origins in production
// app.use(express.json({ limit: "10kb" }));

// // routes
// app.use("/api/auth", require("./routes/authRoute"));
// app.use("/api/match", require("./routes/matchRoutes"));
// app.use("/api/chat", require("./routes/chatRoutes"));

// app.get("/", (req, res) => res.send("TeamUP credentials server"));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/match", require("./routes/matchRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));

app.get("/", (req, res) => res.send("TeamUP credentials server"));

const server = http.createServer(app);

//SOCKET.IO
const io = new Server(server, {
  cors: {
    origin: "*", // restrict in prod
    methods: ["GET", "POST"],
  },
});

app.set("io", io);

//SOCKET EVENTS
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`Server + Socket running on port ${PORT}`),
);
