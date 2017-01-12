// Main starting point of the application

const express = require('express'),
http = require('http'),
bodyParser = require('body-parser'),
router = require('./router')
morgan = require('morgan');
const mongoose = require('mongoose');
const app = express(); //instance of express

app.use(morgan('combined'));
app.use(bodyParser.json({type: '*/*'}));
router(app);


// Need to specifically tell mongo hey go connect
mongoose.connect('mongodb://localhost:auth/auth');


/*
* Morgan and bodyParser are middleware in express
* Any incoming request will be passed into Morgan AND it will be passed into bodyPArser by default
Morgan is a logging framework
If you go and refresh in the browser you are going to see you get some logging available in your console! It'll tell you a GET request to /
BodyParser is used to parse incoming request - specifically it's going to parse into jSON no matter what the type is. Any request that is incoming will be parsed as jSON
There is a fantastic helper module for development - nodemon.

NODEMON- Watching the product directory for any file changes. If any file changes it will immediately restart the server. We will be able to go ahead and edit files and then we'll see that the browser is updated! :)

To wire this up we need a NEW SCRIPT IN PACKAGE.JSON use NPM RUN DEV
*
*/

const port = process.env.PORT || 3090;
// Use the port if it is defined and if not use 3090

const server = http.createServer(app);
server.listen(port);
console.log('server listening on: ', port);
