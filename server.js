const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the cors package

const app = express();

require('dotenv').config();

app.use(cors()); // Use the cors middleware
app.use(express.json());

const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const highScoreSchema = new mongoose.Schema({
    player: String,
    score: Number,
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

app.post('/highscores', async (req, res) => {
    const highScore = new HighScore({
        player: req.body.player,
        score: req.body.score,
    });

    await highScore.save();
    res.status(201).send(highScore);
});

app.get('/highscores', async (req, res) => {
    const highScores = await HighScore.find().sort({ score: -1 }).limit(10);
    res.send(highScores);
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
