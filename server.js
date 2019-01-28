const express = require('express');         
const mongoose = require('mongoose');       
const bodyParser = require('body-parser');   
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client', 'dist')));

var url = "mongodb://clutch:clutch123@cluster0-shard-00-00-z8dcu.mongodb.net:27017,cluster0-shard-00-01-z8dcu.mongodb.net:27017,cluster0-shard-00-02-z8dcu.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true";

// connect to databse
mongoose
  .connect(url, { useNewUrlParser: true })
  .then( () => console.log('MongoDB connected') )
  .catch( err => console.log(err) )

// models
require('./models/Game');


// routes
app.get('/', (req, res) => {
  app.send("/client/dist/index.html");
});

app.get('/game', (req, res) => {
  Game
    .findOne({event: req.query.event})
    .then(g => res.json(g))
    .catch(err => console.log(err))
});

app.post('/game', (req, res) => {
  let newGame = new Game({
    event: req.body.event,
    quests: req.body.quests
  });

  newGame
    .save((err) => {
      if (err) res.json({success: false});
      else res.json({success: true});
    })
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
// app.listen();
