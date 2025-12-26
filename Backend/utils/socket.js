// auth middleware for sockeyt.io

// const socketAuth = (socket, next) => {
//   const { userId, token } = socket.handshake.auth;

//   if (!userId || !token) {
//     return next(new Error("Unauthorized"));
//   }

//   // OPTIONAL: JWT verify here

//   socket.userId = userId;
//   next();
// };


// room join handlers

// export default function joinHandler(io, socket) {
//   socket.on("join_private", ({ otherUserId }) => {
//     const roomId = getPrivateRoomId(socket.userId, otherUserId);
//     socket.join(roomId);
//   });

//   socket.on("join_room", ({ roomId }) => {
//     socket.join(roomId);
//   });
// }



// message Handlers
// export default function messageHandler(io, socket) {
//   socket.on("send_message", async ({ roomId, text }, ack) => {
//     const msg = {
//       sender: socket.userId,
//       message: text,
//       time: Date.now(),
//     };

//     await redis.rpush(`chat:${roomId}`, JSON.stringify(msg));
//     socket.to(roomId).emit("new_message", msg);

//     ack({ ok: true });
//   });
// }



export default function initSocket(io) {
//   io.use(socketAuth);
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    // joinHandler(io,socket)
    // messageHandler(io,socket)

    // add more handlers here

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}
