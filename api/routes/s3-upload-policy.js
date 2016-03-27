const app = require('../api');
const crypto = require('crypto');

const awsDetails = {};
if (process.env.NODE_ENV !== 'production') {
	// import {access_key_aws, secret_key_aws} from '../authentication/awsCredentials';
	awsDetails.access_key_aws = require('../authentication/awsCredentials').access_key_aws;
	awsDetails.secret_key_aws = require('../authentication/awsCredentials').secret_key_aws;
} else {
	awsDetails.access_key_aws = process.env.access_key_aws;
	awsDetails.secret_key_aws = process.env.secret_key_aws;
}

export function uploadPolicy(req, res) {
	// if(req.user){
	const s3 = {
		access_key: awsDetails.access_key_aws,
		secret_key: awsDetails.secret_key_aws,
		bucket: 'pubpub-upload',
		acl: 'public-read',
		https: 'false',
		error_message: '',
		pad: function(padding) {
			if ((padding + '').length === 1) {
				return '0' + padding;
			}
			return '' + padding;
		},
		expiration_date: function() {
			const now = new Date();
			const date = new Date( now.getTime() + (3600 * 1000) );
			let ed = date.getFullYear() + '-' + this.pad(date.getMonth() + 1) + '-' + this.pad(date.getDate());
			ed += 'T' + this.pad(date.getHours()) + ':' + this.pad(date.getMinutes()) + ':' + this.pad(date.getSeconds()) + '.000Z';
			return new Date(Date.now() + 60000);
		}
	};

	const awsAccessKey = s3.access_key; // your acces key to Amazon services (get if from https://portal.aws.amazon.com/gp/aws/securityCredentials)
	// const awsSecretKey = s3.secret_key; // secret access key (get it from https://portal.aws.amazon.com/gp/aws/securityCredentials)

	const bucket = s3.bucket; // the name you've chosen for the bucket
	const key = '/${filename}'; // the folder and adress where the file will be uploaded; ${filename} will be replaced by original file name (the folder needs to be public on S3!)
	const successActionRedirect = 'http://localhost:3000/upload/success'; // URL that you will be redirected to when the file will be successfully uploaded
	const contentType = req.query.contentType; // limit accepted content types; empty will disable the filter; for example: 'image/', 'image/png'
	const acl = s3.acl; // private or public-read

	// THIS YOU DON'T
	let policy = { 'expiration': s3.expiration_date(),
		'conditions': [
			{'bucket': bucket},
			['starts-with', '$key', ''],
			{'acl': acl},
			// {'ContentEncoding': 'base64'},
			// {'ContentType': 'image/jpeg'},
			// {'key':'justupload.png'}
			{'success_action_status': '200'},
			['starts-with', '$Content-Type', ''],
			// {"x-amz-meta-uuid": "14365123651275"},
			// ["starts-with", "$x-amz-meta-tag", ""]
		]
	};
	policy = new Buffer(JSON.stringify(policy)).toString('base64').replace(/\n|\r/, '');
	const hmac = crypto.createHmac('sha1', s3.secret_key);
	// const hash2 = hmac.update(policy);
	const signature = hmac.digest('base64');

	res.status(200).json({
		bucket: bucket,
		aws_key: awsAccessKey,
		acl: acl,
		key: key,
		redirect: successActionRedirect,
		content_type: contentType,
		policy: policy,
		signature: signature
	});
}
app.get('/uploadPolicy', uploadPolicy);
