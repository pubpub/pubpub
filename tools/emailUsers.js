/* eslint-disable no-console */
import Promise from 'bluebird';
import { User } from 'server/models';

import mailgun from 'mailgun.js';
import stripIndent from 'strip-indent';
import { promptOkay } from './utils/prompt';

const mg = mailgun.client({
	username: 'api',
	key: process.env.MAILGUN_API_KEY,
});

const emailSubject = 'Proposed Terms and Privacy Policy Updates';
const emailBody = stripIndent(`
Hello,

We're building PubPub for readers, publishers, and knowledge creators. Not for analytics companies.
We've been working hard with a legal team that specializes in open-source software on updating
PubPub's Privacy Policy, Terms of Service, and Acceptable Use Policy to be easier to understand,
more comprehensive, and more protective of user and publisher rights on PubPub,
while also trying to minimize PubPub's rights as much as possible.

You can read the proposed new terms at the following URLs:

https://www.pubpub.org/legal/proposed-terms
https://www.pubpub.org/legal/proposed-privacy
https://www.pubpub.org/legal/proposed-aup

These terms will replace our existing terms and go into effect two weeks from now, on
ADD_DATE_BEFORE_SENDING. In the meantime, we sincerely welcome your feedback and comments on our
proposed terms. 

Please visit our the following discussion thread on our new PubPub Forum to add your thoughts:



Sincerely,
Your PubPub Team
`);

const sendEmail = async (user) => {
	const userEmail = user.dataValues.email;
	console.log(`Sending to: ${userEmail}`);
	return mg.messages.create('mg.pubpub.org', {
		from: 'PubPub Team <hello@pubpub.org>',
		to: [userEmail],
		subject: emailSubject,
		text: emailBody,
	});
};

const main = async () => {
	const query =
		process.env.NODE_ENV === 'production' ? {} : { where: { email: 'g@gabestein.com' } };
	const users = await User.findAll(query);
	console.log(`${emailBody}`);
	await promptOkay(`Send the above email to ${users.length} users?`, {
		yesIsDefault: false,
		throwIfNo: true,
	});
	try {
		await Promise.map(users, sendEmail, { concurrency: 5 });
	} catch (err) {
		console.warn(err);
	}
};

main().finally(() => process.exit(0));
