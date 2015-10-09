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
  var user = currentUser.interests
  res.render('./users/show.ejs', { user: user, message: req.flash() });
});

// Create user
router.put('/edit', authenticated, function(req, res, next) {
  currentUser.interests = [];
  req.body.interests.forEach(function(int){
    currentUser.interests.push(int);
  });
  console.log(currentUser.interests);
  currentUser.save(function (err) {
    if (err) return next(err);
     var intersection = [];
     var events = [];
     Event.find({}, function(err, e){
      console.log('This better work' + e);
      if (err) console.log(err);
      events.push(e);
      console.log(events);
      return events;
     });
      for (var i=0; i<currentUser.interests.length; i++) {
          for (var k=0; k<events.length; k++) {
              for (var j=0; j<events[k].interests.length; j++)         {
                  if (currentUser.interests[i] === events[k].interests[j]);
                  {
                      intersection.push(events[k].name);
                  }
              }
          }
      }
      console.log(intersection);
      var arr = intersection;
      var obj = { };
      for (var i = 0, j = arr.length; i < j; i++) {
         if (obj[arr[i]]) {
            obj[arr[i]]++;
         }
         else {
            obj[arr[i]] = 1;
         }
      }
        console.log(obj);
    // var events1;
    // Event.findOne({name: "Ponce Party"}, function(err, e){
    //   if (err) console.log(err);
    //   events1 = e;
    // console.log(events1);
    // });
    res.redirect('/show');
  });
});


module.exports = router;
