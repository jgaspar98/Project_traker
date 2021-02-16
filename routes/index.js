const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
 //? Needs this part to get the user logged in vv
  res.render('index', {user: req.session.currentUser});
});

module.exports = router;