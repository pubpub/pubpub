const sendgridKey = process.env.NODE_ENV !== 'production' ? require('../authentication/sendgridCredentials').sendgridAPIKey : process.env.SENDGRID_API_KEY;
const sendgrid  = require('sendgrid')(sendgridKey);

const fromname = 'PubPub';
const from = 'pubpub@media.mit.edu';


export function registrationEmail(email, callback) {
	var emailObject = new sendgrid.Email();
	emailObject.addTo(email);
	emailObject.subject = "Welcome to PubPub!"; // We should have a journal here.
	emailObject.from = from;
	emailObject.fromname = fromname;
	emailObject.text = 'Welcome to PubPub!';
	emailObject.html = '<h1>Welcome!</h1><p></p>';

	emailObject.addFilter('templates', 'enable', 1);
	emailObject.addFilter('templates', 'template_id', 'caad4e63-a636-4c81-9cc2-7d65e581a876');

	sendgrid.send(emailObject, callback(err, json));
};

export function sendResetEmail(email, hash, username, callback) {
	const resetURL = 'http://www.pubpub.org/resetpassword/' + hash + '/' + username;

	var emailObject = new sendgrid.Email();
	emailObject.addTo(email);
	emailObject.subject = "PubPub Password Reset!";
	emailObject.from = from;
	emailObject.fromname = fromname;
	emailObject.text = 'Reset Password. We\'ve received a password reset request for your account. To reset, visit ' + resetURL + ' . If you did not request this reset - simply delete this email.';
	emailObject.html = '<h1 style="color: #373737;">Reset Password</h1> <p style="color: #373737;">We\'ve received a password reset request for your account.</p> <p style="color: #373737;">To reset, visit <a href="' + resetURL + '">' + resetURL + '</a></p> <p style="color: #373737;">If you did not request this reset - simply delete this email.</p>';

	emailObject.addFilter('templates', 'enable', 1);
	emailObject.addFilter('templates', 'template_id', 'caad4e63-a636-4c81-9cc2-7d65e581a876');

	sendgrid.send(emailObject, callback);
};


export function sendInviteEmail(senderName, pubName, pubURL, journalName, journalURL, journalIntroduction, recipientEmail, callback) {

	var emailObject = new sendgrid.Email();
	emailObject.addTo(recipientEmail);
	emailObject.subject = "Invitation to Review " + pubName;
	emailObject.from = from;
	// emailObject.fromname = fromname;
	emailObject.fromname = senderName + ' (PubPub)';
	// emailObject.addSubstitution('%recipient%', [recipientName]);
	emailObject.addSubstitution('%sender%', [senderName]);
	emailObject.addSubstitution('%journal%', [journalName]);
	emailObject.addSubstitution('%journalURL%', [journalURL]);
	emailObject.addSubstitution('%pub%', [pubName]);
	emailObject.addSubstitution('%pubURL%', [pubURL]);
	emailObject.addSubstitution('%journalIntroduction%', [journalIntroduction]);

	emailObject.text = ' ';
	emailObject.html = ' ';

	emailObject.addFilter('templates', 'enable', 1);
	emailObject.addFilter('templates', 'template_id', 'f3fb33cb-a630-4be0-9abd-5496ee05903d');

	sendgrid.send(emailObject, callback);
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
