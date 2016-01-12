// Connect to Mongo database

var mongoose = require('mongoose');

if(process.env.NODE_ENV !== 'production'){
  var mongoURI = require('./authentication/mongoCredentials').mongoURI;
  mongoose.connect(mongoURI);  
}else{
  mongoose.connect(process.env.mongoURI);  
}



require('../server.babel'); // babel registration (runtime transpilation for node)


import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import PrettyError from 'pretty-error';
import http from 'http';
import request from 'request';

const pretty = new PrettyError();
const app = express();
const server = new http.Server(app);

/*--------*/
// Configure app login, session, and passport settings
/*--------*/
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models').User;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser()); // use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser()); // use static serialize and deserialize of model for passport session support

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(session({
    secret: 'fuzzyelephantfun',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ 
      mongooseConnection: mongoose.connection,
      ttl: 30 * 24 * 60 * 60 // = 30 days.
    }),
    cookie: {
      path: '/',
      // domain: process.env.NODE_ENV === 'production' ? '.pubpub.org' : '' ,
      domain: '',
      httpOnly: false,
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000// = 30 days.
    },
}));

app.use(passport.initialize());
app.use(passport.session());

module.exports = app;

/*--------*/
// Connect routes
/*--------*/
require('./routes');

/*--------*/
// Take the setup and start listening!
/*--------*/
if (config.apiPort) {
	const runnable = app.listen(config.apiPort, (err) => {
		if (err) {
			console.error(err);
		}
		console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
		console.info('==> 💻  Send requests to http://localhost:%s', config.apiPort);
	});


} else {
	console.error('==>     ERROR: No PORT environment variable has been specified');
}
