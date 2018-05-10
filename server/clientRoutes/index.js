require('./redirects');			// Redirect needed v3 routes;

/* Routes for PubPub */
require('./communityCreate');	// Route: '/community/create'
require('./explore');			// Route: '/explore'
require('./about');				// Route: '/about'
require('./pubRedirect');		// Route: '/pub/:slug'
require('./landing');			// Route: '/'

/* Routes for Communities */
require('./dashboard');			// Route: ['/dashboard', '/dashboard/:slug', '/dashboard/:slug/:mode']
require('./notifications');		// Route: '/notifications'
require('./pubCreate');			// Route: '/pub/create'
require('./pubCollaboration');	// Route: '/pub/:slug/collaborate'
require('./pubPresentation');	// Route: ['/pub/:slug', '/pub/:slug/:mode', '/pub/:slug/:mode/:subMode']
require('./collection'); 		// Route: ['/', '/:slug']
require('./collectionSubmit'); 	// Route: ['/:slug/submit', '/:slug/submit/:hash']

/* Routes for all */
require('./login'); 			// Route: '/login'
require('./privacy'); 			// Route: '/privacy'
require('./search'); 			// Route: '/search'
require('./signup'); 			// Route: '/signup'
require('./terms'); 			// Route: '/tos'
require('./passwordReset'); 	// Route: ['/password-reset', '/password-reset/:resetHash/:slug']
require('./userCreate'); 		// Route: '/user/create/:hash'
require('./user'); 				// Route: ['/user/:slug', '/user/:slug/:mode']
require('./noMatch');			// Route: '/*'
