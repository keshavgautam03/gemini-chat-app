import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// Check for required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI', 'GEMINI_API_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('ERROR: Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: [
    "http://localhost:5173", // for local development
    "https://gemini-chat-app-rho.vercel.app" // your Vercel frontend
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// ─── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected:", mongoose.connection.host);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// ─── Static‐Serve React App ────────────────────────────────────────────────────
// 1) Serve everything in /public
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "public")));

// 2) All non‐API GETs should return the React app
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    // Let API routes 404 normally if they’re undefined
    return res.status(404).end();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
  console.log('Environment variables configured:');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? 'Yes' : 'No');
  console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'Yes' : 'No');
  console.log('- GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');
});
