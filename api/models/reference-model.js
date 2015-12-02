var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var referenceSchema = new Schema({
  refName: { type: String, required:true },
  
  title: { type: String },
  url: { type: String },
  author: { type: String },
  journal: { type: String },
  volume: { type: String },
  number: { type: String },
  pages: { type: String },
  year: { type: String },
  publisher: { type: String },
  note: { type: String },

  usedInDiscussion: { type: ObjectId, ref: 'Pub' },
  usedInPub: { type: ObjectId, ref: 'Pub' },
  owner: { type: ObjectId, ref: 'User' },
  createDate: { type: Date },
});

referenceSchema.statics.insertBulkAndReturnIDs = function (array, callback) {

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

module.exports = mongoose.model('Reference', referenceSchema);
