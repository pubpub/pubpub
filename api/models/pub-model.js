var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var pubSchema = new Schema({
	slug: { type: String, required: true, index: { unique: true } },
	
	title: { type: String },
	abstract: { type: String },
	authorsNote: { type: String },
	markdown: { type: String },
	
	collaborators: {
		authors:[{ type: ObjectId, ref: 'User'}], 
		readers:[{ type: ObjectId, ref: 'User'}] 
	},
	assets: [{ type: ObjectId, ref: 'Asset'}], 
	style: { type: Schema.Types.Mixed },

	lastUpdated: { type: Date },
	createDate: { type: Date },

	status: { type: String },
	htmlCache: { type: String }, // Do we want to cache the html render? It might not be any faster...
	
	history: [{ //History is appended to each time a 'publish' is made.
		note: { type: String },
		publishDate: { type: Date },
		publishAuthor: { type: ObjectId, ref: 'User'},
		publishStatus:  { type: String },
		diffToLastPublish: { type: String }, 
		
		// The following should be enough to entirely reproduce the document
		title: { type: String },
		abstract: { type: String },
		authorsNote: { type: String },
		markdown: { type: String }, // We could store just the diff and calculate? Is there any harm in storing the markdown too?
		collaborators: {
			authors:[{ type: ObjectId, ref: 'User'}], 
			readers:[{ type: ObjectId, ref: 'User'}] 
		},
		assets: [{ type: ObjectId, ref: 'Asset'}],
		style: { type: Schema.Types.Mixed },
	}],

	followers: [{ type: ObjectId, ref: 'User'}],
	
	settings:{
		isPrivate: { type: Boolean },
	},

	featuredIn: [{
		journal: { type: ObjectId, ref: 'Journal' },
		acceptedDate: { type: Date },
		acceptedBy: { type: ObjectId, ref: 'User' },
		acceptedNote: { type: String },
	}],
	submittedTo: [{
		journal: { type: ObjectId, ref: 'Journal' },
		submissionDate: { type: Date },
		submissionBy: { type: ObjectId, ref: 'User' },
		submissionNote: { type: String },
	}],

	reviews: [{
		doneWell: [{ type: String }],
		needsWork: [{ type: String }],
		reviewer: { type: ObjectId, ref: 'User' },
		// weightLocal: 245, // dynamically calculated based on yays/nays on pub comments
		// weightGlobal: 1230 // Snapshot of reputation at moment of review. static
	}],

	discussions: [ { type: ObjectId, ref: 'Discussion' } ],
	experts: {
		approved: [{
			// When approved, experts are notified
			// If they have not participated in the paper,
			// their name does not appear in the list
			// We can sort 'invited' experts by those that
			// have been made an expert, but haven't participated.
			expert: { type: ObjectId, ref: 'User' },
			approvedBy: { type: ObjectId, ref: 'User' },
			approvedDate: { type: Date },
		}],
		suggested: [{
			suggestedExpert: { type: ObjectId, ref: 'User' },
			votes: [{ type: ObjectId, ref: 'User' }],
			submitter: { type: ObjectId, ref: 'User' },
			submitDate: { type: Date },
		}]
	},

	analytics: { //Do we cache these every so often? Or calculate them dynamically?
		views: [{ type: String }],
		citations: [{ type: ObjectId, ref: 'Asset' }], // A list of the refernce assets that cite it?
		inTheNews: [{ type: String }],
	},

	readNext: [{ type: ObjectId, ref: 'Pub' }], //Do we cache these every so often? Or calculate them dynamically?
})


pubSchema.statics.isUnique = function (slug,callback) {

	this.findOne({'slug':slug})
	.exec(function (err, pub) {
			if (err) return callback(err);
			// if (err) return res.json(500);

			if(pub!=null){ //We found a pub
				return callback(null,false);  //False - is not unique
			}else{ //We did not find a pub
				return callback(null,true) //True -  is unique.
			}
		});
};

pubSchema.statics.getPub = function (slug, readerID, callback) {
	this.findOne({slug: slug}).exec((err, pub) =>{
		if (err) { return callback(err, null); }

		if (!pub) { return callback(null, 'Pub Not Found'); }

		// Check user for access /callback(null, 'Private Pub');
		// Populate pub here
		return callback(null, pub);
	})
};

pubSchema.statics.getPubEdit = function (slug, readerID, callback) {
	// Populate documents
};

module.exports = mongoose.model('Pub', pubSchema);
