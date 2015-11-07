// import {sendgridUsername, sendgridPassword} from '../authentication/sendgridCredentials';

var app = require('../api');
var passport = require('passport');
// var sendgrid  = require('sendgrid')(sendgridUsername, sendgridPassword);

var Pub = require('../models').Pub;
var User = require('../models').User;


app.get('/login', function(req,res){
  if(req.user){
    User.findOne({'email':req.user.email}, '-hash -salt')
    .populate("externals highlights relatedpubs discussions")
    .populate({path: "pubs", select:"displayTitle uniqueTitle image"})
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
   User.findOne({'email':req.body.email}, '-hash -salt')
    .populate("externals highlights relatedpubs discussions")
    .populate({path: "pubs", select:"displayTitle uniqueTitle image"})
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
                  // var email     = new sendgrid.Email({
                  //   to:       user.email,
                  //   from:     'pubpub@media.mit.edu',
                  //   fromname: 'PubPub Team',
                  //   subject:  'Welcome to PubPub!',
                  //   text:     'You Successfully Registered!'
                  // });
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