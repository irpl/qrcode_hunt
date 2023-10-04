const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const multer = require("multer");

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));
require("dotenv").config();
var url = process.env.CLUTCH_DB_STRING;

var upload = multer();

const multerConf = upload.fields([
  { name: "quests[]", maxCount: 20 },
  { name: "gameMaker", maxCount: 1 },
  { name: "event", maxCount: 1 },
  { name: "gameDuration", maxCount: 1 },
  { name: "success", maxCount: 1 },
]);

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
    .then((g) => {
      console.log("returned game");
      res.json({msg: "deep"})
    })
    .catch((err) => {
      console.log(err)
      res.json({msg: "error"})
    });
});

app.get("/api/games", (req, res) => {
  Game.find()
    .then((g) => res.json(g))
    .catch((err) => console.log(err));
});

app.post("/api/game", multerConf, (req, res) => {
  const { gameMaker, event, gameDuration, success, quests } = req.body;

  var parsed_quests = quests.map((quest) => JSON.parse(quest));

  const newGame = new Game({
    event: event,
    gameMaker: gameMaker,
    quests: parsed_quests,
    duration: gameDuration,
  });

  newGame.save((err, g) => {
    if (err) {
      console.log(err);
      res.json({ success: false });
    } else res.json({ success: g });
  });
});

if (process.env.ENVIRONMENT == "dev") {
  const PORT = process.env.CLUTCH_PORT || 5000;
  app.listen(PORT, () => console.log(`Running on port ${PORT}`));
}

module.exports = app;
