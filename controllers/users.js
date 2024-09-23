const express = require('express');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;

const dotenv = require('dotenv');
dotenv.config()

const { User } = require('../models');


// Passport configuration
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // Find user by email
    User.findOne({ where: { email: email } })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            console.error('Error comparing passwords:', err);
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      })
      .catch(error => {
        console.error('Error finding user:', error);
        return done(error);
      });
  })
);


// JWT function to generate token
function generateToken(user) {
  return jwt.sign({ id: user.id }, process.env.SECRET_KEY , { expiresIn: '1h' });
}

// Routes
module.exports.signUp = async (req, res) => {
  const { firstName, lastName, email, password, confirm_password } = req.body;

 

   // Check if password and confirm password match
   if (password !== confirm_password) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

   // Check if user already exists
   const existingUser = User.findAll({where: {email : email}, });
   if (existingUser.length > 0) {
     // return res.json(existingUser)
     return res.status(400).json({ message: 'User already exists' });
   }

  // Create new user
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      const newUser = {
        firstName,
        lastName,
        email,
        password: hash
      };
      User.create(newUser);
      res.status(201).json({ message: 'User created successfully' });
    });
  });
}

module.exports.login= async (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken(user);
    console.log(token)
    res.status(200).json({message: 'Login successful' });
  })(req, res, next);
};

module.exports.profile = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // You can access the authenticated user via req.user
    res.json(req.user);
  })(req, res, next);
};