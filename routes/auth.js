const express = require('express');
const router  = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const List = require('../models/Lists.model')

router.get('/login', (req,res) => {
  res.render('auth/login');
});

router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

router.post('/login', (req,res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    res.render('auth/login', {
      errorMessage: 'Please enter both username and password'
    });
      return;
  }

  User.findOne({username: username})
  .then((user) => {
    if (!user) {
      res.render('auth/login', {
        errorMessage: 'Invalid login'
      });
      //User doesnt exist on the database
    return;
  }

  if (bcrypt.compareSync(password, user.password)) {
    //Sucessfull login
    req.session.currentUser = user;
    res.redirect('/');
  } else { 
    //Passwords dont match
    res.render('auth/login', {
      errorMessage: 'Invalid Login'
      });
    }
  });
});

router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  //Server side validation on empty fields
  if (username === '' || password === '') {
    res.render('auth/signup', 
    { errorMessage: 'Indicate username and passsword'});
    return;
  }
  //Server side validation on password constrain
  //Regular expressions
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (passwordRegex.test(password) === false) {
    res.render('auth/signup',
    { errorMessage: 'Weak password'});
    return;
  }
  User.findOne({username: username})
    .then((user) => {
      if (user) {
        res.render('auth/signup',
        { errorMessage: 'User already exists'});
        return;
      }
      //Create the user
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);
      User.create({
        username,
        email,
        password: hashPassword
      }).then((user) => {
        // Automatically creates a new user a WatchList
        List.create({ name: 'WatchList', user: user._id }).then((list) => {
          List.create({ name: 'WatchedList', user: list.user }).then(() => {
            res.redirect('/');
          })
        })
          .catch(e => {
          console.log(e)
        })
      }).catch((error) => {
        //.code is mongoose validation error
        if (error.code === 11000) {
          res.render('auth/signup', {
            errorMessage: 'Username and email should be unique'
          });
        }
      });
    });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;