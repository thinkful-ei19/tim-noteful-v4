'use strict';

const { Strategy: LocalStrategy} = require('passport-local');
const User = require('../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User.findOne({ username })
    .then(results => {
      user = results; 
      if(!user) {
      // Removed for brevity
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incoreect username',
          location: 'username'
        });
      }
      return user.validatePassword(password);
    })
    .then((isValid)=>{
      if(!isValid){
      // Removed for brevity
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incoreect password',
          location: 'password'
        });
      }
      return done(null, user);
    })
    .catch(err => {
    // Removed for brevity
      if (err.reason === 'LoginError') {
        return done(null, false);
      }

      return done(err);

    });
});

module.exports = localStrategy;
