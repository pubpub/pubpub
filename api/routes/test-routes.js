var app = require('../api');
var Pub  = require('../models').Pub;
var User  = require('../models').User;

app.get('/getEcho', function(req, res){
	res.status(201).json(req.query);
});
app.post('/postEcho', function(req, res){
	res.status(201).json(req.body);
});


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

