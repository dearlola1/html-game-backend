// models/highScore.js
const mongoose = require('mongoose');

const highScoreSchema = new mongoose.Schema({
    player: {
        type: String,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

module.exports = HighScore;
s