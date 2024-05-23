const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB...', err);
});

const highScoreSchema = new mongoose.Schema({
    player: String,
    score: Number
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.post('/highscores', async (req, res) => {
    const { player, score } = req.body;
    const highScore = new HighScore({ player, score });
    await highScore.save();
    res.status(201).send(highScore);
});

app.get('/highscores', async (req, res) => {
    const highScores = await HighScore.find().sort({ score: -1 }).limit(10);
    res.send(highScores);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
