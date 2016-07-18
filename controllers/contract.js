var Contract = require('../models/contract');


// all contracts are associated with a user id
// So each contract in db can only be accessed/modified by the creater of that contract


// Create endpoint /api/contracts for POSTS
exports.postContracts = function(req, res) {
  // Create a new instance of the Contract model
  var contract = new Contract();
  console.log(req.body);
  // Set the contract properties that came from the POST data
  contract.name = req.body.name;
  contract.quantity = req.body.quantity;
  contract.userId = req.user._id;

  // Save the contract and check for errors
  contract.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Contract added', data: contract });
  });
};

// Create endpoint /api/contracts for GET
exports.getContracts = function(req, res) {
  // Use the Contract model to find all contract
  Contract.find({ userId: req.user._id }, function(err, contracts) {
    if (err)
      res.send(err);
    res.json(contracts);
  });
};

// Create endpoint /api/contracts/:contract_id for GET
exports.getContract = function(req, res) {
  // Use the Contract model to find a specific contract
  Contract.find({ userId: req.user._id, _id: req.params.contract_id }, function(err, contract) {
    if (err)
      res.send(err);
    res.json(contract);
  });
};

// Create endpoint /api/contracts/:contract_id for PUT
exports.putContract = function(req, res) {
  // Use the Contract model to find a specific contract
  Contract.update({ userId: req.user._id, _id: req.params.contract_id }, { quantity: req.body.quantity }, function(err, num, raw) {
    if (err)
      res.send(err);

    res.json({ message: num + ' updated' });
  });
  
};

// Create endpoint /api/contracts/:contract_id for DELETE
exports.deleteContract = function(req, res) {
  // Use the Contract model to find a specific contract and remove it
  Contract.remove({ userId: req.user._id, _id: req.params.contract_id }, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Contract removed' });
  });
};