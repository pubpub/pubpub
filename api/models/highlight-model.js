var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var highlightSchema = new Schema({
  selection: {
  	text:{ type: String }, 
  	serializedSelection:{ type: String }
  },
  review: { type: ObjectId, ref: 'Review' },
  pub: { type: ObjectId, ref: 'Pub' },
  version: { type: ObjectId, ref: 'Version' },
  user: { type: ObjectId, ref: 'User' },
  postDate: { type: Date },
  selectionNumber:{ type: Number } //For Review selections 
});

module.exports = mongoose.model('Highlight',highlightSchema);