var mongoose = require('mongoose');

 // model for authorization codes. 
 // The client will exchange these codes for access tokens.

var CodeSchema   = new mongoose.Schema({
	value: { type: String, required: true },
	redirectUri: { type: String, required: true },
	userId: { type: String, required: true },
	clientId: { type: String, required: true }
});
// TODO: hash the value, it is to hold the actual authorization code value
module.exports = mongoose.model('Code', CodeSchema);