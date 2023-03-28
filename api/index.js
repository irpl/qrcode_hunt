const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
require("dotenv").config();
var url = process.env.CLUTCH_DB_STRING;

// connect to databse
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// models
require("./models/Game");

// routes
app.get("/api/game", (req, res) => {
  Game.findOne({ event: req.query.event })
    .then((g) => res.json(g))
    .catch((err) => console.log(err));
});

app.get("/api/games", (req, res) => {
  Game.find()
    .then((g) => res.json(g))
    .catch((err) => console.log(err));
});

app.post("/api/game", (req, res) => {
  let newGame = new Game({
    event: req.body.event,
    gameMaker: req.body.gameMaker,
    quests: req.body.quests,
    duration: req.body.gameDuration,
  });

  newGame.save((err, g) => {
    if (err) res.json({ success: false });
    else res.json({ success: g });
  });
});

if (process.env.ENVIRONMENT == "dev") {
  const PORT = process.env.CLUTCH_PORT || 5000;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = app;
