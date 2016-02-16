module.exports = {};

// The following is used in the static functions of other models. 
// They thus then need to be declared first. This is a bit wonky. We probably
// just shouldn't be relying on cross dependencies in model static functions.. duh
module.exports.Discussion = require('./models/discussion-model');

module.exports.Asset = require('./models/asset-model');
module.exports.Group = require('./models/group-model');
module.exports.Highlight = require('./models/highlight-model');
module.exports.Journal = require('./models/journal-model');
module.exports.Notification = require('./models/notification-model');
module.exports.Pub = require('./models/pub-model');
module.exports.Reference = require('./models/reference-model');
module.exports.User = require('./models/user-model');
