export const cloudinary = require('cloudinary');

// If we're NOT in production mode
// get cloudinary keys from local non-git tracked file.
if (process.env.NODE_ENV !== 'production') {
	
	import {cloudinary_cloud_name, cloudinary_api_key, cloudinary_api_secret} from '../authentication/cloudinaryCredentials';
	cloudinary.config({ 
		cloud_name: cloudinary_cloud_name, 
		api_key: cloudinary_api_key, 
		api_secret: cloudinary_api_secret 
	});

// If we ARE in production mode
// get cloudinary keys env variables
} else {

	cloudinary.config({ 
		cloud_name: process.env.cloudinary_cloud_name,
		api_key: process.env.cloudinary_api_key,
		api_secret: process.env.cloudinary_api_secret
	});
}