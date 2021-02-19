const express = require('express');
const router = express.Router();
const List = require('../models/Lists.model')
const Review = require('../models/Review.model')
const imdb = require('imdb-api');



//* Enables the user to choose what list to get
router.post('/movies/:movieId/lists/add', (req, res) => {
    const { list } = req.body;
    const movieId = req.params.movieId;
    imdb.get({ id: movieId }, { apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
        List.findByIdAndUpdate(list, { $push: { movies: { title: response.title, poster: response.poster} } }).then(() => {
            res.redirect('/mylists')
        });
    });
});



//* Route to get a movie when user clicks on title
router.get('/movies/:id', (req, res) => {
    // Gets the id from the url
    let id = req.params.id;
    // imdb Api documentation to search for a specific movie
    imdb.get({ id: id }, { apiKey: process.env.API_KEY, timeout: 30000 }).then((response) => {
        // find the review that the user made and displays it
        Review.find({ movieId: response.imdbid }).populate('user').then((reviews) => {
            List.find({ user : req.session.currentUser._id}).then((listsFromDB) => { 
                res.render('movies', {
                    movies: response, reviews: reviews,
                    user: req.session.currentUser,
                    lists: listsFromDB
                });
            })
         
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
        res.render('results', { results: response.results, user: req.session.currentUser});
    }).catch(err => {
        console.log(err);
    });
});

router.get('/mylists', (req, res) => {
    const userId = req.session.currentUser; 
    List.find({user: userId}).then((allListsFromDB) => {
        console.log(allListsFromDB)
        res.render('mylists', { lists:allListsFromDB});
    });
});

router.post('/mylists/add', (req, res) => {
    const { name } = req.body; 
    const userId = req.session.currentUser; 
    console.log('name', name);
    List.create({name, user: userId})
    .then(() => {
      res.redirect('/mylists');
    });
});

router.post('/mylists/:listId/list/:movieId/delete', (req, res) => {
    const listId = req.params.listId;
    const movieId = req.params.movieId
    List.findByIdAndUpdate(listId,{$pull:{movies:{_id: movieId}}}).then(() => {
        res.redirect('/mylists');
    }).catch(e => {
        console.log(e)
    });
}); 

module.exports = router;