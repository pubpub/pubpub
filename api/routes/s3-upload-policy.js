const app = require('../api');
const crypto = require('crypto');

const awsDetails = {};
if (process.env.NODE_ENV !== 'production') {
	awsDetails.accessKeyAws = require('../config').accessKeyAws;
	awsDetails.secretKeyAws = require('../config').secretKeyAws;
} else {
	awsDetails.accessKeyAws = process.env.accessKeyAws;
	awsDetails.secretKeyAws = process.env.secretKeyAws;
}

app.get('/uploadPolicy', function(req, res) {
	// if(req.user){
	const s3 = {
		access_key: awsDetails.accessKeyAws,
		secret_key: awsDetails.secretKeyAws,
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
			// return ed;
			return new Date(Date.now() + 60000);
		}
	};

	// const awsAccessKey = s3.access_key; // your acces key to Amazon services (get if from https://portal.aws.amazon.com/gp/aws/securityCredentials)
	// const aws_secret_key = s3.secret_key; // secret access key (get it from https://portal.aws.amazon.com/gp/aws/securityCredentials)

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
	hmac.update(policy);
	const signature = hmac.digest('base64');

	res.status(200).json({
		bucket: bucket,
		aws_key: s3.access_key,
		acl: acl,
		key: key,
		redirect: successActionRedirect,
		content_type: contentType,
		policy: policy,
		signature: signature
	});
	// }else{
	// 	res.status(500).json('Not Logged In');
	// }
});
