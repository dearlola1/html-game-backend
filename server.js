const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.log('Could not connect to MongoDB...', err));

const highScoreSchema = new mongoose.Schema({
    player: String,
    score: Number,
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.post('/highscores', async (req, res) => {
    const { player, score } = req.body;
    const newHighScore = new HighScore({ player, score });
    await newHighScore.save();
    res.status(201).send(newHighScore);
});

app.get('/highscores', async (req, res) => {
    const highScores = await HighScore.find().sort({ score: -1 }).limit(10);
    res.send(highScores);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
