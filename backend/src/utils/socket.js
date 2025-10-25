import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export function getReceiverSocketId(userId){
  return userSocketMap[userId]
}

// Store mapping: userId → socket.id
const userSocketMap = {};

io.on("connection", (socket) => {
  // console.log("🟢 User connected:", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // Emit to everyone the list of online user IDs
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  // console.log("Online Users:", Object.keys(userSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    // console.log("🔴 User disconnected:", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
      // console.log("Updated Online Users:", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };
