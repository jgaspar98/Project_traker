const express = require('express');
const router = express.Router();
const List = require('../models/Lists.model')
const Review = require('../models/Review.model')
const imdb = require('imdb-api');

router.post('/movies/add', (req, res) => {
    const { title, poster } = req.body;
    // Reconhece o title e o poster 
    List.findOneAndUpdate({ name: 'WatchedList', user: req.session.currentUser }, { $push: { movies: { title, poster } } })
        .then(() => {
            res.redirect('/')
        }).catch((err) => { console.log(err) });
});

// //* Route to add the Movie to our WatchList
router.post('/movies/add-list', (req, res) => {
    // Object Deconstration
    const { title, poster } = req.body;
    // Creates a WatchList to the current user and push to an array of objects
    List.findOneAndUpdate({ name: 'WatchList', user: req.session.currentUser }, { $push: { movies: { title, poster } } })
        .then(() => {
        res.redirect('/') //TODO: redirect to user watchlist page;
    }).catch((err) => {console.log(err)});
});

//* Route to get a movie when user clicks on title
router.get('/movies/:id', (req, res) => {
    // Gets the id from the url
    let id = req.params.id;
    // imdb Api documentation to search for a specific movie
    imdb.get({ id: id }, { apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
        // find the review that the user made and displays it
        Review.find({ movieId: response.imdbid }).populate('user').then((reviews) => {
            res.render('movies', { movies: response, reviews: reviews});
        });
    }).catch(err => {
        console.log(err);
    });
});

router.post('/reviews/:id/add', (req, res) => {
    // gets the movie id
    let id = req.params.id;
    // gets what the user writes
    const { review } = req.body;
    //gets the user thats logged in
    const userId = req.session.currentUser;
    Review.create({ movieId: id, review, user: userId }).then(() => {
        res.redirect(`/movies/${id}`);
    });
});

//* Search for a movie 
router.get('/results', (req, res) => {
    // Gets the params of the form
    let searchFor = req.query.general;
    // imdb Api documentation to search for a  non specific film, returning a list of films
    imdb.search({ name: searchFor }, { apiKey: process.env.API_KEY }).then((response) => {
        res.render('results', { results: response.results });
    }).catch(err => {
        console.log(err);
    });
});

router.get('/mylists', (req, res) => {
    const userId = req.session.currentUser; 
    List.find({user: userId}).then((allListsFromDB) => {
        console.log(allListsFromDB)
        res.render('mylists', { lists:allListsFromDB});
    })
})
module.exports = router;