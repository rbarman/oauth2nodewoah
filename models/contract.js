var mongoose = require('mongoose');
var ContractSchema   = new mongoose.Schema({
	// etc
	name: String,
	quantity: Number,
	userId: String //userId required because want each contract associated with a user
});

module.exports = mongoose.model('Contract', ContractSchema);