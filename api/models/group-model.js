var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var groupSchema = new Schema({
  name: { type: String },
  uniqueName: { type: String, required: true, index: { unique: true } },
  pubs: [ { type: ObjectId, ref: 'Pub' } ],
  image: { type: String },
  users:[{ type: ObjectId, ref: 'User'}],
  admins:[{ type: ObjectId, ref: 'User'}],
  createDate: { type: Date }
})


groupSchema.statics.isUnique = function (uniqueName,callback) {

  this.findOne({'uniqueName':uniqueName})
  .exec(function (err, group) {
      if (err) callback(err);
      // if (err) return res.json(500);

      if(group!=null){ //We found a group
        callback(null,false);  //False - is not unique
      }else{ //We did not find a group
        callback(null,true) //True -  is unique.
      }
    });
}


module.exports = mongoose.model('Group', groupSchema);