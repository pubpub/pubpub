var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var referenceSchema = new Schema({
  refName: { type: String, required:true },
  // type: { type: String }, //Pub, Highlight, article, website, 
  title: { type: String },
  url: { type: String },
  author: { type: String },
  journal: { type: String },
  volume: { type: String },
  number: { type: String },
  pages: { type: String },
  date: { type: String },
  publisher: { type: String },
  note: { type: String },
  sourcePub: { type: ObjectId, ref: 'Pub' }, 
  version: { type: ObjectId, ref: 'Version' },
  sourceHighlight: { type: ObjectId, ref: 'Highlight' },

  clonedFromRef: { type: ObjectId, ref: 'Reference' },
  clonedFromPub: { type: ObjectId, ref: 'Pub' },

  usedInPubs: [{ type: ObjectId, ref: 'Pub' }],
  usedInReviews: [{ type: ObjectId, ref: 'Review' }],
  owner: { type: ObjectId, ref: 'User' },
  createDate: { type: Date },
  editDate: { type: Date }
})


referenceSchema.statics.updateOne = function (refName, updates,callback) {

  this.findOneAndUpdate({'refName':refName}, { $set: updates} )
  .exec(function (err, reference) {

      if (err) callback(err);
      callback(null,reference);

      if (err) return res.json(500);
      console.log(reference);
      res.status(201).json(reference);
    });
}

module.exports = mongoose.model('Reference', referenceSchema);
