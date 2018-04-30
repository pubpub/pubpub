import Promise from 'bluebird';
import postmark from 'postmark';
import app from '../server';
import { User } from '../models';
import { generateHash } from '../utilities';

const client = new postmark.Client(process.env.POSTMARK_API_KEY);

app.post('/api/password-reset', (req, res)=> {
	User.findOne({
		where: { email: req.body.email }
	}).then((user)=> {
		if (!user) { throw new Error('User doesn\'t exist'); }

		const updateData = {
			resetHash: generateHash(),
			resetHashExpiration: Date.now() + (1000 * 60 * 60 * 24) // Expires in 24 hours.
		};
		return User.update(updateData, {
			where: { id: user.id },
			returning: true,
			individualHooks: true
		});
	}).then((updatedUserData)=> {
		const updatedUser = updatedUserData[1][0];
		return client.sendEmailWithTemplate({
			From: 'pubpub@media.mit.edu',
			To: updatedUser.email,
			TemplateId: '3668905',
			TemplateModel: {
				action_url: `${req.headers.origin}/password-reset/${updatedUser.resetHash}/${updatedUser.slug}`
			}
		});
	})
	.then(()=> {
		return res.status(200).json('success');
	})
	.catch((err)=> {
		console.log('Error resetting password post', err);
		return res.status(401).json('Error resseting password.');
	});
});

app.put('/api/password-reset', (req, res)=> {
	const user = req.user || {};
	const resetHash = req.body.resetHash;
	const slug = req.body.slug;
	const currentTime = Date.now();

	const whereQuery = user.id
		? { id: user.id }
		: { resetHash: resetHash, slug: slug };

	User.findOne({
		where: whereQuery,
	})
	.then((userData)=> {
		if (!userData) { throw new Error('User doesn\'t exist'); }
		if (!user.id && resetHash && userData.resetHashExpiration < currentTime) { throw new Error('Hash is expired'); }

		// Promisify the setPassword function, and use .update to match API convention
		const setPassword = Promise.promisify(userData.setPassword, { context: userData });
		return setPassword(req.body.password);
	})
	.then((passwordResetData)=> {
		const updateData = {
			hash: passwordResetData.dataValues.hash,
			salt: passwordResetData.dataValues.salt,
			resetHash: '',
			resetHashExpiration: currentTime,
			passwordDigest: 'sha512',
		};
		return User.update(updateData, {
			where: whereQuery,
		});
	})
	.then(()=> {
		return res.status(200).json('success');
	})
	.catch((err)=> {
		return res.status(401).json(err.message);
	});
});

