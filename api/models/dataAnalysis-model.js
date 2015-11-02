var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var dataAnalysisSchema = new Schema({
  analysisName: { type: String },
  analysisNumber:{ type: Number },
  parentDataSet: { type: ObjectId, ref: 'DataSet' },
  // filters and parameters are the raw data for the frontend
  // queryFilters and queryParameters are formatted to be directly plugged into a mongo search
  filters: { type: String },
  parameters: { type: String },
  queryFilters: { type: String },
  queryParameters: { type: String },

  // Analysis performed somehow documents what operations were performed
  // on the result of the query to clean the data into its final form
  analysis: { type: String },
  

  createPub: { type: ObjectId, ref: 'Pub' },
  createDate: { type: Date },
  editDate: { type: Date },
  createUser: { type: ObjectId, ref: 'User' },
  editUsers: [{ type: ObjectId, ref: 'User' }],
  usedInPubs: [{ type: ObjectId, ref: 'Pub' }],
  usedByVisualizations: [{ type: ObjectId, ref: 'DataVizualization' }]

});

module.exports = mongoose.model('DataAnalysis', dataAnalysisSchema);