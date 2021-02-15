const { response } = require('express');
const express = require('express');
const router = express.Router();
//const Movie = require('../models/Movies.model')

const imdb = require('imdb-api');

router.get('/movies/:id', (req, res) => {
    let id = req.params.id;
    imdb.get({ id: id }, { apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
        console.log(response);
        res.render('movies', { movies: response });
    }).catch(err => {
        console.log(err);
    });
});

router.get('/results', (req, res) => {
    let searchFor = req.query.general;
    imdb.search({ name: searchFor }, { apiKey: process.env.API_KEY }).then((response) => {
        console.log(response.results);
        res.render('results', { results: response.results });
    }).catch(err => {
        console.log(err);
    });
});


module.exports = router;