import http from "http";
import express from "express";
import path from "path";
import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (_, res) => res.render("home"));

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("join_room", (room) => {
    socket.join(room);
    socket.to(room).emit("welcome");
  });

  socket.on("offer", (offer, room) => {
    socket.to(room).emit("offer", offer);
  });

  socket.on("answer", (answer, room) => {
    socket.to(room).emit("answer", answer);
  });

  socket.on("ice", (ice, room) => {
    socket.to(room).emit("ice", ice);
  });
});

server.listen(process.env.port, () =>
  console.log(`Example app listening on port ${process.env.port}`)
);
