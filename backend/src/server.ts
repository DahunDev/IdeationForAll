// src/app.ts
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import boardRoutes from "./routes/boardRoutes";

const cors = require("cors");

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/board", boardRoutes)

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
