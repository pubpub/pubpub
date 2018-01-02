/* Routes for PubPub */
require('./communityCreate');	// Route: '/community/create'
require('./explore');			// Route: '/explore'

/* Routes for Communities */
require('./dashboard');			// Route: ['/dashboard', '/dashboard/:slug', '/dashboard/:slug/:mode']
require('./pubPresentation');	// Route: '/pub/:slug'
require('./collection'); 		// Route: ['/', '/:slug']
require('./collectionSubmit'); 	// Route: ['/:slug/submit', '/:slug/submit/:hash']

/* Routes for all */
require('./login'); 			// Route: '/login'
require('./noMatch');			// Route: '/*'
