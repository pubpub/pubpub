var _         = require('underscore');
var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var discussionSchema = new Schema({
  author: { type: ObjectId, ref: 'User' },
  markdown: { type: String },
  assets: [{ type: ObjectId, ref: 'Asset'}], //Raw sources
  selections: [{ type: ObjectId, ref: 'Highlight'}], //Raw References
  references: [{ type: ObjectId, ref: 'Reference'}], //Raw References

  parent: { type: ObjectId, ref: 'Discussion' },
  children: [ { type: ObjectId, ref: 'Discussion' } ],

  pub: { type: ObjectId, ref: 'Pub' },
  version: { type: Number },
  sourceJournal: { type: ObjectId, ref: 'Journal' },
  postDate: { type: Date },

  archived: { type: Boolean },

  yays: [ { type: ObjectId, ref: 'User' } ],
  nays: [ { type: ObjectId, ref: 'User' } ],

});


module.exports = mongoose.model('oldDiscussion',discussionSchema, 'discussions');
