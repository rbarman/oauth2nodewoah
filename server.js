var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var ejs = require('ejs');
var engine = require('ejs-mate');

// controllers hold functions specific to a router
var contractController = require('./controllers/contract');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var oauth2Controller = require('./controllers/oauth2');

// url where my mongo db is hosted
var mongoUrl = 'mongodb://rohan:rohan@ds023485.mlab.com:23485/testing';
mongoose.connect(mongoUrl);

var app = express();
// Set view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
// Use express session support since OAuth2orize requires it
app.use(session({
  secret: 'aldjfalkdjflakdjflakjdlfakjdlfajdlskfjaldkfjaldskjf',
  saveUninitialized: true,
  resave: true
}));

// Use the passport package in our application
app.use(passport.initialize());

var router = express.Router();
// All routes now begin with /api 
app.use('/api', router); 
// On postman POST calls, use x-www.form-urlencoded instead of params

// calls isAuthenticated on most routes
// So on postman, must use Basic Auth and use a valid username and password
router.route('/contracts')
  .post(authController.isAuthenticated, contractController.postContracts)
  .get(authController.isAuthenticated, contractController.getContracts);

// Endpoint for /contracts/:contract_id
router.route('/contracts/:contract_id')
  .get(authController.isAuthenticated, contractController.getContract)
  .put(authController.isAuthenticated, contractController.putContract)
  .delete(authController.isAuthenticated, contractController.deleteContract);

// Endpoint for /users
router.route('/users')
  .post(userController.postUsers)
  .get(authController.isAuthenticated, userController.getUsers);

// Endpoint for /clients
router.route('/clients')
  .post(authController.isAuthenticated, clientController.postClients)
  .get(authController.isAuthenticated, clientController.getClients); 

// Endpoint handlers for oauth2 to do authorization stuff
router.route('/oauth2/authorize')
  .get(authController.isAuthenticated, oauth2Controller.authorization)
  .post(authController.isAuthenticated, oauth2Controller.decision);

// Endpoint for  handlers for oauth2 token
router.route('/oauth2/token')
  .post(authController.isClientAuthenticated, oauth2Controller.token);

app.listen(3000, function(){
  console.log("http://localhost:3000/");
});