import http from "http";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (_, res) => res.render("home"));

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});
instrument(io, { auth: false });

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (!sids.get(key)) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}

function countRoom(room) {
  return io.sockets.adapter.rooms.get(room)?.size;
}

io.on("connection", (socket) => {
  socket["nick"] = "anonymous";
  io.sockets.emit("room_change", publicRooms());

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (room, done) => {
    socket.join(room);
    done();
    socket.to(room).emit("welcome", socket.nick, countRoom(room));
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nick, countRoom(room) - 1)
    );
  });

  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("chat", (msg, room, done) => {
    socket.to(room).emit("chat", `[${socket.nick}]: ${msg}`);
    done();
  });

  socket.on("nick", (nickname) => (socket["nick"] = nickname));
});

server.listen(process.env.port, () =>
  console.log(`Example app listening on port ${process.env.port}`)
);
