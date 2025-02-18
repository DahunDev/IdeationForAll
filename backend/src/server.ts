// src/app.ts
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";
import postItRoutes from "./routes/postItRoutes";
import userRoutes from "./routes/userRoutes";
import { handlePostItWs } from "./wsHandlers/postItWsHandler";
import { Server } from "socket.io";
import * as http from "http"; // Correctly import http after @types/node installation

const cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/user", userRoutes);
app.use("/api/postit", postItRoutes);

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your frontend's URL in production for security
    methods: ["GET", "POST", "PATCH", "PUT"],
  },
});

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Use the WebSocket handler for post-it events
  handlePostItWs(socket);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
