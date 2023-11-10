import express from "express";
import path from "path";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => res.render("home"));

app.listen(3000, () => console.log("Example app listening on port 3000"));
