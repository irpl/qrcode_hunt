const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(morgan("combined"));
require("dotenv").config();
const url = process.env.CLUTCH_DB_STRING;

// connect to database
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// models
const Game = require("./models/Game");

const MAX_HINT_SIZE_BYTES = 2 * 1024 * 1024; // 2MB per hint (base64)

// routes
app.get("/api/game", (req, res) => {
  if (!req.query.event) {
    return res.status(400).json({ msg: "event parameter is required" });
  }
  Game.findOne({ event: req.query.event })
    .then((g) => {
      if (!g) return res.status(404).json({ msg: "game not found" });
      // Strip hint images from the initial response — fetched on demand
      const game = g.toObject();
      game.quests = game.quests.map(({ hint, ...q }) => q);
      res.json(game);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error" });
    });
});

app.get("/api/game/:id/hint/:questId", (req, res) => {
  Game.findById(req.params.id)
    .then((g) => {
      if (!g) return res.status(404).json({ msg: "game not found" });
      const quest = g.quests.id(req.params.questId);
      if (!quest) return res.status(404).json({ msg: "quest not found" });
      if (!quest.hint) return res.status(404).json({ msg: "no hint for this quest" });
      res.json({ hint: quest.hint });
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

app.post("/api/game", (req, res) => {
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

  for (const q of parsed_quests) {
    if (q.hint && Buffer.byteLength(q.hint, "utf8") > MAX_HINT_SIZE_BYTES) {
      return res.status(400).json({ success: false, msg: "hint image too large (max 2MB per quest)" });
    }
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
