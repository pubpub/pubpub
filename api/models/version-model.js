var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var versionSchema = new Schema({
	title: { type: String },
	description: { type: String },
	abstract: { type: String },
	content: { type: String },
	type: { type: String },
	pub: { type: ObjectId, ref: 'Pub' },
	style: { type: String },
	styleColor: { type: String },
	// assets: [ { type: ObjectId, ref: 'Asset' } ],
	assetTree: { type: String },
	dataSetsObject: { type: String },
	dataAnalysesObject: { type: String },
	dataVisualizationsObject: { type: String },
	authorsUsers: [{
			_id: { type: ObjectId },
		username: { type: String },
		name: { type: String },
		image: { type: String }
	}],
	authorsGroups: [{
			_id: { type: ObjectId },
		uniqueName: { type: String },
		name: { type: String },
		image: { type: String }
	}],
	references: [{
				refName: { type: String},
				_id: { type: ObjectId},
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
			owner: { type: ObjectId, ref: 'User' },
			createDate: { type: Date },
			editDate: { type: Date }  }],
postDate: { type: Date }
})

module.exports = mongoose.model('Version', versionSchema);