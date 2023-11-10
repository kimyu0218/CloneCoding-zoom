import http from "http";
import WebSocket from "ws";
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
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "anonymous";
  console.log("Connected to Browser");

  socket.on("close", () => {
    console.log("Disconnected from Browser");
  });

  socket.on("message", (message) => {
    const parsed = JSON.parse(message.toString());
    switch (parsed.type) {
      case "chat":
        sockets.forEach((sock) =>
          sock.send(`[${socket.nickname}] ${parsed.payload}`)
        );
        break;
      case "nick":
        socket["nickname"] = parsed.payload;
        break;
    }
  });
});

server.listen(process.env.port, () =>
  console.log(`Example app listening on port ${process.env.port}`)
);
