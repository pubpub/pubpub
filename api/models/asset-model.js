var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var assetSchema = new Schema({
  assetName: { type: String, required:true },
  url: { type: String, required: true },
  
  usedInPubs: [{ type: ObjectId, ref: 'Pub' }],
  usedInVersions: [{ type: ObjectId, ref: 'Version' }],
  usedInReviews: [{ type: ObjectId, ref: 'Review' }],
  owner: { type: ObjectId, ref: 'User' },
  createDate: { type: Date },
  editDate: { type: Date }
})



module.exports = mongoose.model('Asset', assetSchema);
