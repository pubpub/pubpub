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
			if (err) callback(err);
			// if (err) return res.json(500);

			if(pub!=null){ //We found a pub
				callback(null,false);  //False - is not unique
			}else{ //We did not find a pub
				callback(null,true) //True -  is unique.
			}
		});
};

pubSchema.statics.getPub = function (slug, readerID, callback) {
	this.findOne({slug: slug}).exec((err, pub) =>{
		if (err) { callback(err, null); }

		if (!pub) { callback(null, 'Pub Not Found'); }

		// Check user for access /callback(null, 'Private Pub');
		// Populate pub here
		callback(null, pub);
	})
};

pubSchema.statics.getPubEdit = function (slug, readerID, callback) {
	// Populate documents
};

pubSchema.statics.createPub = function (title, slug, readerID, callback) {
	// Populate documents
	this.isUnique(slug, function(err, result){
      if(!result){
        return res.status(500).json('URL Title is not Unique!');
      }

      const pub = new this({
          displayTitle: req.body.displayTitle,
          uniqueTitle: req.body.uniqueTitle,
          image: req.body.image,
          settings: {'isPrivate':false},
          draft: {
            abstract: "Click the button in the top-right to toggle Edit/Preview Mode",
            content: "^^title{New Pub Draft}\n\n^^abstract{Here's your new pub. Edit text on the left, and view it on the right. Saving is automatic. No need to worry :)}\n\n#Your New Pub!\nWelcome to your new pub. The following text provides you with some starter content to see how Pubs are written. LaTeX and WSYWIG support coming soon!\n\n#Styling\n\n# Header1\n## Header2\n### Header3\n\nYou can add super cool links like this [Super Sweet Link](http://www.google.com/search?q=smiling+puppy&tbm=isch) \n\nAdd emphasis something _super_ important.\n\n#References\nAdd References to the right and cite them using the Cite Tag! ^^cite{refNameGoesHere}\n\n#Lists go like this\n\n* My\n* List\n* Items\n\n-- or like this --\n\n1. My \n2. List\n3. Items\n\n\n\n\n#Insert page Breaks:\n^^pagebreak\n\n#Images\n##We can do in-column and full-width images\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Duis sollicitudin libero et ante vestibulum euismod. Curabitur consequat arcu eu lacus condimentum laoreet. Etiam a ligula ac orci dictum fermentum vel in ligula. Vivamus gravida tempus leo, vitae tempus lectus vehicula et. Donec accumsan massa at elit tristique, quis aliquam nibh efficitur. Integer purus urna, luctus sed sagittis nec, ultrices semper lorem. Sed in porttitor eros.\n\n ![Some Steamboat Guy](http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg) \n\nMauris ut sollicitudin risus. In hac habitasse platea dictumst. Pellentesque eget velit eu elit egestas fermentum vitae eget urna. Duis dictum lacinia mauris in interdum. Aliquam porttitor ultricies diam eu pharetra. Vestibulum ornare tellus in facilisis venenatis. In sed ligula id purus pellentesque suscipit ut eu neque. Nam efficitur ultricies lacus laoreet porttitor. Phasellus rutrum bibendum sem, at laoreet nunc congue at. Cras efficitur urna eu orci lobortis tincidunt. Etiam pellentesque efficitur neque, ut finibus quam interdum sed.\n\n ![Smooth](http://i.imgur.com/7FJzLNd.gif) \nProin porttitor, quam ac sagittis aliquam, purus turpis sodales sapien, sed luctus lorem diam a magna. Vivamus ornare rutrum risus, et malesuada odio viverra ac. Phasellus volutpat eget nulla gravida accumsan. Praesent ac interdum purus. Donec arcu metus, placerat at turpis tempus, mattis lobortis velit. Proin tristique odio vel nibh gravida eleifend a eu risus. Donec sit amet lectus nibh. Vivamus blandit ultricies tempus. Sed tincidunt quis lectus placerat vestibulum. Aenean eget tortor aliquet, elementum ligula quis, congue leo. Nam ultricies, mi eget egestas efficitur, sapien enim tempus metus, sit amet iaculis dolor tortor non ipsum. Praesent ipsum nisl, fermentum sit amet bibendum id, fringilla at justo.\n\n\n<div class=\"full-width\"> <img src=\"http://upload.wikimedia.org/wikipedia/en/4/4e/Steamboat-willie.jpg\" alt-text=\"Some Steamboat Guy Again\"/> <\/div>\n\n^^pagebreak\n\n#Inline Visualizations\nYou can embed your own visualizations! At PUBPUB's current state you must host the project yourself and embed an iframe. Come to us if you need help with that (pubpub@media.mit.edu). We'll be making that process smoother in the coming weeks.",
            style:'One-Column',  
            styleColor:'Grey', 
            refStyle:'MLA', 
            assets:{},
            lastEditDate: new Date().getTime()
          }
        });
      pub.collaboratorsUsers.authors.push(req.user['_id']);


  

      pub.createDate = new Date().getTime();
      // console.log(pub);

      pub.save(function (err, pub) {
          if (err) { return next(err) }
            var pubID = pub.id;
            var userID = req.user['_id'];

            User.update({ _id: userID }, { $addToSet: { pubs: pubID} }, function(err, result){if(err) return handleError(err)});
            return res.status(201).json(pub);
      })

    });
	callback(null, slug);
};

module.exports = mongoose.model('Pub', pubSchema);
