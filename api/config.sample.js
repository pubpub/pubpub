/* ***********************
PubPub requires the use of several external services.
The goal is to reduce these dependencies, or at least use open-source alternatives.
But, we're still small, so until then - the following services are used and must be authenticated.

Copy the contents below and create a file named config.js (remove the .sample from the filename)
DO NOT store config.js in your git repo. It is currently git ignored, you should leave it that way for security purposes.
Keep config.js private to your development team.
*********************** */

// AWS Credentials
process.env.AWS_ACCESS_KEY_ID = '<YOUR-ACCESS-KEY-HERE>'; // S3 used for file storage
process.env.AWS_SECRET_ACCESS_KEY = '<YOUR-SECRET-KEY-HERE>';

// Mongo Credentials
process.env.MONGO_URI = '<YOUR-URI-HERE>'; // Can point to an external mongo hosting service, or your local instance

// Sendgrid Credentials
process.env.SENDGRID_API_KEY = '<YOUR-KEY-HERE>'; // Sendgrid used to send transactional emails

// URL for pubpub-collab server (https://github.com/pubpub/collab)
process.env.COLLAB_SERVER_URL = '<COLLAB-SERVER-URL>';

// secret shared by pubpub and collaboration server, this key needs to be the same on the collab server
process.env.COLLAB_ENCRYPT_SECRET = '<16 or 24 byte password>';

// Google API
process.env.GOOGLE_API_CLIENT_EMAIL = '<GOOGLE-API-EMAIL>';
process.env.GOOGLE_API_PRIVATE_KEY = '<GOOGLE-API-PRIVATE-KEY>';
