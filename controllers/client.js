// An application client is what would request access to a user account.
var Client = require('../models/client');

// POST /api/client 
exports.postClients = function(req, res) {
  // Create and update a new Client
  var client = new Client();

  client.name = req.body.name;
  client.id = req.body.id;
  client.secret = req.body.secret;
  client.userId = req.user._id;

  client.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Client added', data: client });
  });
};

// GET /api/clients
exports.getClients = function(req, res) {
  // Use the Client model to find all clients
  Client.find({ userId: req.user._id }, function(err, clients) {
    if (err)
      res.send(err);

    res.json(clients);
  });
};