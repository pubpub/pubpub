require('./communityCreate');	// Route: /community/create (pubpub-only)
require('./login'); 			// Route: /login
require('./pub'); 				// Route: /pub/:slug
require('./collection'); 		// Route: / and /:slug
require('./collectionSubmit'); 	// Route: /:slug/submit and /:slug/submit/:hash
require('./noMatch');			// Route: /*
