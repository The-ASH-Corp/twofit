import { ChatModel } from "../modules/chat/chat.model.js";
import redisClient from "../redis/redisClient.js";

// auth middleware for sockeyt.io
const socketAuth = (socket, next) => {
  const { userId, token } = socket.handshake.auth;

  if (!userId || !token) {
    return next(new Error("Unauthorized"));
  }

  // OPTIONAL: JWT verify here

  socket.userId = userId;
  next();
};

// room join handlers

const joinHandler = (io, socket) => {
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("broadcast", ({ roomId }) => {
    socket.join(roomId);
  });
};


// message Handlers
const messageHandler = (io, socket) => {
  socket.on("send_message", async ({ roomId, text, reciever }, ack) => {
    if (!text?.trim()) return;

    const msg = {
      roomId,
      sender: socket.userId,
      reciever,
      message: text,
      time: new Date(),
    };


    await ChatModel.updateOne(
      { roomId },
      {
        $setOnInsert: {
          roomId,
          participants: [socket.userId, reciever],
        },
        $push: { messages: msg },
      },
      { upsert: true }
    );

    io.to(roomId).emit("new_message", msg);

    ack?.({ ok: true });
  });
};


export default function initSocket(io) {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.userId);

    joinHandler(io, socket);
    messageHandler(io, socket);

    socket.on("leave_room", ({ roomId }) => {
      socket.leave(roomId);
    });


    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
}
