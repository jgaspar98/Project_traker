const { response } = require('express');
const express = require('express');
const router = express.Router();
const List = require('../models/Lists.model')


const imdb = require('imdb-api');
//* Route to add the Movie to our WatchList
router.post('/movies/add-list', (req, res) => {
    // Object Deconstration
    const { title, poster } = req.body;
    // Creates a WatchList to the current user and push to an array of objects
    List.findOneAndUpdate({ name: 'WatchList', user: req.session.currentUser }, { $push: { movies: { title, poster } } }).then(() => {
        res.redirect('/') //TODO: redirect to user wathlist page;
    }).catch((err) => {console.log(err)});
});

//* Route to get a movie when user clicks on title
router.get('/movies/:id', (req, res) => {
    // Gets the id from the url
    let id = req.params.id;
    // imdb Api documentation to search for  a specific movie
    imdb.get({ id: id }, { apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
        console.log(response);
        res.render('movies', { movies: response });
    }).catch(err => {
        console.log(err);
    });
});

//* Search for a movie 
router.get('/results', (req, res) => {
    // Gets the params of the form
    let searchFor = req.query.general;
    // imdb Api documentation to search for a  non specific film, returning a list of films
    imdb.search({ name: searchFor }, { apiKey: process.env.API_KEY }).then((response) => {
        console.log(response.results);
        res.render('results', { results: response.results });
    }).catch(err => {
        console.log(err);
    });
});


module.exports = router;