var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');
var Client = require('../models/client');
var BearerStrategy = require('passport-http-bearer').Strategy
var Token = require('../models/token');

// Different Passport strategies for authentication

// user authenticated if username + password match
passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }
      // No user found with that username
      if (!user) { return callback(null, false); }
      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }
        // Password did not match
        if (!isMatch) { return callback(null, false); }
        // Success
        return callback(null, user);
      });
    });
  }
));

// want to authenticate clients, similar to user authentication
passport.use('client-basic', new BasicStrategy(
  function(username, password, callback) {
    Client.findOne({ id: username }, function (err, client) {
      if (err) { return callback(err); }
      // No client found with that id or bad password
      if (!client || client.secret !== password) { return callback(null, false); }
      // Success
      return callback(null, client);
    });
  }
));

// want to authenticate requests made from a client on behalf of users via an OAuth token
// checks Authorization: Bearer <access token> header
passport.use(new BearerStrategy(
  function(accessToken, callback) {
    Token.findOne({value: accessToken }, function (err, token) {
      if (err) { return callback(err); }
      // No token found
      if (!token) { return callback(null, false); }
      User.findOne({ _id: token.userId }, function (err, user) {
        if (err) { return callback(err); }
        // No user found
        if (!user) { return callback(null, false); }
        // Simple example with no scope
        callback(null, user, { scope: '*' });
      });
    });
  }
));

// is the user authenticated? + 
// Also BearerStrategy because check for access token 
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });
// is the client authenticated?
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });
// is the request from client on behalf of a user authenticated based on the request header?
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
// session: false => session is not stored between api calls