// When created, references are stored as their own document (with this schema).
// They are also stored in the user's object under the 'References' field. 
// All owners of a reference have the reference stored in their backend document.
// This allows us to display them in aggregate as a user navigates around the
// site, or from their profile page.

// References can be updated - each update stores all parts of the document needed
// to trace history.

// When used in pubs or discussions, the reference is inlined into markdown with 
// its _id, and the version used.
// All data necessary to render the reference is included in text within the plugin when used.
// This allows the reference to be rendered without querying any of the reference documents.
// We query for the reference when deeper information (such as viewing versions, editing, etc)
// is needed.

// When a discussion or pub is submitted/published, we look at all the references used
// and update those reference documents to mark which discussion or pub it was used in. For this
// we store both discussion/pub _id and the version.

// When as reference is cloned, a new reference is created with a blank history.
// The parent field marks the _id and version of the reference from which it was cloned.
// The root field marks the _id of the furthest ancestor. This is used as a querying tool, so
// that finding the full lineage of an reference can simply query for all docs with the same root.

const mongoose  = require('mongoose');
const Schema    =  mongoose.Schema;
const ObjectId  = Schema.Types.ObjectId;

const referenceSchema = new Schema({
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

  history: [{
    updateDate: { type: Date },
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
  }],

  usedInDiscussions: [{
    id: { type: ObjectId, ref: 'Discussion' },
    version: { type: Number },
  }],
  usedInPubs: [{
    id: { type: ObjectId, ref: 'Pub' },
    version: { type: Number },
  }],

  parent: { // If cloned from a refence, this field stores which refence doc, and which version
    id: { type: ObjectId, ref: 'Reference' },
    version: { type: Number },
  },
  root: { type: ObjectId, ref: 'Reference' }, // Furthest ancestor - used as a query tool to grab entire lineage

  owner: { type: ObjectId, ref: 'User' },
  
  createDate: { type: Date },
  lastUpdated: { type: Date },
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
