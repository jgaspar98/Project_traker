const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const movieSchema = new Schema(
    {
        title: String,
        year: String,
        genre: String,
        director: String,
        writer: String,
        actor: String,
        plot: String,
        awards: String,
        poster: String,
        rating: String,
        boxoffice: String,
        production: String,
        imdburl: String
    },
    {
        timestamps:true
    }
);

module.exports = model('Movie', movieSchema);