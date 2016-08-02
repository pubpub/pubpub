// var app = require('./api');
// app.all('/*', function(req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "http://pub.media.mit.edu");
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

require('./routes/analytics-routes');
require('./routes/app-routes');
require('./routes/atom-routes');
require('./routes/autocomplete-routes');
// require('./routes/group-routes');
require('./routes/journal-routes');
require('./routes/login-routes');
require('./routes/link-routes');
require('./routes/s3-upload-policy');
require('./routes/settings-routes');
require('./routes/signup-routes');
require('./routes/email-verification-routes');
require('./routes/tag-routes');
require('./routes/user-routes');
require('./routes/version-routes');
