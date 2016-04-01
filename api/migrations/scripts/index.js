require('babel-core/register');
// exports.backupFirebase = require('./backupDatabases').backupFirebase;
require('./backupDatabases').backupFirebase({prod: true});
