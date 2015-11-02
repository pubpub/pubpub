var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var dataVisualizationSchema = new Schema({
  visualizationName: {type: String},
  visualizationNumber:{ type: Number },
  parentDataAnalysis: { type: ObjectId, ref: 'DataAnalysis' },
  parentDataAnalysisQueryFilters: {type: String},// These are so that if the parent analysis changes, the visualization is still archived
  parentDataAnalysisQueryParameters: {type: String},
  
  // For now, we assume type is one of select presets. 
  // Eventually, they'll likely be able to write their own viz code, which
  // we will store instead of type
  type: { type: String },
  typeName: { type: String },
  inputDimensions: { type: String }, //stringify'd JSON matching dimensions to analysis parameters

  //stringify'd JSON for customization options. 
  // We could eventualy build this out to be more explicit 
  // once we know all customization parameters
  customizations: { type: String },

  // URL to s3 image stored as a 'thumbnail' of what the result is. 
  // Usually, we'll be live rendering the result - 
  // but the image could be useful for editing, slow browsers, etc
  resultImage: { type: String },

  // data: { type: String }, 
  createPub: { type: ObjectId, ref: 'Pub' },
  createDate: { type: Date },
  editDate: { type: Date },
  createUser: { type: ObjectId, ref: 'User' },
  editUsers: [{ type: ObjectId, ref: 'User' }],



  

});

module.exports = mongoose.model('DataVisualization', dataVisualizationSchema);