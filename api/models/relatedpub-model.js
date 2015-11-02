var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var relatedpubSchema = new Schema({
  content: { type: String },
  author: { type: ObjectId, ref: 'User' },
  pub: { type: ObjectId, ref: 'Pub' },
  postDate: { type: Date }
})

module.exports = mongoose.model('Relatedpub', relatedpubSchema);