const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure cors is required here
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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
    const highScores = await HighScore.find().sort({ score: -1 }).exec();
    res.status(200).send(highScores);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
