var app = require('../api');

var Pub  = require('../models').Pub;
var User = require('../models').User;
var Group = require('../models').Group;
var Discussion = require('../models').Discussion;
var Reference = require('../models').Reference;
var Review = require('../models').Review;
// var ObjectId  = Schema.Types.ObjectId;

var ObjectId  = require('mongoose').Schema.Types.ObjectId;

var _         = require('underscore');

// List of all projects
app.get('/pubs', function(req, res) {
  return Pub.find(function (err, pubs) {
    if (!err) {
      return res.send(pubs);
    } else {
      return console.log(err);
    }
  });
})

// browsepubs will get the N most recent
app.get('/browsepubs', function(req, res) {
  if(req.query.limit){
    var limit = req.query.limit;
  }else{
    var limit = 10;  
  }
  if(req.query.skip){
    var skip = req.query.skip;
  }else{
    var skip = 0;
  }

  var query = {'versions': {$not: {$size: 0}},'settings.isPrivate': false};
  if(req.query.journalID){
    query['featuredInJournalsList'] = req.query.journalID;
  }
  
  Pub.find(query,{'image':1, 'displayTitle':1, 'uniqueTitle':1, 'versions':1, 'lastPublishDate': 1})
    .populate({
      path: 'versions',
      select: 'abstract title postDate',
      model: 'Version'
    })
    .limit(limit).sort({lastPublishDate:-1}).skip(skip).lean().exec(function (err, pub) {
      if (err) return res.json(500);


      for(var ii = 0; ii < pub.length; ii++){
        
        pub[ii]['version'] = pub[ii]['versions'][pub[ii]['versions'].length-1];
        // console.log(pub[ii]['versions'][pub[ii]['versions'].length-1]);
        delete pub[ii]['versions'];
        // console.log(pub[ii]);
      }
      // console.log(pub);
      
      return res.status(201).json(pub);
    });
});

// Explore pubs will grab 3 random
app.get('/explorepubs', function(req, res) {
  Pub.count({'versions': {$not: {$size: 0}},'settings.isPrivate': false}, function(err,c){
    if (err) return res.json(500);
    var limit = 3;
    var skip = Math.floor(Math.random() * (c-3+1));
    if(c < 3){
      limit = c;
      skip = 0;
    }

    return Pub.find({'versions': {$not: {$size: 0}},'settings.isPrivate': false},{'image':1, 'displayTitle':1, 'uniqueTitle':1, 'versions':1})
      .populate({
        path: 'versions',
        select: 'abstract title postDate',
        model: 'Version'
      })
      .limit(limit).skip(skip).lean().exec(function (err, pub) {
        if (err) return res.json(500);


        for(var ii = 0; ii < pub.length; ii++){

          pub[ii]['version'] = pub[ii]['versions'][pub[ii]['versions'].length-1];
          // console.log(pub[ii]['versions'][pub[ii]['versions'].length-1]);
          delete pub[ii]['versions'];
          // console.log(pub[ii]);
        }
        // console.log(pub);
        
        return res.status(201).json(pub);
      });
  });
});

// Get Random Pub
app.get('/randompub', function(req, res) {
  Pub.count({'versions': {$not: {$size: 0}},'settings.isPrivate': false}, function(err,c){
    if (err){console.log(err); return res.json(500);} 


    var skip = Math.floor(Math.random() * c);
    Pub.find({'versions': {$not: {$size: 0}},'settings.isPrivate': false},{'uniqueTitle':1, 'image':1, 'displayTitle':1}).skip(skip).limit(1).exec(function (err, pub) {
      // console.log(pub)
      if (err){console.log(err); return res.json(500);} 
      if(pub[0]){
        return res.status(201).json(pub[0].uniqueTitle);
      }else{
        return res.status(500).json(null);
      }

    });
  });
})

// Project (A SINGLE PUB)
app.get('/pub', function(req, res) {
  // if(req.query.journalID){
  //   console.log(req.query.journalID)
  // }else{
  //   console.log('main pub')
  // }

  return Pub.findOne({'uniqueTitle': req.query.uniqueTitle})
    .populate("versions externals highlights relatedpubs discussions references draft.assets reviews dataSets dataAnalyses dataVisualizations")
    .populate({path: "groups", select: "name uniqueName image"})
    .populate({ path: 'collaboratorsUsers.readers collaboratorsUsers.authors approvedPeers', select: 'username name image'})
    .populate({ path: 'featuredInJournalsObject.journal submittedToJournalsObject.journal', select: 'journalName subdomain customDomain journalLogoURL description colorScheme'})
    .populate({ path: 'collaboratorsGroups.readers collaboratorsGroups.authors', select: 'uniqueName name image'})
    .exec(function (err, pub) {
      // console.log(req);
      // console.log(req.user);
      // console.log('hi');
      if (!err) {
        if(!pub){
          return res.status(404).json('No Journal with that uniqueTitle');
        }
        // console.log('--------')
        // console.log(typeof new ObjectId(req.query.journalID));
        // console.log(typeof pub.featuredInJournalsList[0]);
        // console.log(new ObjectId(req.query.journalID));
        // console.log(String(pub.featuredInJournalsList));
        if(!req.query.journalID || String(pub.featuredInJournalsList).indexOf(req.query.journalID) > -1){
          // console.log('Featured in this one!');
        }else{
          // console.log('NOT Featured in this one...');
          return res.status(201).json('Not This Journal');
        // If it's not features, we should append an item to the return document which is checked and
        // triggers a splash screen saying 'Not featured in this journal. Read on Pubpub.'
        }
        // console.log('--------')

        var options = {
          path: 'relatedpubs.author highlights.user externals.author discussions.author reviews.author',
          select: 'username name image',
          model: 'User'
        };
        Pub.populate(pub, options, function (err, pub) {
          if (err) return res.json(500);

          var options = [{
            path: 'relatedpubs.pub',
            select: 'displayTitle uniqueTitle image',
            model: 'Pub'
          },{
            path: 'reviews.assets',
            select: 'assetName url owner',
            model: 'Asset'
          },{
            path: 'reviews.references',
            select: 'refName title url author journal volume number pages data publisher note',
            model: 'Reference'
          },{
            path: 'reviews.selections',
            select: 'selection review user selectionNumber',
            model: 'Highlight'
          }];


          Pub.populate(pub, options, function (err, pub) {
            if (err) return res.json(500);
            try{output = pub.toObject();}catch(e){return res.json(500);}

            if(req.user){
              // Goes through and marks all the discussions the user has yay'd or nay'd
              output.discussions = Discussion.appendUserYayNayFlag(output.discussions, req.user.id);  
            }
            // Goes through and replaced the yay and nay arrays with a single score
            output.discussions = Discussion.calculateYayNayScore(output.discussions);
            // Goes through and nests discussions into children properly
            output.nestedDiscussions = Discussion.nestChildren(output.discussions);
            output.nestedDiscussions = Discussion.sortDiscussions(output.nestedDiscussions);
            

            // Check access
            output['isPrivate'] = output.settings.isPrivate;
            output['isAuthor'] = false;
            output['isReader'] = false;
            if(req.user){
              output.collaboratorsUsers.authors.forEach(function(author){
                if(author['_id'].toString() == req.user['_id'].toString()){
                  output['isAuthor'] = true;
                }
              });
              output.collaboratorsUsers.readers.forEach(function(reader){
                if(reader['_id'].toString() == req.user['_id'].toString()){
                  output['isReader'] = true;
                }
              });

              // Now Check groups
              User.findOne({'_id':req.user['_id']}).exec(function (err, user) {
                if (err) return res.json(500);
                output.collaboratorsGroups.authors.forEach(function(author){
                  if(user.groups.toString().split(",").indexOf(author['_id'].toString()) > -1){
                    output['isAuthor'] = true;
                  }
                });
                output.collaboratorsGroups.readers.forEach(function(reader){
                  if(user.groups.toString().split(",").indexOf(reader['_id'].toString()) > -1){
                    output['isReader'] = true;
                  }
                });
                // End Check Access

                
                if(output['isPrivate'] && !(output['isAuthor' ] || output['isReader'])){
                  var privateOutput = {};
                  privateOutput['isAuthor'] = output['isAuthor'];
                  privateOutput['isPrivate'] = output['isPrivate'];
                  privateOutput['isReader'] = output['isReader'];
                  return res.send(privateOutput); 
                }else{
                  return res.send(output);  
                }
                
              });


            }else{
              if(output['isPrivate']){
                var privateOutput = {};
                privateOutput['isAuthor'] = output['isAuthor'];
                privateOutput['isPrivate'] = output['isPrivate'];
                privateOutput['isReader'] = output['isReader'];
                return res.send(privateOutput); 
              }else{
                // Here - delete all the things you don't want the public viewing if the user isn't an author
                // Do we want to send all the dataset stuff in the pub if they're not author?
                delete output['dataSets'];
                delete output['dataAnalyses'];
                delete output['dataVisualizations'];

                return res.send(output);    
              }
              
            }
            
            
            });
          });
      } else {
        console.log(err);
        return res.json(500);
      }
    });
  })




  .put('/pub', function(req, res) {
  return Pub.findByIdAndUpdate(req.body.pubID, { $set: req.body.updates} )
    .populate("versions externals highlights relatedpubs discussions references")
    .populate({path: "groups", select: "name uniqueName image"})
    .populate({ path: 'collaboratorsUsers.readers collaboratorsUsers.authors', select: 'username name image'})
    .populate({ path: 'collaboratorsGroups.readers collaboratorsGroups.authors', select: 'uniqueName name image'})
    .exec(function (err, pub) {
      if (err) return res.json(500);
      // console.log(pub);
      // res.status(201).json(true);
      var options = {
        path: 'relatedpubs.author highlights.user externals.author discussions.author',
        select: 'username name image',
        model: 'User'
      };
      Pub.populate(pub, options, function (err, pub) {
        if (err) return res.json(500);
        var options = {
          path: 'relatedpubs.pub',
          select: 'displayTitle uniqueTitle image',
          model: 'Pub'
        };
        Pub.populate(pub, options, function (err, pub) {
          if (err) return res.json(500);
          output = pub.toObject();

          output['isPrivate'] = output.settings.isPrivate;
          output['isAuthor'] = false;
          output['isReader'] = false;
          // console.log('huh');
          if(req.user){
            output.collaboratorsUsers.authors.forEach(function(author){
              User.update({ _id: author['_id'] }, { $addToSet: { pubs: pub['_id']} }, function(err, result){if(err) return handleError(err)});
              if(author['_id'].toString() == req.user['_id'].toString()){
                output['isAuthor'] = true;
              }
            });
            output.collaboratorsUsers.readers.forEach(function(reader){
              User.update({ _id: reader['_id'] }, { $pull: { pubs: pub['_id']} }, function(err, result){if(err) return handleError(err)});
              if(reader['_id'].toString() == req.user['_id'].toString()){
                output['isReader'] = true;
              }
            });

            // Now Check groups
            User.findOne({'_id':req.user['_id']}).exec(function (err, user) {
              if (err) return res.json(500);
              output.collaboratorsGroups.authors.forEach(function(author){
                if(user.groups.toString().split(",").indexOf(author['_id'].toString()) > -1){
                  output['isAuthor'] = true;
                }
              });
              output.collaboratorsGroups.readers.forEach(function(reader){
                if(user.groups.toString().split(",").indexOf(reader['_id'].toString()) > -1){
                  output['isReader'] = true;
                }
              });
              // End Check Access

              

              res.send(output);
            });
          }
        });
      });
    });
  })

  .post('/pub', function(req, res) {
    Pub.isUnique(req.body.uniqueTitle, function(err, result){
      if(!result){
        return res.status(500).json('URL Title is not Unique!');
      }
      var pub = new Pub({
          displayTitle: req.body.displayTitle,
          uniqueTitle: req.body.uniqueTitle,
          image: req.body.image,
          settings: {'isPrivate':false},
          draft: {
            abstract: "Click the button in the top-right to toggle Edit/Preview Mode",
            content: "^^title{New Pub Draft}\n\n^^abstract{Here's your new pub. Edit text on the left, and view it on the right. Saving is automatic. No need to worry :)}\n\n#Your New Pub!\nWelcome to your new pub. The following text provides you with some starter content to see how Pubs are written. LaTeX and WSYWIG support coming soon!\n\n#Styling\n\n# Header1\n## Header2\n### Header3\n\nYou can add super cool links like this [Super Sweet Link](http://www.google.com/search?q=smiling+puppy&tbm=isch) \n\nAdd emphasis something _super_ important.\n\n#References\nAdd References to the right and cite them using the Cite Tag! ^^cite{refNameGoesHere}\n\n#Lists go like this\n\n* My\n* List\n* Items\n\n-- or like this --\n\n1. My \n2. List\n3. Items\n\n\n\n\n#Insert page Breaks:\n^^pagebreak\n\n#Images\n##We can do in-column and full-width images\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin libero et ante vestibulum euismod. Curabitur consequat arcu eu lacus condimentum laoreet. Etiam a ligula ac orci dictum fermentum vel in ligula. Vivamus gravida tempus leo, vitae tempus lectus vehicula et. Donec accumsan massa at elit tristique, quis aliquam nibh efficitur. Integer purus urna, luctus sed sagittis nec, ultrices semper lorem. Sed in porttitor eros.\n\n ![Some Steamboat Guy](http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg) \n\nMauris ut sollicitudin risus. In hac habitasse platea dictumst. Pellentesque eget velit eu elit egestas fermentum vitae eget urna. Duis dictum lacinia mauris in interdum. Aliquam porttitor ultricies diam eu pharetra. Vestibulum ornare tellus in facilisis venenatis. In sed ligula id purus pellentesque suscipit ut eu neque. Nam efficitur ultricies lacus laoreet porttitor. Phasellus rutrum bibendum sem, at laoreet nunc congue at. Cras efficitur urna eu orci lobortis tincidunt. Etiam pellentesque efficitur neque, ut finibus quam interdum sed.\n\n ![Smooth](http://i.imgur.com/7FJzLNd.gif) \nProin porttitor, quam ac sagittis aliquam, purus turpis sodales sapien, sed luctus lorem diam a magna. Vivamus ornare rutrum risus, et malesuada odio viverra ac. Phasellus volutpat eget nulla gravida accumsan. Praesent ac interdum purus. Donec arcu metus, placerat at turpis tempus, mattis lobortis velit. Proin tristique odio vel nibh gravida eleifend a eu risus. Donec sit amet lectus nibh. Vivamus blandit ultricies tempus. Sed tincidunt quis lectus placerat vestibulum. Aenean eget tortor aliquet, elementum ligula quis, congue leo. Nam ultricies, mi eget egestas efficitur, sapien enim tempus metus, sit amet iaculis dolor tortor non ipsum. Praesent ipsum nisl, fermentum sit amet bibendum id, fringilla at justo.\n\n\n<div class=\"full-width\"> <img src=\"http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg\" alt-text=\"Some Steamboat Guy Again\"/> <\/div>\n\n^^pagebreak\n\n#Inline Visualizations\nYou can embed your own visualizations! At PUBPUB's current state you must host the project yourself and embed an iframe. Come to us if you need help with that (pubpub@media.mit.edu). We'll be making that process smoother in the coming weeks.",
            style:'One-Column',  
            styleColor:'Grey', 
            refStyle:'MLA', 
            assets:{},
            lastEditDate: new Date().getTime()
          }
        });
      pub.collaboratorsUsers.authors.push(req.user['_id']);


  

      pub.createDate = new Date().getTime();
      // console.log(pub);

      pub.save(function (err, pub) {
          if (err) { return next(err) }
            var pubID = pub.id;
            var userID = req.user['_id'];

            User.update({ _id: userID }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
            return res.status(201).json(pub);
      })

    });
    
  })
  .delete('/pub', function(req, res) {
  return
  })


app.post('/updateStyle', function(req, res) {
  Pub.update({'_id': req.body.pubID},{$set:{'draft.style':req.body.newStyle}}, function(err, result){
    if (err){console.log(err); return res.status(500).json(err);} 

    return res.status(200).json(result);
  })
});

app.post('/updateRefStyle', function(req, res) {
  Pub.update({'_id': req.body.pubID},{$set:{'draft.refStyle':req.body.newRefStyle}}, function(err, result){
    if (err){console.log(err); return res.status(500).json(err);} 

    return res.status(200).json(result);
  })
});

app.post('/updateStyleColor', function(req, res) {
  Pub.update({'_id': req.body.pubID},{$set:{'draft.styleColor':req.body.newStyleColor}}, function(err, result){
    if (err){console.log(err); return res.status(500).json(err);} 

    return res.status(200).json(result);
  })
});

app.post('/addCollaboratorUser', function(req, res, next) {
    // When a discussion gets posted, it must:
    // Save to the discussions collection
    // Update the pub with objectID
    // Update user with objectID
    User.findOne({'username':req.body.username}).exec(function (err, user) {
      if (err) return res.json(500);
      // console.log(user)
      if(user){
        var userID = user['_id'];
        Pub.findOne({ _id: req.body.pubID }).exec(function (err, pub) {
          if(pub.collaboratorsUsers.authors.indexOf(userID)<0 && pub.collaboratorsUsers.readers.indexOf(userID)<0){
            Pub.update({ _id: req.body.pubID }, { $addToSet: { 'collaboratorsUsers.readers': userID} }, function(err, result){if(err) return handleError(err)});
            var output = {
              '_id': userID,
              'image': user['image'],
              'name': user['name'],
              'type': 'Reader',
              'username': user['username']
            };
            console.log('returning the top');
            return res.status(201).json(output);
          }else{
            console.log('returning the bottom');
            return res.status(201).json(null);
          }
            
        });
         
      }else{
        return res.json(null);  
      }

      

    });
});

app.post('/deleteCollaboratorUser', function(req, res, next) {
  console.log(req.body.username)
  User.findOne({'username':req.body.username}).exec(function (err, user) {
    if (err) return res.json(500);
    console.log(user);
    var userID = user['_id'];
    User.update({ 'username':req.body.username }, { $pull: { 'pubs': req.body.pubID} }, function(err, result){if(err) return handleError(err)});
    Pub.update({ _id: req.body.pubID }, { $pull: { 'collaboratorsUsers.readers': userID} }, function(err, result){if(err) return handleError(err)});
    Pub.update({ _id: req.body.pubID }, { $pull: { 'collaboratorsUsers.authors': userID} }, function(err, result){if(err) return handleError(err)});
    return res.status(201).json('Removed');

  });
});
app.post('/deleteCollaboratorGroup', function(req, res, next) {
  Group.findOne({'uniqueName':req.body.uniqueName}).exec(function (err, group) {
    if (err) return res.json(500);
    var groupID = group['_id'];
    Group.update({ 'uniqueName':req.body.uniqueName }, { $pull: { 'pubs': req.body.pubID} }, function(err, result){if(err) return handleError(err)});
    Pub.update({ _id: req.body.pubID }, { $pull: { 'collaboratorsGroups.readers': groupID} }, function(err, result){if(err) return handleError(err)});
    Pub.update({ _id: req.body.pubID }, { $pull: { 'collaboratorsGroups.authors': groupID} }, function(err, result){if(err) return handleError(err)});
    return res.status(201).json('Removed');

  });
});

app.post('/addCollaboratorGroup', function(req, res, next) {
    // When a discussion gets posted, it must:
    // Save to the discussions collection
    // Update the pub with objectID
    // Update user with objectID
    Group.findOne({'uniqueName':req.body.uniqueName}).exec(function (err, group) {
      if (err) return res.json(500);
      // console.log(user)
      // if(group){
      //   var groupID = group['_id'];

      //    Pub.update({ _id: req.body.pubID }, { $addToSet: { 'collaboratorsGroups.readers': groupID} }, function(err, result){if(err) return handleError(err)});
      //    var output = {
      //      '_id': groupID,
      //      'image': group['image'],
      //      'name': group['name'],
      //      'type': 'Reader',
      //      'uniqueName': group['uniqueName']
      //    };
      //    // console.log(group);
      //    // console.log(output);
      //    return res.status(201).json(output);
      //  }

      // return res.json(null);


      if(group){
        var groupID = group['_id'];
        Pub.findOne({ _id: req.body.pubID }).exec(function (err, pub) {
          if(pub.collaboratorsGroups.authors.indexOf(groupID)<0 && pub.collaboratorsGroups.readers.indexOf(groupID)<0){
            Pub.update({ _id: req.body.pubID }, { $addToSet: { 'collaboratorsGroups.readers': groupID} }, function(err, result){if(err) return handleError(err)});
            var output = {
              '_id': groupID,
              'image': group['image'],
              'name': group['name'],
              'type': 'Reader',
              'uniqueName': group['uniqueName']
            };
            return res.status(201).json(output);
          }else{
            return res.status(201).json(null);
          }
            
        });
         
      }else{
        return res.json(null);  
      }

    });
});


app.post('/pubarray', function(req, res) {
  Pub.find({'_id': { $in: req.body.pubArray} }, {'draft': 0 })
    .populate('featuredInJournalsObject submittedToJournalsObject')
    .populate({ path: 'collaboratorsUsers.readers collaboratorsUsers.authors', select: 'username name image'})
    .populate({ path: 'collaboratorsGroups.readers collaboratorsGroups.authors', select: 'uniqueName name image'})
    .exec(function(err, pub){
      if (err) return res.status(500).json('Error getting pub arrays');
      
      return res.status(201).json(pub);

    });
});





