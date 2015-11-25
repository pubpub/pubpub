var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var pubSchema = new Schema({
	slug: { type: String, required: true, index: { unique: true } },
	
	// --------------
	// --------------
	// The Items in this block are fozen at publish time.
	// All changes that are made pre-update-publish are stored and synced to firebase.
	// Their change has no reflection in the variables stored here.
	// This is to ensure that non-published updates don't leak into the Reader
	title: { type: String },
	abstract: { type: String },
	authorsNote: { type: String },
	markdown: { type: String }, //Preprocessed with comments describing all plugin options
	authors: [{ type: ObjectId, ref: 'User'}],
	plugins: [{ type: ObjectId, ref: 'User'}], // Takes raw sources and sets options for rendering them
	assets: [{ type: ObjectId, ref: 'Asset'}], //Raw sources 
	style: { type: Schema.Types.Mixed },
	lastUpdated: { type: Date },
	status: { type: String },
	// --------------
	// --------------

	// A duplicate cache of the parameters as defined in the editor. 
	// Also stored here so that we can privelege access to the editor 
	// and to private pubs
	collaborators: {
		canEdit:[{ type: ObjectId, ref: 'User'}], 
		canRead:[{ type: ObjectId, ref: 'User'}] 
	},
	
	createDate: { type: Date },
	htmlCache: { type: String }, // Do we want to cache the html render? It might not be any faster...
	
	history: [{ //History is appended to each time a 'publish' is made.
		publishNote: { type: String },
		publishDate: { type: Date },
		publishAuthor: { type: ObjectId, ref: 'User'},
		diffToLastPublish: { type: String }, 
		firepadVersionNumber: { type: Number }, 
		
		// The following should be enough to entirely reproduce the document
		title: { type: String },
		abstract: { type: String },
		authorsNote: { type: String },
		markdown: { type: String }, //Preprocessed with comments describing all plugin options
		authors: [{ type: ObjectId, ref: 'User'}],
		plugins: [{ type: ObjectId, ref: 'User'}], // Takes raw sources and sets options for rendering them
		assets: [{ type: ObjectId, ref: 'Asset'}], //Raw sources 
		style: { type: Schema.Types.Mixed },
		status: { type: String },
	}],

	followers: [{ type: ObjectId, ref: 'User'}],
	
	settings:{
		pubPrivacy: { type: String },
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

		if (pub.status === 'Unpublished') { return callback(null, 'Pub not yet published'); }

		// Check if the pub is private, and if so, check readers/authors list
		if (pub.settings.isPrivate) { 
			if (pub.collaborators.canEdit.indexOf(readerID) === -1 && pub.collaborators.canRead.indexOf(readerID) === -1) {
				return callback(null, 'Private Pub');
			}
		}
		
		return callback(null, pub);
	})
};

pubSchema.statics.getPubEdit = function (slug, readerID, callback) {
	// Get the pub and check to make sure user is authorized to edit
	this.findOne({slug: slug}).exec((err, pub) =>{
		if (err) { return callback(err, null); }

		if (!pub) { return callback(null, 'Pub Not Found'); }

		if (pub.collaborators.canEdit.indexOf(readerID) === -1) {
			return callback(null, 'Not Authorized');
		}

		// Once authorized, it doesn't seem like we need to provide any data to the editor
		// That will likely change when we implement better authentication for the firepad
		// This will chance when we have to pass down status to the editor. Once you publish peer-review-ready
		// You can go and publish draft...
		return callback(null, {});

	});
	
};

module.exports = mongoose.model('Pub', pubSchema);
