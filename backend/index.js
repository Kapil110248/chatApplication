// index.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server, io } from "./SocketIO/server.js";

dotenv.config();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// ✅ Inject io into req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ API Routes
app.use("/api/user", userRoute);
app.use("/api/message", messageRoute);

const PORT = 4002;
const URI = process.env.MONGODB_URI;

mongoose.connect(URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
