const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.set("useFindAndModify", false);

// Create Schema

const GameSchema = new Schema({
  event: {
    type: String,
    required: true,
  },
  gameMaker: {
    type: String,
    required: true,
  },
  quests: [
    {
      title: {
        type: String,
        required: true,
      },
      clue: {
        type: String,
        required: true,
      },
      hint: {
        type: String,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: String,
    required: true,
  },
});

module.exports = Game = mongoose.model("Games", GameSchema);
