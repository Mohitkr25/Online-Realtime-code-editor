const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const actions = require("./src/Actions");

const server = http.createServer(app);

const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  // console.log(`socket Connected on ${socket.id}`);

  socket.on(actions.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    // console.log(clients);
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(actions.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });

  socket.on(actions.CODE_CHANGE, ({ roomId, code }) => {
    socket.in(roomId).emit(actions.CODE_CHANGE, { code });
  });

  socket.on(actions.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(actions.CODE_CHANGE, { code });
  });

  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(actions.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`listening on Port ${PORT}`);
});
