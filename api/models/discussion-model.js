const _ = require('underscore');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const discussionSchema = new Schema({
	author: { type: ObjectId, ref: 'User' },
	markdown: { type: String },

	history: [{
		markdown: { type: String },
		datePosted: { type: Date },
		version: { type: Number },
	}],

	parent: { type: ObjectId, ref: 'Discussion' },
	children: [ { type: ObjectId, ref: 'Discussion' } ],

	pub: { type: ObjectId, ref: 'Pub' },
	version: { type: Number },
	sourceJournal: { type: ObjectId, ref: 'Journal' },

	createDate: { type: Date },
	lastUpdated: { type: Date },

	archived: { type: Boolean },
	deleted: {type: Boolean}, // We may enable people to delete their comment with n-minutes of posting. It wouldn't remove the object, but show [deleted] where the markdown was.
	private: {type: Boolean}, // Private comments can only be read be active collaborators.

	yays: [ { type: ObjectId, ref: 'User' } ],
	nays: [ { type: ObjectId, ref: 'User' } ],
});

discussionSchema.statics.removePrivateIfNeeded = function(input, isCollaborator) {
	if (isCollaborator) {return input;}

	return input.filter((item)=>{
		return !item.private;
	});
};

discussionSchema.statics.nestChildren = function(input) {

	const tempArray = _.map(input, function(index) {return index;});

	tempArray.forEach(function(index) {
		index.children = _.filter(tempArray, function(child) {
			return (child.parent && child.parent.toString() === index._id.toString());
		});
		return index;
	});

	const topChildren = _.filter(tempArray, function(index) {return !(index.parent);});
	return topChildren;

};


discussionSchema.statics.appendUserYayNayFlag = function(input, userID) {
	// for each item, check if userID is in yays, add userYay = true, userNay = true
	// return discussions with items augmented with userYays and userNays
	input.forEach(function(item) {

		if (item.yays.toString().indexOf(userID) > -1) {
			item.userYay = true;
		}
		if (!item.userYay) { // If we found a Yay, there's not going to be a nay - so don't check
			if (item.nays.toString().indexOf(userID) > -1) {
				item.userNay = true;
			}
		}
	});

	return input;

};

discussionSchema.statics.appendIsAuthor = function(input, userID) {
	// for each item, check if userID is same as authorID, add isAuthor = true,
	input.forEach(function(item) {

		if (userID && userID.toString() === item.author._id.toString()) {
			item.isAuthor = true;
		}
	});

	return input;

};

discussionSchema.statics.calculateYayNayScore = function(input) {
	input.forEach(function(item) {
		item.yays = item.yays.length;
		item.nays = item.nays.length;
		item.points = item.yays - item.nays;
	});
	return input;
};

discussionSchema.statics.sortDiscussions = function(input) {
	_.sortRecursive = function(array, propertyName) {
		array.forEach(function(item) {
			const keys = _.keys(item);
			keys.forEach(function(key) {
				if (_.isArray(item[key])) {
					item[key] = _.sortRecursive(item[key], propertyName);
				}
			});
		});
		return _.sortBy(array, propertyName).reverse();
	};
	const sortedInput = _.sortRecursive(input, 'points');
	return sortedInput;
};


module.exports = mongoose.model('Discussion', discussionSchema);
