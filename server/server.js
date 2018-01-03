import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import enforce from 'express-sslify';
import Module from 'module';
import passport from 'passport';
import { sequelize, User } from './models';

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


/* -------- */
/* Configure app session */
/* -------- */
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

/* -------- */
/* Configure app CORS */
/* -------- */
const whitelist = [
	/* Localhost */
	/http:\/\/localhost:([0-9]+)*/i,
	/* PubPub Subdomains */
	/https:\/\/([a-z0-9-]+)*.pubpub.org/i,
	/* Custom domains */
	'https://pub.fiftynifty.org',
	'https://pubpub.ito.com',
	'https://www.responsivescience.org',
	'https://www.reclamationsci.com',
	'https://jods.mitpress.mit.edu',
	'https://contemporaryarts.mit.edu',
	'https://www.tjoe.org',
];

const corsOptions = {
	origin: function (origin, callback) {
		// This assumes the browser implements CORS.
		// origin being undefined means the request is made on a local route
		const originIsWhitelisted = whitelist.reduce((prev, curr)=> {
			if (curr.test && curr.test(origin)) { return true; }
			if (curr === origin) { return true; }
			return prev;
		}, false) || origin === undefined;
		callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
	},
	methods: 'POST, GET, PUT, DELETE, OPTIONS',
	allowHeaders: 'X-Requested-With, Content-Type',
	credentials: true,
};
app.use(cors(corsOptions));

/* ------------------- */
/* Configure app login */
/* ------------------- */
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// Use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/* -------------------- */
/* -------------------- */

// Handle errors.
app.use((err, req, res, next)=> {
	console.log(`Error!  ${err}`);
	next();
});

/* ------------------- */
/* Server Endpoints */
/* ------------------- */
app.use('/dist', express.static('dist'));
app.use('/fonts', express.static('dist/fonts'));
app.use('/static', express.static('static'));
app.use('/favicon.png', express.static('static/favicon.png'));
app.use('/robots.txt', express.static('static/robots.txt'));

/* Set Hostname for Dev */
app.use((req, res, next)=> {
	if (req.hostname.indexOf('localhost') > -1) { req.headers.host = 'dev.pubpub.org'; }
	if (req.hostname.indexOf('ssl.pubpub.org') > -1) { req.headers.host = 'dev.pubpub.org'; }
	next();
});

require('./apiRoutes');
require('./clientRoutes');
/* ------------------- */
/* ------------------- */

const port = process.env.PORT || 9876;
app.listen(port, (err) => {
	if (err) { console.error(err); }
	console.info('----\n==> 🌎  API is running on port %s', port);
	console.info('==> 💻  Send requests to http://localhost:%s', port);
});
