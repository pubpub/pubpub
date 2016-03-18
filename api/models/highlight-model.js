var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var highlightSchema = new Schema({

  owner: { type: ObjectId, ref: 'User' },
  text: {type: String},
  context: {type: String},
  ancestorHash: {type: String},
  
  endContainerPath: {type: String},
  endOffset: {type: String},
  startContainerPath: {type: String},
  startOffset: {type: String},
  
  pub: { type: ObjectId, ref: 'Pub' },
  version: {type: Number},
  
  usedInDiscussions: [{
    id: { type: ObjectId, ref: 'Discussion' },
    version: { type: Number },
  }],
  usedInPubs: [{
    id: { type: ObjectId, ref: 'Pub' },
    version: { type: Number },
  }],

  createDate: { type: Date },

});

highlightSchema.statics.insertBulkAndReturnIDs = function (array, callback) {

  this.create(array, function(err, dbArray){
    
    if (err) return callback(err);

    dbArray = dbArray || [];
    
    const dbArrayIds = [];
    dbArray.map((item)=>{
      dbArrayIds.push(item._id);
    });

    return callback(null, dbArrayIds);
  });
};


module.exports = mongoose.model('Highlight',highlightSchema);
