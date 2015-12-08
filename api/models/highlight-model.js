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
