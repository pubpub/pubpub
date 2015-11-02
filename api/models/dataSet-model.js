var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var dataSetSchema = new Schema({
  datasetName: { type: String },
  datasetFileURL: { type: String }, 
  createDate: { type: Date },
  createUser: { type: ObjectId, ref: 'User' },
  createPub: { type: ObjectId, ref: 'Pub' },
  usedInPubs: [{ type: ObjectId, ref: 'Pub' }],
  usedByAnalyses: [{ type: ObjectId, ref: 'DataAnalysis' }],
  

});

module.exports = mongoose.model('DataSet', dataSetSchema);








// Two models. 


// One for the dataset
// Includes the datasetName, and features of the dataset
// All necessary details to query the data_db and get access to it



// One for the data-based Analysis and figure 
// Stores query parameters
// visualization parameters
// thumbnail of visualization
// analysis performed on visualization
// output, cleaned dataset
// create date 
// author
// dataset parent