const sendgridKey = process.env.NODE_ENV !== 'production' ? require('../authentication/sendgridCredentials').sendgridAPIKey : process.env.SENDGRID_API_KEY;
const sendgrid  = require('sendgrid')(sendgridKey);

const fromname = 'PubPub';
const from = 'pubpub@media.mit.edu';

export function registrationEmail(email, callback) {
	var email = new sendgrid.Email();
	email.addTo(email);
	email.subject = "Welcome to PubPub!"; // We should have a journal here.
	email.from = from;
	email.fromname = fromname;
	email.text = 'Welcome to PubPub!';
	email.html = '<h1>Welcome!</h1><p></p>';

	email.addFilter('templates', 'enable', 1);
	email.addFilter('templates', 'template_id', 'caad4e63-a636-4c81-9cc2-7d65e581a876');

	sendgrid.send(email, callback(err, json));
};

export function sendResetEmail(email, hash, username, callback) {
	var email = new sendgrid.Email();
	const resetURL = 'http://www.pubpub.org/resetpassword/' + hash + '/' + username;
	email.addTo(email);
	email.subject = "PubPub Password Reset!";
	email.from = from;
	email.fromname = fromname;
	email.text = 'Reset Password. We\'ve received a password reset request for your account. To reset, visit ' + resetURL + ' . If you did not request this reset - simply delete this email.';
	email.html = '<h1>Reset Password</h1> <p>We\'ve received a password reset request for your account.</p> <p>To reset, visit <a href="' + resetURL + '">' + resetURL + '</a></p> <p>If you did not request this reset - simply delete this email.</p>';

	email.addFilter('templates', 'enable', 1);
	email.addFilter('templates', 'template_id', 'caad4e63-a636-4c81-9cc2-7d65e581a876');

	sendgrid.send(email, callback(err, json));
};

// var email     = new sendgrid.Email({
// 	to:       req.body.email,
// 	from:     'pubpub@media.mit.edu',
// 	fromname: 'PubPub Team',
// 	subject:  'Password Reset.',
// 	text:     "We've received a password reset request for your account. To reset, visit this link: http://localhost:7000/reset/"+resetHash+"/"+user.username+" ."
// });
// sendgrid.send(email, function(err, json) {
// 	if (err) { return console.error(err); }
// 	// console.log(json);
// 	return res.status(201).json('Reset Sent');
// });