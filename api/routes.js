var app = require('./api');

// app.all('/*', function(req, res, next) {
//   // res.header("Access-Control-Allow-Origin", "http://pub.media.mit.edu");
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
// });

require('./routes/autocomplete-routes');
require('./routes/discussion-routes');
require('./routes/group-routes');
require('./routes/journal-routes');
require('./routes/login-routes');
require('./routes/pub-routes');
require('./routes/user-routes');
require('./routes/test-routes');
require('./routes/math-routes');
require('./routes/s3-upload-policy');
