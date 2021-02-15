const express = require('express');
const router = express.Router();
//const Movie = require('../models/Movies.model')

const imdb = require('imdb-api');


router.get('/movies', (req, res) => {
    // let id = req.body.movie;
    imdb.get({name: 'Avengers: Age of Ultron'},{ apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
        console.log(response);
        res.render('movies', {movies: response})
        }).catch(err =>{console.log(err);
    });
})

// router.post('/movies/:id', (req, res) => {
//     let id = req.body.movie;
//     imdb.get({name: id},{ apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
//         console.log(response);
//         res.render('movies', {movies: response})
//         }).catch(err =>{console.log(err);
//     });
// })


// document.getElementById('search-button').addEventListener('click' =>)



module.exports = router;