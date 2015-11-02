var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var externalSchema = new Schema({
  title: { type: String },
  url: { type: String },
  author: { type: ObjectId, ref: 'User' },
  pub: { type: ObjectId, ref: 'Pub' },
  postDate: { type: Date }
})

module.exports = mongoose.model('External', externalSchema);