/* Routes for PubPub */
require('./communityCreate');	// Route: /community/create

/* Routes for Communities */
require('./pubPresentation');	// Route: /pub/:slug
require('./collection'); 		// Route: / and /:slug
require('./collectionSubmit'); 	// Route: /:slug/submit and /:slug/submit/:hash

/* Routes for all */
require('./login'); 			// Route: /login
require('./noMatch');			// Route: /*
