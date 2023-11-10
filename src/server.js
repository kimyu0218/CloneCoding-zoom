import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("home"));

app.listen(process.env.port, () =>
  console.log(`Example app listening on port ${process.env.port}`)
);
