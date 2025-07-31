// SocketIO/server.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Track online users: { userId: socketId }
const users = {};

// ✅ Utility function to get socket ID from userId
export const getReceiverSocketId = (receiverId) => {
  return users[receiverId]; // socket.id or undefined
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    // ✅ Save userId to socketId mapping
    users[userId] = socket.id;

    // ✅ Join user to their personal room (very important)
    socket.join(userId);

    console.log(`🟢 User connected: ${userId} -> ${socket.id}`);
    console.log("🧑 All online users:", users);

    // ✅ Emit updated online user list
    io.emit("getOnlineUsers", Object.keys(users));
  }

  // ✅ Handle disconnect
  socket.on("disconnect", () => {
    for (const [uid, sid] of Object.entries(users)) {
      if (sid === socket.id) {
        delete users[uid];
        console.log(`🔴 User disconnected: ${uid}`);
        break;
      }
    }

    // ✅ Emit updated online list
    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, server, io };
