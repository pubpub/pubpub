/* ***********************
PubPub requires the use of several external services.
The goal is to reduce these dependencies, or at least use open-source alternatives.
But, we're still small, so until then - the following services are used and must be authenticated.

Copy the contents below and create a file named config.js (remove the .sample from the filename)
DO NOT store config.js in your git repo. It is currently git ignored, you should leave it that way for security purposes.
Keep config.js private to your development team.
*********************** */

// AWS Credentials
export const accessKeyAws = '<YOUR-ACCESS-KEY-HERE>'; // S3 used for file storage
export const secretKeyAws = '<YOUR-SECRET-KEY-HERE>';

// Firebase Credentials
export const firebaseSecret = '<YOUR-SECRET-HERE>'; // Firebase used for synchronizing collaborative editing

// Heroku Credentials
export const herokuApiKey = '<YOUR-KEY-HERE>'; // Heroku used to host and serve the project

// Mongo Credentials
export const mongoURI = '<YOUR-URI-HERE>'; // Can point to an external mongo hosting service, or your local instance

// Sendgrid Credentials
export const sendgridAPIKey = '<YOUR-KEY-HERE>'; // Sendgrid used to send transactional emails
export const captchaKey = '<YOUR-KEY-HERE>';
