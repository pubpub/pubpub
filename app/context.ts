/* eslint-disable import/first, import/order */
// import * as Sentry from '@sentry/node';
import compression from 'compression';
import CreateSequelizeStore from 'connect-session-sequelize';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import enforce from 'express-sslify';
import fs from 'fs';
import noSlash from 'no-slash';
import passport from 'passport';
import path from 'path';

import { loadEnv } from './loadEnv.js';
import { getAppCommit, isProd, isQubQub, setAppCommit, setEnvironment } from 'utils/environment.js';

// Load environment variables first
loadEnv(process.env.PUBPUB_PRODUCTION === 'true');

// ACHTUNG: These calls must appear before we import any more of our own code to ensure that
// the environment, and in particular the choice of dev vs. prod, is configured correctly!
setEnvironment(process.env.PUBPUB_PRODUCTION, process.env.IS_DUQDUQ, process.env.IS_QUBQUB);
if (isQubQub() && !process.env.HEROKU_SLUG_COMMIT) {
	try {
		setAppCommit(fs.readFileSync('.app-commit').toString());
	} catch (err) {
		console.error('Unable to read app commit from .app-commit file: ', err);
	}
} else {
	setAppCommit(process.env.HEROKU_SLUG_COMMIT);
}

import { HTTPStatusError, errorMiddleware } from 'server/utils/errors.js';
// import 'server/utils/serverModuleOverwrite';
import { deduplicateSlash } from './middleware/deduplicateSlash.js';
import { blocklistMiddleware } from './utils/blocklist.js';

import './hooks.js';
import { User } from './models.js';
import { sequelize } from './sequelize.js';
import { zoteroAuthStrategy } from './zoteroIntegration/utils/auth.js';

type Wrap = <
	P = any,
	ResBody = any,
	ReqBody = any,
	ReqQuery = any,
	Locals extends Record<string, any> = Record<string, any>,
>(
	handler: RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>,
) => RequestHandler<P, ResBody, ReqBody, ReqQuery, Locals>;

// Wrapper for app.METHOD() handlers. Though we need this to properly catch errors in handlers that
// return a promise, i.e. those that use async/await, we should use it everywhere to be consistent.
export const wrap: Wrap =
	(routeHandlerFn) =>
	async (...args) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const [req, res, next] = args;
		try {
			return await routeHandlerFn(...args);
		} catch (err) {
			return next(err);
		}
	};

async function authMiddleware({ request, context }) {
	const sesh = await session({
		secret: 'sessionsecret',
		resave: false,
		saveUninitialized: false,
		store: process.env.NODE_ENV !== 'test' ? new SequelizeStore({ db: sequelize }) : undefined,
		cookie: {
			path: '/',
			/* These are necessary for */
			/* the api cookie to set */
			/* ------- */
			httpOnly: false,
			secure: false,
			/* ------- */
			maxAge: 30 * 24 * 60 * 60 * 1000, // = 30 days.
		},
	})(request);
	context.set(userContext, user);
}

router.use(deduplicateSlash());
router.use(noSlash());
router.use(compression());
router.use(express.json({ limit: '50mb' }));
router.use(express.urlencoded({ limit: '50mb', extended: true }));
router.use(cookieParser());

/* --------------------- */
/* Configure app session */
/* --------------------- */
import session from 'express-session';
import { purgeMiddleware } from 'utils/caching/purgeMiddleware.js';
import { schedulePurge } from 'utils/caching/schedulePurgeWithSentry.js';
import { fromZodError } from 'zod-validation-error';

import { abortStorage } from './abort.js';
import { authTokenMiddleware } from './authToken/authTokenMiddleware.js';
import { bearerStrategy } from './authToken/strategy.js';

const SequelizeStore = CreateSequelizeStore(session.Store);

import { createRequestHandler } from '@react-router/express';

router.use();

router.use((req, res, next) => {
	/* If on *.pubpub.org domain, set cookie to be accessible across */
	/* all subdomains to maintain login. Especially important when */
	/* creating communities. */
	const hostname = req.headers.communityhostname || req.hostname;
	if (hostname.indexOf('.pubpub.org') > -1) {
		req.session.cookie.domain = '.pubpub.org';
	}
	next();
});

/* ------------------- */
/* Configure app login */
/* ------------------- */
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.use('zotero', zoteroAuthStrategy());
passport.use('bearer', bearerStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/* ---------------- */
/* Server Endpoints */
/* ---------------- */
if (process.env.NODE_ENV !== 'production') {
	// in development, set up vite dev server
	import('./viteDevMiddleware.js').then(({ setupViteDevServer }) => {
		setupViteDevServer(app).catch(console.error);
	});
} else {
	// in production, serve built assets
	router.use('/dist', [cors(), express.static(path.join(process.cwd(), 'dist/client'))]);
}

router.use('/static', express.static(path.join(process.cwd(), 'static')));
router.use(
	'/service-worker.js',
	express.static(path.join(process.cwd(), 'static/service-worker.js')),
);
router.use('/favicon.png', express.static(path.join(process.cwd(), 'static/favicon.png')));
router.use('/favicon.ico', express.static(path.join(process.cwd(), 'static/favicon.png')));

// extremely graceful iknow
process.on('uncaughtException', (err) => {
	// just to be sure, not every route is properly `wrap`ped
	if (err.name.includes('DatabaseRequestAbortedError')) {
		return;
	}

	throw err;
});

/** Same as Heroku's default timeout */
const TIMEOUT_MS = process.env.REQUEST_TIMEOUT_MS
	? parseInt(process.env.REQUEST_TIMEOUT_MS, 10)
	: 30_000;

router.use((req, res, next) => {
	// don't abort requests in test environment
	if (process.env.NODE_ENV === 'test') {
		return next();
	}

	const abortController = new AbortController();

	abortStorage.enterWith({ abortController });

	const abort = () => {
		const store = abortStorage.getStore();
		store?.abortController.abort();
	};

	const abortTimeout = setTimeout(abort, TIMEOUT_MS);

	// manually abort the request on close, that frees up connections more quickly if eg user closes the tab
	req.on('close', () => {
		// this is any close event, including us ending the request
		// there's no problem in calling it twice
		abort();
		// clean up
		clearTimeout(abortTimeout);
	});

	return next();
});

/* -------------------- */
/* Set Hostname for Dev */
/* -------------------- */
router.use((req, res, next) => {
	if (req.headers.communityhostname) {
		// @ts-expect-error
		req.headers.host = req.headers.communityhostname;
	}
	if (
		process.env.PUBPUB_LOCAL_COMMUNITY ||
		req.hostname.includes('localhost') ||
		req.hostname.includes('127.0.0.1')
	) {
		req.headers.localhost = req.headers.host;
		if (process.env.PUBPUB_LOCAL_COMMUNITY) {
			const subdomain = process.env.PUBPUB_LOCAL_COMMUNITY;
			req.headers.host = `${subdomain}.duqduq.org`;
		} else {
			req.headers.host = 'demo.pubpub.org';
		}
	}
	if (req.hostname.indexOf('duqduq.org') > -1) {
		req.headers.host = req.hostname.replace('duqduq.org', 'pubpub.org');
	}
	next();
});

router.use(authTokenMiddleware);

/** Set up purge middleware before api routes are initialized and after hostname is set */
router.use(purgeMiddleware(schedulePurge));

/* ------------------------- */
/* Create ts-rest api routes */
/* ------------------------- */
createExpressEndpoints(contract, server, app, {
	logInitialization: false,
	// eslint-disable-next-line consistent-return
	requestValidationErrorHandler: (err, req, res, next) => {
		if (!(err instanceof RequestValidationError)) {
			next(err);
		}
		const error = Object.values(err).find(Boolean);

		if (!error) {
			next(err);
		}
		const prettifiedError = fromZodError(error);

		if (process.env.NODE_ENV !== 'production') {
			console.error(prettifiedError);
		}

		return res.status(400).json({
			...prettifiedError,
			message: prettifiedError.message,
		});
	},
	jsonQuery: true,
});

/* ------------- */
/* Import Routes */
/* ------------- */
// require('./apiRoutes');
// require('./routes');

/* ------------- */
/* Error Handlers */
/* ------------- */
if (process.env.NODE_ENV === 'production') {
	// The Sentry error handler must be before any other error middleware
	// router.use(Sentry.Handlers.errorHandler());
}
router.use(errorHandler);
router.use(errorMiddleware);

/* ------------ */
/* Start Server */
/* ------------ */
const port = process.env.PORT || 9876;
export const startServer = () => {
	return app.listen(
		port,
		// @ts-expect-error
		(err) => {
			if (err) {
				console.error(err);
			}
			console.info(
				`==> Sequelize Max Connections:,
				${process.env.SEQUELIZE_MAX_CONNECTIONS ? parseInt(process.env.SEQUELIZE_MAX_CONNECTIONS, 10) : 5}`,
			);
			console.info('----\n==> 🌎  API is running on port %s', port);
			console.info('==> 💻  Send requests to http://localhost:%s', port);
		},
	);
};
