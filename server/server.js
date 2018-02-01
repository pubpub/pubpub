import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import enforce from 'express-sslify';
import Module from 'module';
import passport from 'passport';
import analytics from './analytics';
import { sequelize, User } from './models';
import { addActivity, getActivities, getNotificationCount } from './notifications';

/* Since we are server-rendering components, we 	*/
/* need to ensure we don't require things intended 	*/
/* for webpack. Namely, .scss files 				*/
const originalRequire = Module.prototype.require;
Module.prototype.require = function(...args) {
	if (args[0].indexOf('.scss') > -1) {
		return ()=>{};
	}
	return originalRequire.apply(this, args);
};

/* ---------------------- */
/* Initialize express app */
/* ---------------------- */
const app = express();
export default app;

app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
	app.use(enforce.HTTPS({ trustProtoHeader: true }));
}


/* --------------------- */
/* Configure app session */
/* --------------------- */
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

app.use(session({
	secret: 'sessionsecret',
	resave: false,
	saveUninitialized: false,
	store: new SequelizeStore({
		db: sequelize
	}),
	cookie: {
		path: '/',
		/* These are necessary for */
		/* the api cookie to set */
		/* ------- */
		httpOnly: false,
		secure: false,
		/* ------- */
		maxAge: 30 * 24 * 60 * 60 * 1000// = 30 days.
	},
}));

/* ------------------- */
/* Configure app login */
/* ------------------- */
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* ------------ */
/* Handle Error */
/* ------------ */
app.use((err, req, res, next)=> {
	console.log(`Error!  ${err}`);
	next();
});

/* ---------------- */
/* Server Endpoints */
/* ---------------- */
app.use('/dist', [cors(), express.static('dist')]);
app.use('/static', express.static('static'));
app.use('/service-worker.js', express.static('static/service-worker.js'));
app.use('/favicon.png', express.static('static/favicon.png'));
app.use('/favicon.ico', express.static('static/favicon.png'));
app.use('/robots.txt', express.static('static/robots.txt'));

/* -------------------- */
/* Set Hostname for Dev */
/* -------------------- */
app.use((req, res, next)=> {
	if (req.hostname.indexOf('localhost') > -1) { req.headers.host = 'dev.pubpub.org'; }
	if (req.hostname.indexOf('v4.pubpub.org') > -1) { req.headers.host = 'www.pubpub.org'; }
	next();
});

app.get('/notifications', (req, res)=> {
	console.log('Here');
	addActivity({})
	.then((result)=> {
		return res.status(201).json(result);
	})
	.catch((err)=> {
		return res.status(500).json(err);
	});
});

app.get('/notifications2', (req, res)=> {
	console.log('Here2');
	getActivities()
	.then((result)=> {
		return res.status(201).json(result);
	})
	.catch((err)=> {
		return res.status(500).json(err);
	});
});

app.get('/notifications3', (req, res)=> {
	console.log('Here3');
	getNotificationCount()
	.then((result)=> {
		return res.status(201).json(result);
	})
	.catch((err)=> {
		return res.status(500).json(err);
	});
});

/* ------------- */
/* Import Routes */
/* ------------- */
require('./apiRoutes');

app.use(analytics('UA-61723493-6'));
require('./clientRoutes');

/* ------------ */
/* Start Server */
/* ------------ */
const port = process.env.PORT || 9876;
app.listen(port, (err) => {
	if (err) { console.error(err); }
	console.info('----\n==> 🌎  API is running on port %s', port);
	console.info('==> 💻  Send requests to http://localhost:%s', port);
});
