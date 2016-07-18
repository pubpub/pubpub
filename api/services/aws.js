const Promise = require('bluebird');
const AWS = require('aws-sdk');
AWS.config.region = 'us-east-1';
AWS.config.setPromisesDependency(Promise);
const readFile = Promise.promisify(require('fs').readFile);

export function uploadLocalFile(filePath) {

	let folderName = '';
	const possible = 'abcdefghijklmnopqrstuvwxyz';
	for ( let charIndex = 0; charIndex < 8; charIndex++) { folderName += possible.charAt(Math.floor(Math.random() * possible.length)); }
	const extension = filePath !== undefined ? filePath.substr((~-filePath.lastIndexOf('.') >>> 0) + 2) : 'jpg';
	const filename = folderName + '/' + new Date().getTime() + '.' + extension;

	return readFile(filePath)
	.then(function(file) {
		const s3bucket = new AWS.S3({params: {Bucket: 'assets.pubpub.org'}});
		const params = {
			Key: filename, 
			Body: file,
			ACL: 'public-read',
		};
		return s3bucket.putObject(params).promise();
	})
	.then(function(result) {
		return filename;
	})
	.catch(function(error) {
		console.log('Error uploading data: ', error);
	});
}

// uploadLocalFile('/Users/travis/Workspace/acad_MediaLab/proj_pubpub_v1/api/services/emails.js');
