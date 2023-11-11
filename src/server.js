import http from "http";
import SocketIO from "socket.io";
import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("home"));

const server = http.createServer(app);
const io = SocketIO(server);

io.on("connection", (socket) => {
  socket["nick"] = "anonymous";

  io.socketsJoin("announcement");

  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });

  socket.on("enter_room", (room, done) => {
    socket.join(room);
    done();
    socket.to(room).emit("welcome", socket.nick);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nick));
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
