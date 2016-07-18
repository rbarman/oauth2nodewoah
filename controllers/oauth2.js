var oauth2orize = require('oauth2orize')
var User = require('../models/user');
var Client = require('../models/client');
var Token = require('../models/token');
var Code = require('../models/code');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Client will redirect user to the user authorization endpoint
// User will have to authenticate and agree/grant to it to let client get access his resources
// The client will then be granted an access token.

// Register authorization code grant type
// Creating an authorization code for the user and client
server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  // Create a new authorization code
  var code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });
  // Save the auth code and check for errors
  code.save(function(err) {
    if (err) { return callback(err); }
    callback(null, code.value);
  });
}));

// Exchange authorization codes for access tokens
// check if auth code is valid. 
// If valid, create an access token for the user and client -> client now has access to resources
server.exchange(oauth2orize.exchange.code(function(client, code, redirectUri, callback) {
  Code.findOne({ value: code }, function (err, authCode) {
    if (err) { return callback(err); }
    if (authCode === undefined) { return callback(null, false); }
    if (client._id.toString() !== authCode.clientId) { return callback(null, false); }
    if (redirectUri !== authCode.redirectUri) { return callback(null, false); }

    // Delete auth code now that it has been used
    authCode.remove(function (err) {
      if(err) { return callback(err); }
      // Create a new access token
      var token = new Token({
        value: uid(256),
        clientId: authCode.clientId,
        userId: authCode.userId
      });
      // Save the access token and check for errors
      token.save(function (err) {
        if (err) { return callback(err); }
        callback(null, token);
      });
    });
  });
}));

// User authorization endpoint
exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {

    Client.findOne({ id: clientId }, function (err, client) {
      if (err) { return callback(err); }

      return callback(null, client, redirectUri);
    });
  }),
  function(req, res){
    // show the dialog that asks user to grant permission to client
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]


// User decision endpoint
exports.decision = [
  // handles data submitted by the post 
  // If user grants access, calls server.grant() 
  server.decision()
]

// Application client token exchange endpoint
// handles request by client after granted an authorization code, wants to exchange code for token
exports.token = [
  server.token(), // calls server.exchange()
  server.errorHandler()
]

// There is an 'authorization' transaction everytime the 
// client redirects user to authorization endpoint.
// seems to be best practice to store the transaction in the session

// Register serialialization function
server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

// Register deserialization function
server.deserializeClient(function(id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});


// helpers
function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}