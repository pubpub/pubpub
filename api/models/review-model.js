var _         = require('underscore');
var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var reviewSchema = new Schema({
  pub: { type: ObjectId, ref: 'Pub' },
  version: { type: ObjectId, ref: 'Version' },
  versionLabel: { type: Number },
  createDate: { type: Date },
  postDate: { type: Date },
  author: { type: ObjectId, ref: 'User' },
  content: { type: String },
  firepadRef: { type: String },


  comments: [ { type: ObjectId, ref: 'Discussion' } ],
  yays: [ { type: ObjectId, ref: 'User' } ],
  nays: [ { type: ObjectId, ref: 'User' } ],
  references: [ { type: ObjectId, ref: 'Reference' } ],
  assets: [ { type: ObjectId, ref: 'Asset' } ],
  selections: [{ type: ObjectId, ref: 'Highlight' }],

  parent: { type: ObjectId, ref: 'Asset' }, // It is either a parent with responses, or a child with parentID specified. Children don't have responses. Reviews are linear - not nested
  responses: [{ type: ObjectId, ref: 'Asset' }],
  approvedAsPeer: { type: Boolean },
  reviewScores: { type: Schema.Types.Mixed },
});




reviewSchema.statics.populateReviews = function (reviewsArray) {
  // Populate data
  // If unposted, only return if author == user._id
  return reviewsArray
}


module.exports = mongoose.model('Review',reviewSchema);


