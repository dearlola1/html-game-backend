const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const highScoreSchema = new mongoose.Schema({
  player: String,
  score: Number,
  character: String, // Add character field to schema
}, { collection: 'highscores' });

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.post('/highscores', async (req, res) => {
  try {
    const { player, score, character } = req.body;
    const highScore = new HighScore({ player, score, character });
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

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback for other routes
app.get('*', (req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
