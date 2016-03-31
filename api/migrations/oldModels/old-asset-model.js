var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var assetSchema = new Schema({
  refName: { type: String, required:true },

  assetType: { type: String},
  filetype: { type: String},
  originalFilename: { type: String},
  thumbnail: { type: String},
  url: { type: String},
  url_s3: { type: String},

  usedInDiscussion: { type: ObjectId, ref: 'oldPub' },
  usedInPub: { type: ObjectId, ref: 'oldPub' },
  owner: { type: ObjectId, ref: 'oldUser' },
  createDate: { type: Date },
});

assetSchema.statics.insertBulkAndReturnIDs = function (array, callback) {

	this.create(array, function(err, dbArray) {

		if (err) return callback(err);

		dbArray = dbArray || [];

		const dbArrayIds = [];
		dbArray.map((item)=>{
			dbArrayIds.push(item._id);
		});

		return callback(null, dbArrayIds);
	});
};

module.exports = mongoose.model('oldAsset', assetSchema, 'assets');
