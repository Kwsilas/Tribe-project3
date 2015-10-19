var express = require('express');
var passport = require('passport');
var router = express.Router();
var User = require('../models/user');
var Event = require('../models/event');

var authenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
};

// Index
router.get('/', authenticated, function(req, res, next) {
  res.render('./events/index.ejs', { message: req.flash() });
});

// Show
router.get('/:id', authenticated, function(req, res, next) {
  res.render('./events/show.ejs', { message: req.flash() });
});

module.exports = router;
