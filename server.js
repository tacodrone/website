/************************************************/
/* Project:     Drone Taco Website              */
/*                                              */
/* Authors:     Abhishek Pratapa                */
/*                                              */
/* Version      1.0 [Deployment]                */
/*                                              */
/* File:        server.js                       */
/*                                              */
/* Methods:     [NA]                            */
/*                                              */
/* Data:        [NA]                            */
/*                                              */
/************************************************/

// testing = false
// deployment = true
var deployment = false;

// Express import
var express = require('express');
var app = express();

// Parser import
var bodyParser = require('body-parser');

// Debug Morgan import
var morgan = require('morgan');

// cookie parser
var cookieParser = require('cookie-parser');

// Token import
var jwt = require('jsonwebtoken');

// Configuration file
var config = require('./config');

// set app configurations
app.set('superSecret', config.secret);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

var port = ((deployment) ? (port = process.env.PORT || 80) : (port = process.env.PORT || 8090));

// display index file
app.get("/", function(req, res) {
	res.render("index")
});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);