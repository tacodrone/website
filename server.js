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
var deployment = true;

// Express import
var express = require('express');
var app = express();

// Parser import
var bodyParser = require('body-parser');

// Sequalize
var Sequelize = require('sequelize');

// Debug Morgan import
var morgan = require('morgan');

// cookie parser
var cookieParser = require('cookie-parser');

// Token import
var jwt = require('jsonwebtoken');

// Configuration file
var config = require('./config');

// Superagent
var request = require('superagent');

// Mail Chimp
var MCapi = require('mailchimp-api');

// New Mail Chimp Api
var MC = new MCapi.Mailchimp('341051e1a467da5bd5c7a0833c5b695f-us15');

// set app configurations
app.set('superSecret', config.secret);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use("/assets", express.static('assets'));
app.use("/images", express.static('images'));

var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/)

var sequalize 	= 	new Sequelize(match[5], match[1], match[2], {
						dialect:  'postgres',
						protocol: 'postgres',
						port:     match[4],
						host:     match[3],
						logging: false,
						omitNull: true,
						dialectOptions: {
						    ssl: true
						}
					});



var User;

function define_user(){

	return 	sequalize.define('User',	{		
				user_id: 	{
								type: Sequelize.INTEGER,
								primaryKey: true,
		    					autoIncrement: true
		    				},
								
				email: Sequelize.STRING

			},	{
				freezeTableName: true
			});
}

User = define_user();

User.sync().then(function(user){

});

// Check Email
function email_check(email){
	var email_pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	return email_pattern.test(email);
}

var port = ((deployment) ? (port = process.env.PORT || 80) : (port = process.env.PORT || 8092));

app.get("/", function(req, res) {
	res.render("index");
});

app.post("/signup", function(req, res) {
	
	var email_value = req.body.email || req.params.email;

	var merge_vars = [
		{ EMAIL: email_value }, 
		{ LNAME: ""},
		{ FNAME: "" }
	];

	MC.lists.subscribe({id: '31b20014f0', email:{email: email_value}, merge_vars: merge_vars, double_optin: false }, function(data) {
	
	}, function(error) {
	
	});

	return  User.findOne({ where: { email: email_value }}).then(function(user_data){
				if(user_data){
					
					return res.json({"name": "List_AlreadySubscribed"})

				}else{
					return 	User.create({email: email_value}).then(function(create_data){
								res.send('works');
							});
				}
				
			});

});

app.listen(port);
console.log('Magic happens at http://localhost:' + port);