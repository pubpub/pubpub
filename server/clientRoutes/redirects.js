import app from '../server';
import { hostIsValid } from '../utilities';

app.get('/iai', (req, res, next)=> {
	if (!hostIsValid(req, 'pubpub')) { return next(); }
	return res.redirect('https://v3.pubpub.org/iai');
});

app.get('/pub/resisting-reduction', (req, res, next)=> {
	if (req.hostname === 'pubpub.ito.com') {
		return res.redirect('https://jods.mitpress.mit.edu/pub/resisting-reduction');
	}
	return next();
});
