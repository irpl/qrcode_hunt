const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const multer = require("multer");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));
require("dotenv").config();
const url = process.env.CLUTCH_DB_STRING;

const upload = multer();

const multerConf = upload.fields([
  { name: "quests[]", maxCount: 20 },
  { name: "gameMaker", maxCount: 1 },
  { name: "event", maxCount: 1 },
  { name: "gameDuration", maxCount: 1 },
]);

// connect to database
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// models
const Game = require("./models/Game");

// routes
app.get("/api/game", (req, res) => {
  if (!req.query.event) {
    return res.status(400).json({ msg: "event parameter is required" });
  }
  Game.findOne({ event: req.query.event })
    .then((g) => {
      if (!g) return res.status(404).json({ msg: "game not found" });
      res.json(g);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error" });
    });
});

app.get("/api/games", (req, res) => {
  Game.find()
    .then((g) => res.json(g))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error" });
    });
});

app.post("/api/game", multerConf, (req, res) => {
  const { gameMaker, event, gameDuration, quests } = req.body;

  if (!gameMaker || !event || !gameDuration || !quests) {
    return res.status(400).json({ success: false, msg: "missing required fields" });
  }

  if (!Array.isArray(quests) || quests.length === 0) {
    return res.status(400).json({ success: false, msg: "quests must be a non-empty array" });
  }

  let parsed_quests;
  try {
    parsed_quests = quests.map((quest) => JSON.parse(quest));
  } catch (e) {
    return res.status(400).json({ success: false, msg: "invalid quest data" });
  }

  const newGame = new Game({
    event,
    gameMaker,
    quests: parsed_quests,
    duration: gameDuration,
  });

  newGame
    .save()
    .then((g) => res.json({ success: g }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({ success: false, msg: "failed to save game" });
    });
});

if (process.env.ENVIRONMENT === "dev") {
  const PORT = process.env.CLUTCH_PORT || 5000;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = app;
