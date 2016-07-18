var mongoose = require('mongoose');
// the application client needs an access token to access/modify resources of the resource owner
var TokenSchema   = new mongoose.Schema({
	// value : actual token value used when accessing the API on behalf of the user. 
	// TODO: Use hashing
	value: { type: String, required: true },
	userId: { type: String, required: true },
	clientId: { type: String, required: true }
});
module.exports = mongoose.model('Token', TokenSchema);