var express = require('express');
var passport = require('passport');
var router = express.Router();
var Event= require('../models/event');

var authenticated = function(req, res, next) {
  if (!req.isAuthenticated()) {
    res.redirect('/');
  }
  else {
    next();
  }
};

function findInArray(arr, name) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].name === name) {
      return arr[i];
    }
  }
  return null;
}

function sortArray(arr) {
  arr.sort(function (a, b) {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    // a must be equal to b
    return 0;
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tribe' });
});

// GET /signup
router.get('/signup', function(req, res, next) {
  res.render('./users/signup.ejs', { message: req.flash() });
});

// POST /signup
router.post('/signup', function(req, res, next) {
  var signUpStrategy = passport.authenticate('local-signup', {
    successRedirect : '/edit', // double check route???
    failureRedirect : '/signup',
    failureFlash : true
  });

  return signUpStrategy(req, res, next)
});

// GET /login
router.get('/login', function(req, res, next) {
  res.render('./users/login.ejs', { message: req.flash() });
});

// POST /login
router.post('/login', function(req, res, next) {
  var loginProperty = passport.authenticate('local-login', {
    successRedirect : '/show',
    failureRedirect : '/login',
    failureFlash : true
  });

  return loginProperty(req, res, next);
});

// GET /logout
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

// Edit user
router.get('/edit', authenticated, function(req, res, next) {
  res.render('./users/edit.ejs', { message: req.flash() });
});

// Show user
router.get('/show', authenticated, function(req, res, next) {
  var user = currentUser.interests;
  var results = req.session.results ? req.session.results : [];
  res.render('./users/show.ejs', { user: user, results: results, message: req.flash() });
});

// update/Create user
router.put('/edit', authenticated, function(req, res, next) {
  currentUser.interests = [];
  req.body.interests.forEach(function(int){
    currentUser.interests.push(int);
  });
  console.log(currentUser.interests);
  currentUser.save(function (err) {
    if (err) return next(err);
     var intersection = [];
     Event.find({}, function(err, events){
      if (err) console.log(err);
      console.log(events);
      for (var i=0; i<currentUser.interests.length; i++) {
        for (var k=0; k<events.length; k++) {
          for (var j=0; j<events[k].interests.length; j++) {
            if (currentUser.interests[i] === events[k].interests[j]) {
              intersection.push(events[k].name);
            }
          }
        }
      }
      console.log(intersection);
      var results = [];
      for (var i = 0, j = intersection.length; i < j; i++) {
        var found = findInArray(results, intersection[i]);
        if (found) {
          found.count++;
        }
        else {
          results.push({ name: intersection[i], count: 1 });
        }
      }
      sortArray(results);
      console.log(results);
      console.log('req.session:', req.session);
      req.session.results = results;
      res.redirect('/show');
    });
  });
});


module.exports = router;
