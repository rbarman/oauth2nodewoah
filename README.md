# oauth2nodewoah
Simple example of an express rest api with Passport and oauth2.

In this app, users can create contracts. A user wants to integrate a third party client/service to modify and add contracts. However the client will need permission to access the contracts.

An authorization code will be created if the user grants permission to the contract. The client then will need to exchange the authorization code with an access token and use that access token value in its header to make api calls to modify the client's contracts.

A user can grant the client permission by giving it a acess token. The client can now use this token in its request to access the user's contracts.

-------------
# Process

The entire process relies on making requests. 
I am using Postman. It is important to set body to `w/ x-www-form-urlencoded` for all post calls

1. Specify a mongodb url
  * line 17 of `server.js` has `var mongoUrl = 'mongodb://rohan:rohan@ds023485.mlab.com:23485/testing';`
  * Set mongoUrl to localhost or where ever you have a mongo db hosted
2. `npm install`  + `node server`
3. Create a User
  * POST http://localhost:3000/api/users 
  * body needs a username and password 
4. All routes to GET/POST a Contract requires an authenticated user, so now need to use `Basic Auth` on postman using same username and password
5. Create a contract
  * POST http://localhost:3000/api/contracts 
  * body needs name and quantity
6. Create a client [third party that will want access to the User's created Contract] 
  * POST http://localhost:3000/api/clients => 
  * body needs name, id, and secret
7. Allow user to grant or deny permission to the client
  * url to `http://localhost:3000/api/oauth2/authorize?client_id=<client_id>&response_type=code&redirect_uri=http://localhost:3000`
  * `<client_id>` is id of the created client
8. Press allow and there will be a code outputted on page. This code is an authorization code that the client will need to exchange to get an access token. Save the authorization code value.
9. Exchange authorization code for a token
  * POST : http://localhost:3000/api/oauth2/token
  * The Client wants the token,  so do Basic Auth but set username and password to the client's id and secret
  * Body: 
      * grant_type: authorization_code
	* code : `<authorization_code>`
	* redirect_uri : http://localhost:3000
10. Will receive an access_token back from above POST, the value field is the `token value` that the client needs 
	
11. Now let client make calls on the user's contracts on behalf of the user with the token
  * Client wants to create a new contract
  * POST http://localhost:3000/api/contracts => requires name and quantity in body
  * Remove basic auth
  * Set Authorization to Bearer `token value`
12. Client is able to add the contract to the user!
  
    
