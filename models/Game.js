const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('useFindAndModify', false);

// Create Schema

const GameSchema = new Schema({
  event: {
    type: String,
    required: true
  },
  quests: [
    {
      title: {
        type: String,
        required: true
      },
      clue: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      completed: {
        type: Boolean,
        defaul: false
      }
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = Game = mongoose.model('Games', GameSchema);