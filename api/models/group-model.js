var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var groupSchema = new Schema({
  
  groupName: { type: String },
  groupSlug: { type: String, required: true, index: { unique: true } },
  description: { type: String },
  
  pubs: [ { type: ObjectId, ref: 'Pub' } ],
  
  admins: [ { type: ObjectId, ref: 'User' } ],
  members: [ { type: ObjectId, ref: 'User' } ],
  
  createDate: { type: Date },

  
});

module.exports = mongoose.model('Group', groupSchema);
