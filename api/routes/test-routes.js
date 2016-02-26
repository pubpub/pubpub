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

app.post('/createPub', function(req, res){
	displayTitle
	slug

	setTimeout(function(){
		res.status(201).json('Did it!');	
	}, 2000);
	
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
		collaborators: [
			{
				type: 'author',
				name: 'Travis Rich'
			},
			{
				type: 'author',
				name: 'Don Cheadle'
			},
			{
				type: 'reader',
				name: 'Cesar Hidalgo'
			},

		],
		highlights: [],
		followers: 195, // Is stored as array of user IDs, so we know who to update, but we just send down the length of that array
		assets: [],
		settings: {
			isPrivate: false
		},
		style: {},
		createDate: 1446744004219,
		lastUpdateDate: 1446744004319,
		featuredIn: [
			{
				dateApproved: new Date(),
				name: 'Journal of Science'
			},
			{
				dateApproved: new Date(),
				name: 'Journal of Things'
			},
		],
		submittedTo: [
			{
				dateSubmitted: new Date(),
				name: 'Journal of Submissions'
			},
		],
		reviews: [
			// Perhaps all of the smooshing should be done server-side, to fake reverse-engineering
			// the votes more challening. Do it client side for now just for clarity of process
			{
				doneWell: ['methods', 'analysis', 'other stuff'],
				needsWork: ['math', 'styling', 'typos'],
				weightLocal: 245, // dynamically calculated based on yays/nays on pub comments
				weightGlobal: 1230 // Snapshot of reputation at moment of review. static
			},
			{
				doneWell: ['methods', 'analysis', 'blending'],
				needsWork: ['math', 'styling', 'typos'],
				weightLocal: 57, // dynamically calculated based on yays/nays on pub comments
				weightGlobal: 24 // Snapshot of reputation at moment of review. static
			},
			{
				doneWell: ['blending', 'analysis', 'other stuff'],
				needsWork: ['math', 'styling', 'typos'],
				weightLocal: 120, // dynamically calculated based on yays/nays on pub comments
				weightGlobal: 4000 // Snapshot of reputation at moment of review. static
			},
			{
				doneWell: ['methods', 'typos', 'other stuff'],
				needsWork: ['styling', 'analysis'],
				weightLocal: 300, // dynamically calculated based on yays/nays on pub comments
				weightGlobal: 12 // Snapshot of reputation at moment of review. static
			},
		],
		discussions: [
			{
				author: {
					name: 'Alex Rinault',
					image: 'http://s3.amazonaws.com/pubpub-upload/travis.png'
				},
				date: new Date(),
				isExpert: false,
				yays: 24, //arrays that we send down the length of
				nays: 13,
				_id: '0',
				sourceHost: 'ml',
				content: 'I don’t know how I feel about mass levels of cyanide gas in my coffee. That seems kinda dangerous, ya know?',
				children: [
					{
						author: {
							name: 'Meg Floobul',
							image: 'http://s3.amazonaws.com/pubpub-upload/lip.png'
						},
						date: new Date(),
						isExpert: false,
						yays: 24, //arrays that we send down the length of
						nays: 64,
						sourceHost: 'ml',
						_id: '1',
						content: 'Don\'t underestimate how much candy tastes like asphalt.',
						children: []
					},
					{
						author: {
							name: 'Mike Briuasdmo ',
							image: 'http://s3.amazonaws.com/pubpub-upload/kevin.png'
						},
						date: new Date(),
						isExpert: false,
						yays: 92, //arrays that we send down the length of
						nays: 64,
						_id: '2',
						sourceHost: 'ml',
						content: '# Analysis of Coffee Taste \n By measuring the complex refraction of a coffee like substance we can begin to understand how early mesopotamian cultures used such substance sto cure medicinal ailments. We can future begin to explore the vast and utterly perplexing by its very nature though systematically neutral range of colors all the way from red to green emit rare photons that are mesophilically obtruse.',
						children: [
							{
								author: {
									name: 'Meg Floobul',
									image: 'http://s3.amazonaws.com/pubpub-upload/lip.png'
								},
								date: new Date(),
								isExpert: false,
								yays: 24, //arrays that we send down the length of
								nays: 64,
								_id: '3',
								sourceHost: 'pandaJournal',
								content: 'hheheheheheh omg yea!',
								children: []
							},
						]
					},
					
				],

			},
			{
				author: {
					name: 'Alex Rinault',
					image: 'http://s3.amazonaws.com/pubpub-upload/travis.png'
				},
				date: new Date(),
				isExpert: false,
				yays: 15, //arrays that we send down the length of
				nays: 4,
				_id: '4',
				sourceHost: 'ml',
				content: 'I think pumpkins are cute!',
				children: []
			},
		],
		experts: [
			{
				image: 'https://s3.amazonaws.com/pubpub-upload/lip.png',
				name: 'Cesar Hidalgo',
				dateAdded: new Date()
			},
			{
				image: 'https://s3.amazonaws.com/pubpub-upload/travis.png',
				name: 'Travis Buffalo',
				dateAdded: new Date()
			},
			{
				image: 'https://s3.amazonaws.com/pubpub-upload/kevin.png',
				name: 'Kevin Who',
				dateAdded: new Date()
			},
		],
		invitedExperts: [
			{
				image: 'https://s3.amazonaws.com/pubpub-upload/kevin.png',
				name: 'Dan Arbaolg',
				dateAdded: new Date()
			},
		],
		authorsNote: 'Hey everybody. This is just a draft!',
		markdown: "# Your New Pubs!\nWelcome to your new pub. Click the 'Edit Draft' button in the top-right corner to edit this content! The following text provides you with some starter content to see how Pubs are written. LaTeX and WSYWIG support coming soon!\n\n#Styling\n\n# Header1\n## Header2\n### Header3\n\nYou can add super cool links like this [Super Sweet Link](http://www.google.com/search?q=smiling+puppy&tbm=isch) \n\nAdd emphasis something _super_ important.\n\n#References\nAdd References to the right and cite them using the Cite Tag! ^^cite{refNameGoesHere}\n\n#Lists go like this\n\n* My\n* List\n* Items\n\n-- or like this --\n\n1. My \n2. List\n3. Items\n\n\n\n\n#Insert page Breaks:\n^^pagebreak\n\n#Images\n##We can do in-column and full-width images\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin libero et ante vestibulum euismod. Curabitur consequat arcu eu lacus condimentum laoreet. Etiam a ligula ac orci dictum fermentum vel in ligula. Vivamus gravida tempus leo, vitae tempus lectus vehicula et. Donec accumsan massa at elit tristique, quis aliquam nibh efficitur. Integer purus urna, luctus sed sagittis nec, ultrices semper lorem. Sed in porttitor eros.\n\n ![Some Steamboat Guy](http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg) \n\nMauris ut sollicitudin risus. In hac habitasse platea dictumst. Pellentesque eget velit eu elit egestas fermentum vitae eget urna. Duis dictum lacinia mauris in interdum. Aliquam porttitor ultricies diam eu pharetra. Vestibulum ornare tellus in facilisis venenatis. In sed ligula id purus pellentesque suscipit ut eu neque. Nam efficitur ultricies lacus laoreet porttitor. Phasellus rutrum bibendum sem, at laoreet nunc congue at. Cras efficitur urna eu orci lobortis tincidunt. Etiam pellentesque efficitur neque, ut finibus quam interdum sed.\n\n ![Smooth](http://i.imgur.com/7FJzLNd.gif) \nProin porttitor, quam ac sagittis aliquam, purus turpis sodales sapien, sed luctus lorem diam a magna. Vivamus ornare rutrum risus, et malesuada odio viverra ac. Phasellus volutpat eget nulla gravida accumsan. Praesent ac interdum purus. Donec arcu metus, placerat at turpis tempus, mattis lobortis velit. Proin tristique odio vel nibh gravida eleifend a eu risus. Donec sit amet lectus nibh. Vivamus blandit ultricies tempus. Sed tincidunt quis lectus placerat vestibulum. Aenean eget tortor aliquet, elementum ligula quis, congue leo. Nam ultricies, mi eget egestas efficitur, sapien enim tempus metus, sit amet iaculis dolor tortor non ipsum. Praesent ipsum nisl, fermentum sit amet bibendum id, fringilla at justo.\n\n\n<div class=\"full-width\"> <img src=\"http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg\" alt-text=\"Some Steamboat Guy Again\"/> <\/div>\n\n^^pagebreak\n\n#Inline Visualizations\nYou can embed your own visualizations! At PUBPUB's current state you must host the project yourself and embed an iframe. Come to us if you need help with that (pubpub@media.mit.edu). We'll be making that process smoother in the coming weeks.",
		html: '',
		abstract: 'Here is my abstract',
		views: 231,
		citations: 290,
		inTheNews: 15, //Should be array of urls
		status: 'Pubished for Peer Review', // or 'draft'
		readNext: [
			{
				title: 'How to find tennis balls',
				slug: 'dog',
			},
			{
				title: 'Correlation between markers and stamps',
				slug: 'dog',
			},
			{
				title: 'Origins of peanut butter',
				slug: 'dog',
			},
		],
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







var crypto = require('crypto');
import {cloudinary} from '../services/cloudinary';

app.get('/handleNewFile', function(req,res){
	
	try {
		// There's a 10mb limit for cloudinary images. Gotta fix that.
		// This shoudl eventually be written to handle discovery and processing of all file types.
		if(req.query.contentType.indexOf('image') > -1) {
			// const delay = (req.query.contentType.indexOf('image/gif') > -1) ? 1500 : 1000;
			const delay = (req.query.contentType.indexOf('image/gif') > -1) ? 0 : 0;


			// Gifs throw a 403 for some reason.
			// A delay seems to make that 403 go away.
			// Perhaps S3 is taking time to process? That seems strange, why would it finish to begin with 
			// if it had more to do?
			// Probably need a cleaner solution, but this'll work for now.

			// https://forums.aws.amazon.com/thread.jspa?messageID=370145
			
			// setTimeout(function(){		
					// cloudinary.uploader.upload(req.query.url, function(result) { 
					// 	try{
					// 		result.thumbnail = result.url ? result.url.replace('/upload', '/upload/c_limit,h_50,w_50') : req.query.url;
					// 		if (!result.url) {
					// 			console.log('cloudinaryResponse in test-routes did not have url. Here is the response:');
					// 			console.log(result);
					// 		}
					//         result.assetType = 'image';
					// 		return res.status(201).json(result);	
					// 	} catch (err){
					// 		console.log('In catch on cloudinary image upload. '); console.log('req.body', req.body); console.log('err', err);
							// If cloudinary fails - just set the thumbnail url to the full sized amazon version url. We can go through and check all the
							// items that have .amazon urls in their thumbnail fields.
							const result = {
								url: req.query.url,
								thumbnail: req.query.url,
								assetType: 'image',
							};
							return res.status(201).json(result);
					// 	}
				        
					// });		

				
			// }, delay);

		} else if (req.query.contentType.indexOf('video') > -1) {
			// cloudinary.uploader.upload(req.query.url, function(result) { 
			// 	try{
			// 		// console.log(result) 
			// 		result.thumbnail = 'https://res.cloudinary.com/pubpub/video/upload/t_media_lib_thumb/c_limit,h_50,w_50/' + result.public_id + '.jpg';
			// 		result.assetType = 'video';
			// 		return res.status(201).json(result);	
			// 	} catch (err) {
			// 		console.log('In catch on cloudinary video upload.'); console.log('req.body', req.body); console.log('err', err); console.log('result', result);
			// 		result = {
			// 			url: req.query.url,
			// 			thumbnail: '/thumbnails/file.png',
			// 			assetType: 'video',
			// 		};
			// 		return res.status(201).json(result);

			// 	}
				
			// }, { resource_type: "video" });	
			const result = {
				url: req.query.url,
				thumbnail: '/thumbnails/file.png',
				assetType: 'video',
			};
			return res.status(201).json(result);
			
			
		} else {
			return res.status(201).json({
				thumbnail: '/thumbnails/data.png',
				assetType: 'data',
				url: req.query.url
			});
		}

	} catch (err) {
		console.log('error in handleNewFile:');
		console.log(err);
		return res.status(500).json(err);
	}
	

});

