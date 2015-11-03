var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:kevinisacuteboy@ds045121-a0.mongolab.com:45121,ds045121-a1.mongolab.com:45121/pubpub');



require('../server.babel'); // babel registration (runtime transpilation for node)

import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import PrettyError from 'pretty-error';
import http from 'http';
import request from 'request';

var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const pretty = new PrettyError();
const app = express();

const server = new http.Server(app);

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

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
// app.use(cookieParser());


app.use(session({
    secret: 'kevinisacuteboy',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ 
      mongooseConnection: mongoose.connection,
      ttl: 30 * 24 * 60 * 60 // = 30 days.
    }),
    cookie: {
      secure: false,
      maxAge: 30 * 24 * 60 * 60 * 1000// = 30 days.
    },
}));

app.use(passport.initialize());
app.use(passport.session());


// use static authenticate method of model in LocalStrategy
// passport.use(new LocalStrategy(User.authenticate()));
passport.use(User.createStrategy());

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


var Pub  = require('./models').Pub;


app.get('/getEcho', function(req, res){
	res.status(201).json(req.query);
});
app.post('/postEcho', function(req, res){
	res.status(201).json(req.body);
});

app.get('/sampleProjects', function(req, res){
	// console.log(req.query);
	Pub.find({}, {'displayTitle': 1, 'uniqueTitle': 1})
	.limit(5)
	.exec(function(err, pubs){
		// console.log('yea were here');
		res.status(201).json(pubs);
	});

});


app.post('/loadProjects', function(req,res){
	// Want to load each project's title, authors, publishdate, abstract, image
	// console.log(req.body);
	Pub.find({'uniqueTitle': {$in: req.body}}, { '_id': 0, 'collaboratorsUsers': 1, 'image':1, 'displayTitle':1, 'uniqueTitle':1, 'versions':1})
		.populate({ path: 'collaboratorsUsers.authors', select: 'username name image'})
		.populate({ path: "versions", select: 'abstract'})
		.lean()
		.exec(function (err, pubs) {
			pubs.forEach(function(pub){
				pub['abstract'] = pub.versions[pub.versions.length-1].abstract;
				delete pub.versions;
			});
			
			res.status(201).json(pubs);
		});
	

});

app.post('/loadProject', function(req,res){
	console.log('in Load project backend')
	Pub.findOne({'uniqueTitle': req.body[0]}, { '_id': 0, 'versions': 1, 'collaboratorsUsers': 1, 'image':1, 'displayTitle':1, 'uniqueTitle':1})
		.populate({ path: "versions", select: 'abstract content postDate assetTree'})
		.populate({ path: 'collaboratorsUsers.authors', select: 'username name image'})
		.lean()
		.exec(function (err, pub) {

			var output = {
				displayTitle: pub.displayTitle,
				uniqueTitle: pub.uniqueTitle,
				image: pub.image,
				abstract: pub.versions[pub.versions.length-1].abstract,
				content: pub.versions[pub.versions.length-1].content,
				postDate: pub.versions[pub.versions.length-1].postDate,
				authors: pub.collaboratorsUsers.authors,
			}

			if(pub.versions[pub.versions.length-1].assetTree != undefined){
				var assetTree = JSON.parse(pub.versions[pub.versions.length-1].assetTree);
				output.content = output.content.replace(/\^\^asset{(.*?)}/g, function(match, capture) {
					return '!['+capture+']('+assetTree[capture]+')';
				});
			}
			output.content = output.content.replace(/\^\^(.*?){(.*?)}/g, '');  
			output.content = output.content.replace(/\^\^pagebreak/g, '');  
			output.content = output.content.replace(/(#+)/g, function(match, capture) {
					return match+' ';
				});
			
			
			res.status(201).json(output);
		});

});




app.get('/login', function(req,res){
  if(req.user){
    User.findOne({'email':req.user.email}, '-hash -salt')
    .populate("externals highlights relatedpubs discussions")
    .populate({path: "pubs", select:"displayTitle uniqueTitle image"})
    .populate({path: "groups", select: "name uniqueName image"})
    .exec(function (err, user) {
      if (!err) {
        var options = {
          path: 'relatedpubs.pub highlights.pub externals.pub discussions.pub',
          select: 'displayTitle uniqueTitle image',
          model: 'Pub'
        };
        User.populate(user, options, function (err, user) {
          if (err) return res.json(500);
          return res.status(201).json(user);
        });
      } else {
        console.log(err);
        return res.json(500);
      }
    });
  }else{
    return res.status(201).json('No Session');
  }

});
// User registration and stuff
app.post('/login', passport.authenticate('local'), function(req, res) {
  console.info('in login post');
  console.info(req.body);
  console.info(req.body.email);
   User.findOne({'email':req.body.email}, '-hash -salt')
    .populate("externals highlights relatedpubs discussions")
    .populate({path: "pubs", select:"displayTitle uniqueTitle image"})
    .populate({path: "groups", select: "name uniqueName image"})
    .exec(function (err, user) {
      if (!err) {
        var options = {
          path: 'relatedpubs.pub highlights.pub externals.pub discussions.pub',
          select: 'displayTitle uniqueTitle image',
          model: 'Pub'
        };
        User.populate(user, options, function (err, user) {
          if (err) return res.status(500).json(err);
          return res.status(201).json(user);
        });
      } else {
        console.log(err);
        return res.json(500);
      }
    });
});

app.get('/logout', function(req, res) {
  req.logout();
  res.status(201).json(true);
});

app.post('/register', function(req, res) {
  User.generateUniqueUsername(req.body.fullname, function(newUsername){
    User.register(new User({ email : req.body.email, username: newUsername, image: req.body.image, name: req.body.fullname, registerDate: new Date(Date.now())}), req.body.password, function(err, account) {
        if (err){
          console.log(err);
          return res.status(500).json(err);
        }

        passport.authenticate('local')(req,res,function(){
          return User.findOne({'username':newUsername}, '-hash -salt')
            .populate("externals highlights relatedpubs discussions")
            .populate({path: "pubs", select:"displayTitle uniqueTitle image"})
            .populate({path: "groups", select: "name uniqueName image"})
            .exec(function (err, user) {
              if (!err) {
                var options = {
                  path: 'relatedpubs.pub highlights.pub externals.pub discussions.pub',
                  select: 'displayTitle uniqueTitle image',
                  model: 'Pub'
                };
                User.populate(user, options, function (err, user) {
                  if (err) return res.json(500);

                  // Send Email Confirmation
                  var email     = new sendgrid.Email({
                    to:       user.email,
                    from:     'pubpub@media.mit.edu',
                    fromname: 'PubPub Team',
                    subject:  'Welcome to PubPub!',
                    text:     'You Successfully Registered!'
                  });
                  // sendgrid.send(email, function(err, json) {
                  //   if (err) { return console.error(err); }
                  //   console.log(json);
                  // });
                
                  // End Send Email Confirmation

                  res.send(user);
                });
              } else {
                console.log(err);
                return res.json(500);
              }
            });
        })

    });
  });

});




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
