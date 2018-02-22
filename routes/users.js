import express from 'express';
import passport from 'passport';
let router = express.Router();
import Strategy from 'passport-local';
let LocalStrategy = Strategy.Strategy;

import User from '../models/user';
import createUser from '../models/user';

// REGISTER ROUTE
router.get('/register', (req, res) => {
  res.render('register');
});

// LOGIN ROUTE
router.get('/login', (req, res) => {
  res.render('login');
});

// REGISTER USER
router.post('/register', (req, res) => {

  let { name, email, username, password, confirmpassword } = req.body;

  // VALIDATION
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('confirmpassword', 'Password do not match').equals(req.body.password);
  let errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors
    });
  } else {
    let newUser = new User({ name, email, username, password });
    User.createUser(newUser, (err, user) => {
      if(err) {
        console.log('errrrrror');
        throw err;
      }
      console.log(user);
    });
    req.flash('success_msg', 'You are registered now.');
    res.redirect('/users/login');
  }
});


// PASSPORT SETTING
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
      if (err) { throw err; }
      if (!user) { return done(null, false, {message: 'Incorrect username'}); }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (err) { throw err }
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid password' });
        }
      })
    });
  }
))

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.getUserById(id, (err, user) => {
    done(err, user);
  });
});

// LOGIN
router.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('login');
})

export default router;
