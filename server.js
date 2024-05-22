const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB...');
}).catch(err => {
    console.error('Could not connect to MongoDB...', err);
});

const highScoreSchema = new mongoose.Schema({
    player: String,
    score: Number
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.get('/highscores', async (req, res) => {
    try {
        const highScores = await HighScore.find().sort({ score: -1 }).limit(10);
        res.json(highScores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/highscores', async (req, res) => {
    const highScore = new HighScore({
        player: req.body.player,
        score: req.body.score
    });

    try {
        const newHighScore = await highScore.save();
        res.status(201).json(newHighScore);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
