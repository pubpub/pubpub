import passport from 'passport';
import app from 'server/server';
import { User } from 'server/models';

app.get(
	'/auth/zotero',
	(req, res, next) => {
		if (req.user) {
			const authRedirectHost = req.get('host');
			User.update({ authRedirectHost }, { where: { id: req.user.id } });
		}
		next();
	},
	passport.authenticate('zotero', { state: 'test' }),
);

// callback route for zotero to redirect to
// hand control to passport to use code to grab profile info
app.get('/auth/zotero/redirect', (req, res, next) => {
	const host = req.user?.authRedirectHost;
	passport.authenticate('zotero', {
		failureRedirect: `${host}/legal/settings?integration=fail`,
		successRedirect: `${host}/legal/settings?integration=success`,
	})(req, res, next);
});
