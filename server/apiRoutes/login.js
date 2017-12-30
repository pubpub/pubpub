import passport from 'passport';
import app from '../server';

app.post('/api/login', passport.authenticate('local'), (req, res)=> {
	return res.status(201).json('success');
});
