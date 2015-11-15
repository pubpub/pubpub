var app = require('../api');
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