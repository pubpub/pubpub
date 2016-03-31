var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var highlightSchema = new Schema({

  author: { type: ObjectId, ref: 'User' },
  text: {type: String},
  context: {type: String},
  ancestorHash: {type: String},

  endContainerPath: {type: String},
  endOffset: {type: String},
  startContainerPath: {type: String},
  startOffset: {type: String},

  pub: { type: ObjectId, ref: 'Pub' },
  version: {type: String},

  postDate: {type: String},
  index: {type: Number},
  usedInDiscussion: {type: Boolean},

});

module.exports = mongoose.model('oldHighlight',highlightSchema,'highlights');
