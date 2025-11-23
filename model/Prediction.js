'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
    prediction: {type: Number, required: true},
    timestamp: {type: Date, required: true},
    latencyMs: {type: Number, required: true}
})

module.exports = mongoose.model("Prediction", PredictionSchema);