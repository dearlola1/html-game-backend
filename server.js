const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const highScoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
  character: String,
}, { collection: 'highscores' });

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.use((req, res, next) => {
  const apiKey = req.headers['authorization'];
  if (apiKey === `Bearer ${API_KEY}`) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

app.post('/highscores', async (req, res) => {
  try {
    const { player, score, character } = req.body;
    const highScore = new HighScore({ player, score, character });
    await highScore.save();
    res.status(201).send(highScore);
  } catch (error) {
    console.error('Error saving high score:', error);
    res.status(400).send(error);
  }
});

app.get('/highscores', async (req, res) => {
  try {
    const highScores = await HighScore.find().sort({ score: -1 }).exec();
    res.status(200).send(highScores);
  } catch (error) {
    console.error('Error fetching high scores:', error);
    res.status(500).send(error);
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
