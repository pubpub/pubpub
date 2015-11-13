var app = require('../api');
var Pub  = require('../models').Pub;
var User  = require('../models').User;


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


app.get('/getSamplePub', function(req,res){
	// console.log(req.user);
	// console.log(req.query);
	let outputPub = {
		title: 'My Sample Pub',
		slug: 'cat',
		collaborators: [],
		discussions: [],
		highlights: [],
		favorited: [],
		assets: [],
		image: 'http://i.imgur.com/BvS0qUz.jpg',
		settings: {
			isPrivate: false
		},
		style: {},
		createDate: 1446744004219,
		lastUpdateDate: 1446744004319,
		featuredIn: [],
		submittedTo: [],
		endorsements: [],
		experts: [],
		invitedExperts: [],
		authorsNote: 'Hey everybody. This is just a draft!',
		markdown: "# Your New Pubs!\nWelcome to your new pub. Click the 'Edit Draft' button in the top-right corner to edit this content! The following text provides you with some starter content to see how Pubs are written. LaTeX and WSYWIG support coming soon!\n\n#Styling\n\n# Header1\n## Header2\n### Header3\n\nYou can add super cool links like this [Super Sweet Link](http://www.google.com/search?q=smiling+puppy&tbm=isch) \n\nAdd emphasis something _super_ important.\n\n#References\nAdd References to the right and cite them using the Cite Tag! ^^cite{refNameGoesHere}\n\n#Lists go like this\n\n* My\n* List\n* Items\n\n-- or like this --\n\n1. My \n2. List\n3. Items\n\n\n\n\n#Insert page Breaks:\n^^pagebreak\n\n#Images\n##We can do in-column and full-width images\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin libero et ante vestibulum euismod. Curabitur consequat arcu eu lacus condimentum laoreet. Etiam a ligula ac orci dictum fermentum vel in ligula. Vivamus gravida tempus leo, vitae tempus lectus vehicula et. Donec accumsan massa at elit tristique, quis aliquam nibh efficitur. Integer purus urna, luctus sed sagittis nec, ultrices semper lorem. Sed in porttitor eros.\n\n ![Some Steamboat Guy](http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg) \n\nMauris ut sollicitudin risus. In hac habitasse platea dictumst. Pellentesque eget velit eu elit egestas fermentum vitae eget urna. Duis dictum lacinia mauris in interdum. Aliquam porttitor ultricies diam eu pharetra. Vestibulum ornare tellus in facilisis venenatis. In sed ligula id purus pellentesque suscipit ut eu neque. Nam efficitur ultricies lacus laoreet porttitor. Phasellus rutrum bibendum sem, at laoreet nunc congue at. Cras efficitur urna eu orci lobortis tincidunt. Etiam pellentesque efficitur neque, ut finibus quam interdum sed.\n\n ![Smooth](http://i.imgur.com/7FJzLNd.gif) \nProin porttitor, quam ac sagittis aliquam, purus turpis sodales sapien, sed luctus lorem diam a magna. Vivamus ornare rutrum risus, et malesuada odio viverra ac. Phasellus volutpat eget nulla gravida accumsan. Praesent ac interdum purus. Donec arcu metus, placerat at turpis tempus, mattis lobortis velit. Proin tristique odio vel nibh gravida eleifend a eu risus. Donec sit amet lectus nibh. Vivamus blandit ultricies tempus. Sed tincidunt quis lectus placerat vestibulum. Aenean eget tortor aliquet, elementum ligula quis, congue leo. Nam ultricies, mi eget egestas efficitur, sapien enim tempus metus, sit amet iaculis dolor tortor non ipsum. Praesent ipsum nisl, fermentum sit amet bibendum id, fringilla at justo.\n\n\n<div class=\"full-width\"> <img src=\"http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg\" alt-text=\"Some Steamboat Guy Again\"/> <\/div>\n\n^^pagebreak\n\n#Inline Visualizations\nYou can embed your own visualizations! At PUBPUB's current state you must host the project yourself and embed an iframe. Come to us if you need help with that (pubpub@media.mit.edu). We'll be making that process smoother in the coming weeks.",
		html: '',
		abstract: 'Here is my abstract'
	};

	res.status(201).json(outputPub);
});

app.get('/getSamplePubEdit', function(req,res){
	// console.log(req.user);
	// console.log(req.query);
	let outputPub = {
		title: 'My Sample Pub',
		slug: 'cat',
		collaborators: [],
		discussions: [],
		highlights: [],
		favorited: [],
		assets: [],
		image: 'http://i.imgur.com/BvS0qUz.jpg',
		settings: {
			isPrivate: false
		},
		style: {},
		createDate: 1446744004219,
		lastUpdateDate: 1446744004319,
		featuredIn: [],
		submittedTo: [],
		endorsements: [],
		experts: [],
		invitedExperts: [],
		authorsNote: 'Hey everybody. This is just a draft!',
		markdown: "# Your New Pubs!\nWelcome to your new pub. Click the 'Edit Draft' button in the top-right corner to edit this content! The following text provides you with some starter content to see how Pubs are written. LaTeX and WSYWIG support coming soon!\n\n#Styling\n\n# Header1\n## Header2\n### Header3\n\nYou can add super cool links like this [Super Sweet Link](http://www.google.com/search?q=smiling+puppy&tbm=isch) \n\nAdd emphasis something _super_ important.\n\n#References\nAdd References to the right and cite them using the Cite Tag! ^^cite{refNameGoesHere}\n\n#Lists go like this\n\n* My\n* List\n* Items\n\n-- or like this --\n\n1. My \n2. List\n3. Items\n\n\n\n\n#Insert page Breaks:\n^^pagebreak\n\n#Images\n##We can do in-column and full-width images\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin libero et ante vestibulum euismod. Curabitur consequat arcu eu lacus condimentum laoreet. Etiam a ligula ac orci dictum fermentum vel in ligula. Vivamus gravida tempus leo, vitae tempus lectus vehicula et. Donec accumsan massa at elit tristique, quis aliquam nibh efficitur. Integer purus urna, luctus sed sagittis nec, ultrices semper lorem. Sed in porttitor eros.\n\n ![Some Steamboat Guy](http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg) \n\nMauris ut sollicitudin risus. In hac habitasse platea dictumst. Pellentesque eget velit eu elit egestas fermentum vitae eget urna. Duis dictum lacinia mauris in interdum. Aliquam porttitor ultricies diam eu pharetra. Vestibulum ornare tellus in facilisis venenatis. In sed ligula id purus pellentesque suscipit ut eu neque. Nam efficitur ultricies lacus laoreet porttitor. Phasellus rutrum bibendum sem, at laoreet nunc congue at. Cras efficitur urna eu orci lobortis tincidunt. Etiam pellentesque efficitur neque, ut finibus quam interdum sed.\n\n ![Smooth](http://i.imgur.com/7FJzLNd.gif) \nProin porttitor, quam ac sagittis aliquam, purus turpis sodales sapien, sed luctus lorem diam a magna. Vivamus ornare rutrum risus, et malesuada odio viverra ac. Phasellus volutpat eget nulla gravida accumsan. Praesent ac interdum purus. Donec arcu metus, placerat at turpis tempus, mattis lobortis velit. Proin tristique odio vel nibh gravida eleifend a eu risus. Donec sit amet lectus nibh. Vivamus blandit ultricies tempus. Sed tincidunt quis lectus placerat vestibulum. Aenean eget tortor aliquet, elementum ligula quis, congue leo. Nam ultricies, mi eget egestas efficitur, sapien enim tempus metus, sit amet iaculis dolor tortor non ipsum. Praesent ipsum nisl, fermentum sit amet bibendum id, fringilla at justo.\n\n\n<div class=\"full-width\"> <img src=\"http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg\" alt-text=\"Some Steamboat Guy Again\"/> <\/div>\n\n^^pagebreak\n\n#Inline Visualizations\nYou can embed your own visualizations! At PUBPUB's current state you must host the project yourself and embed an iframe. Come to us if you need help with that (pubpub@media.mit.edu). We'll be making that process smoother in the coming weeks.",
		html: '',
		abstract: 'Here is my abstract'
	};

	res.status(201).json(outputPub);
});

app.get('/user', function(req, res) {
  User.findOne({'username':req.query.username}, '-salt -hash')
	.populate("highlights")
	.populate({path: "pubs", select:"displayTitle uniqueTitle image featuredInJournalsList featuredInJournalsObject"})
	.exec(function (err, user) {

      if (!err) {
        if(!user){
          return res.status(404).json('No User')
        }
        var options = [{
            path: 'relatedpubs.pub',
            select: 'displayTitle uniqueTitle image',
            model: 'Pub'
          },{
            path: 'references.owner',
            select: 'name username image',
            model: 'User'
          },{
            path: 'references.sourcePub',
            select: 'uniqueTitle displayTitle image',
            model: 'Pub'
          },{
            path: 'highlights.pub',
            select: 'uniqueTitle displayTitle image',
            model: 'Pub'
          },{
            path: 'externals.pub',
            select: 'uniqueTitle displayTitle image',
            model: 'Pub'
          },{
            path: 'discussions.pub',
            select: 'uniqueTitle displayTitle image',
            model: 'Pub'
          },{
            path: 'references.sourceHighlight',
            select: 'selection',
            model: 'Highlight'
          },{
            path: 'reviews.pub',
            select: 'uniqueTitle displayTitle image',
            model: 'Pub'
          }


        ];
        User.populate(user, options, function (err, user) {
          if (err) return res.json(500);
          var userObj = user.toObject();
          if(req.user){
            if(!userObj.emailPublic && userObj._id.toString() != req.user._id.toString()){
              delete userObj.email;
            }  
          }else{
            if(!userObj.emailPublic){
              delete userObj.email;  
            }
          }

          var ii = userObj.reviews.length;
          while (ii--) {
            if(!userObj.reviews[ii].postDate){
              userObj.reviews.splice(ii, 1);
            }
          }
          
          delete userObj.resetHash;
          delete userObj.resetHashExpiration;
          res.status(201).json(userObj);
        });
      } else {
        console.log(err);
        return res.json(500);
      }
    });
});


var crypto = require('crypto');
const awsDetails = {};
if(process.env.NODE_ENV !== 'production'){
  import {access_key_aws, secret_key_aws} from '../authentication/awsCredentials';
  awsDetails.access_key_aws = access_key_aws;
  awsDetails.secret_key_aws = secret_key_aws;
}else{
	awsDetails.access_key_aws = process.env.access_key_aws;
	awsDetails.secret_key_aws = process.env.secret_key_aws;
}

app.get('/uploadPolicy', function(req,res){
  if(req.user){
    var s3 = {
      access_key: awsDetails.access_key_aws,
      secret_key: awsDetails.secret_key_aws,
      bucket: "pubpub-upload",
      acl: "public-read",
      https: "false",
      error_message: "",
      pad: function(n) {
        if ((n+"").length == 1) {
          return "0" + n;
        }
        return ""+n;
      }, 
      expiration_date: function() {
        var now = new Date();
        var date = new Date( now.getTime() + (3600 * 1000) );
        var ed = date.getFullYear() + "-" + this.pad(date.getMonth()+1) + "-" + this.pad(date.getDate());
          ed += "T" + this.pad(date.getHours()) + ":" + this.pad(date.getMinutes()) + ":" + this.pad(date.getSeconds()) + ".000Z";
        // return ed;
        return new Date(Date.now() + 60000);
      }
    };

    const aws_access_key = s3.access_key; // your acces key to Amazon services (get if from https://portal.aws.amazon.com/gp/aws/securityCredentials)
    const aws_secret_key = s3.secret_key; // secret access key (get it from https://portal.aws.amazon.com/gp/aws/securityCredentials)
   
    const bucket = s3.bucket; // the name you've chosen for the bucket
    const key = '/${filename}'; // the folder and adress where the file will be uploaded; ${filename} will be replaced by original file name (the folder needs to be public on S3!)
    const success_action_redirect = 'http://localhost:3000/upload/success'; // URL that you will be redirected to when the file will be successfully uploaded
    const content_type = req.query.contentType; // limit accepted content types; empty will disable the filter; for example: 'image/', 'image/png'
    const acl = s3.acl; // private or public-read
   
    // THIS YOU DON'T
    var policy = { "expiration": s3.expiration_date(),
      "conditions": [
        {"bucket": bucket},
        ["starts-with", "$key", ''],
        {"acl": acl},
        // {"ContentEncoding": "base64"},
        // {"ContentType": "image/jpeg"},
        // {"key":"justupload.png"}
        {"success_action_status": '200'},
        ["starts-with", "$Content-Type", ""],
        // {"x-amz-meta-uuid": "14365123651275"},
        // ["starts-with", "$x-amz-meta-tag", ""]
      ]
    };
    policy = new Buffer(JSON.stringify(policy)).toString('base64').replace(/\n|\r/, '');
    var hmac = crypto.createHmac("sha1", s3.secret_key);
    var hash2 = hmac.update(policy);
    var signature = hmac.digest("base64");
   
    res.status(200).json({
      bucket: bucket,
      aws_key: aws_access_key,
      acl: acl,
      key: key,
      redirect: success_action_redirect,
      content_type: content_type,
      policy: policy,
      signature: signature
    });
  }else{
    res.status(500).json('Not Logged In');
  }
});


var crypto = require('crypto');
var cloudinary = require('cloudinary');
if (process.env.NODE_ENV !== 'production') {
  import {cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret} from '../authentication/cloudinaryCredentials';
  cloudinary.config({ 
	  cloud_name: cloudinary_cloud_name, 
	  api_key: cloudinary_api_key, 
	  api_secret: cloudinary_api_secret 
	});
} else {
	cloudinary.config({ 
		cloud_name: process.env.cloudinary_cloud_name,
		api_key: process.env.cloudinary_api_key,
		api_secret: process.env.cloudinary_api_secret
	});
}

app.get('/handleNewFile', function(req,res){
	
	if(req.query.contentType.indexOf('image') > -1){
		const delay = (req.query.contentType.indexOf('image/gif') > -1) ? 1500 : 0;
		// Gifs through a 403 for some reason.
		// A delay seems to make that 403 go away.
		// Perhaps S3 is taking time to process? That seems strange, why would it finish to begin with 
		// if it had more to do?
		// Probably need a cleaner solution, but this'll work for now.
		setTimeout(function(){		
			cloudinary.uploader.upload(req.query.url, function(result) { 
        result.thumbnail = result.url.replace('/upload', '/upload/c_limit,h_50,w_50');
        result.assetType = 'image';
			  return res.status(201).json(result);
			});	
		}, delay);

	} else if (req.query.contentType.indexOf('video') > -1){
		cloudinary.uploader.upload(req.query.url, function(result) { 
		  console.log(result) 
      
      result.thumbnail = 'https://res.cloudinary.com/pubpub/video/upload/t_media_lib_thumb/c_limit,h_50,w_50/' + result.public_id + '.jpg';
      result.assetType = 'video';
		  return res.status(201).json(result);
		}, { resource_type: "video" });
	} else {
		res.status(201).json({
      thumbnail: '/thumbnails/data.png',
      assetType: 'data',
      url: req.query.url
    });
	}

});

