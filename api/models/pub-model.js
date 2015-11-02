var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var pubSchema = new Schema({
  displayTitle: { type: String },
  uniqueTitle: { type: String, required: true, index: { unique: true } },
  collaboratorsUsers: {authors:[{ type: ObjectId, ref: 'User'}], readers:[{ type: ObjectId, ref: 'User'}] },
  collaboratorsGroups: {authors:[{ type: ObjectId, ref: 'Group'}], readers:[{ type: ObjectId, ref: 'Group'}] },
  groups: [ { type: ObjectId, ref: 'Group' } ],
  discussions: [ { type: ObjectId, ref: 'Discussion' } ],
  relatedpubs: [ { type: ObjectId, ref: 'Relatedpub' } ],
  externals: [ { type: ObjectId, ref: 'External' } ],
  highlights: [ { type: ObjectId, ref: 'Highlight' } ],
  references: [ { type: ObjectId, ref: 'Reference' } ],
  reviews: [ { type: ObjectId, ref: 'Review' } ],
  image: { type: String },
  draft:{
    abstract: { type: String },
    content: { type: String },
    lastEditDate: { type: Date },
    style: { type: String },
    styleColor: { type: String },
    refStyle: { type: String },
    assets: [ { type: ObjectId, ref: 'Asset' } ]
  },
  settings:{
    isPrivate: { type: Boolean },
  },
  versions: [ { type: ObjectId, ref: 'Version' } ],
  dataSets: [ { type: ObjectId, ref: 'DataSet' } ],
  dataAnalyses: [ { type: ObjectId, ref: 'DataAnalysis' } ],
  dataVisualizations: [ { type: ObjectId, ref: 'DataVisualization' } ],
  // ToDo -create 'lastPublishDate' - which is updated everytime a new version is published
  lastPublishDate: { type: Date },
  createDate: { type: Date },

  featuredInJournalsList: [{ type: ObjectId, ref: 'Journal' }],
  featuredInJournalsObject: [{
    journal: { type: ObjectId, ref: 'Journal' },
    acceptedDate: { type: Date },
    acceptedBy: { type: ObjectId, ref: 'User' },
    acceptanceNote: { type: String },
  }],
  submittedToJournalsList: [{ type: ObjectId, ref: 'Journal' }],
  submittedToJournalsObject: [{
    journal: { type: ObjectId, ref: 'Journal' },
    submittedDate: { type: Date },
    submittedBy: { type: ObjectId, ref: 'User' },
    submissionNote: { type: String },
  }],
  approvedPeers: [{ type: ObjectId, ref: 'User'}],
})


pubSchema.statics.isUnique = function (uniqueTitle,callback) {

  this.findOne({'uniqueTitle':uniqueTitle})
  .exec(function (err, pub) {
      if (err) callback(err);
      // if (err) return res.json(500);

      if(pub!=null){ //We found a pub
        callback(null,false);  //False - is not unique
      }else{ //We did not find a pub
        callback(null,true) //True -  is unique.
      }
    });
}


module.exports = mongoose.model('Pub', pubSchema);