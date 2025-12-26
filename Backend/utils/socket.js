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

  socket.on("broadcast", () => {
    socket.join(roomId);
  });
};

// save into mongo after redis reach 100 messages or server shutdown
const flushRoomToMongo = async (roomId,sender,reciever) => {
  const redisKey = `chat:${roomId}`;

  const messages = await redisClient.lRange(redisKey, 0, -1);
  if (!messages.length) return;

  const parsedMessages = messages.map(JSON.parse);

 await ChatModel.updateOne(
  { roomId },
  {
    $setOnInsert: {
      roomId,
      participants: [sender, reciever],
    },

    $push: {
      messages: { $each: parsedMessages },
    },
  },
  { upsert: true }
);

  await redisClient.del(redisKey);
};



// emergency save for all rooms
// const flushAllRooms = async () => {
//   const keys = await redisClient.keys("chat:*");

//   for (const key of keys) {
//     const roomId = key.replace("chat:", "");
//     await flushRoomToMongo(roomId);
//   }

// redisClient.on("end", async () => {
//   console.warn("⚠️ Redis connection ended");
//   await flushAllRooms();
// });

// };




// message Handlers
const messageHandler = (io, socket) => {
  socket.on("send_message", async ({ roomId, text, reciever }, ack) => {
    const msg = {
      sender: socket.userId,
      reciever: reciever,
      message: text,
      time: new Date(),
    };

    const redisKey = `chat:${roomId}`;

    await redisClient.rPush(redisKey, JSON.stringify(msg));
    socket.to(roomId).emit("new_message", msg);

    const count = await redisClient.lLen(redisKey);

    if (count >= 100) {
      await flushRoomToMongo(roomId,socket.userId,reciever);
    }
    if (typeof ack === "function") {
      ack({ ok: true });
    }
  });
};

export default function initSocket(io) {

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.userId);

    joinHandler(io, socket);
    messageHandler(io, socket);

    // add more handlers here

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);
    });
  });
}
