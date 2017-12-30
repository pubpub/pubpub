import app from '../server';

app.get('/api/logout', (req, res)=> {
	console.log('In logout');
	req.logout();
	return res.redirect('/');
	// return res.status(201).json('Logout Successful');
});
