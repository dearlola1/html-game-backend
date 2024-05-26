const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const highScoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
}, { collection: 'highscores' });

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.post('/highscores', async (req, res) => {
  try {
    const highScore = new HighScore(req.body);
    await highScore.save();
    res.status(201).send(highScore);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/highscores', async (req, res) => {
  try {
    const highScores = await HighScore.find().sort({ score: -1 }).exec(); // Get all scores sorted by score in descending order
    res.status(200).send(highScores);
  } catch (error) {
    res.status(500).send(error);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
