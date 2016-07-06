const app = require('../api');
const User = require('../models').User;

export function checkEmailVerification(req, res) {
	const verificationHash = req.user.verificationHash;
	const submittedHash = req.body.hash;
	
	// If the submitted hash and verification hash don't match - send 401. Do not verify email.
	if (submittedHash !== verificationHash) { return res.status(401).json(false); } 

	// If we passed the previous if, submitted and verification hashes match. 
	// Update User record and send a successful response.
	User.update({ _id: req.user._id }, { $set: { verifiedEmail: true} }).exec()
	.then(function(result) {
		return res.status(201).json(true);	
	})
	.catch(function(error) {
		console.log('error', error);
		return res.status(500).json(error);
	});

}
app.post('/checkEmailVerification', checkEmailVerification);
