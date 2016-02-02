var _         = require('underscore');
var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var discussionSchema = new Schema({
  author: { type: ObjectId, ref: 'User' },
  markdown: { type: String },
  assets: [{ type: ObjectId, ref: 'Asset'}], //Raw sources 
  selections: [{ type: ObjectId, ref: 'Highlight'}], //Raw References
  references: [{ type: ObjectId, ref: 'Reference'}], //Raw References
  
  parent: { type: ObjectId, ref: 'Discussion' },
  children: [ { type: ObjectId, ref: 'Discussion' } ],
  
  pub: { type: ObjectId, ref: 'Pub' },
  version: { type: Number },
  sourceJournal: { type: ObjectId, ref: 'Journal' },
  postDate: { type: Date },

  archived: { type: Boolean },

  yays: [ { type: ObjectId, ref: 'User' } ],
  nays: [ { type: ObjectId, ref: 'User' } ],
  
});



discussionSchema.statics.nestChildren = function (input) {

  // input = _.map(input,function(d) {return d.toObject() });
  input = _.map(input,function(d) {return d});

  input.forEach(function(d){
    
    d.children = _.filter(input,function(i){
      return (i.parent == d["_id"].toString()) 
    });
    return d;
  });

  const top_children = _.filter(input,function(d) {return !(d.parent)});
  return top_children;

};




discussionSchema.statics.appendUserYayNayFlag = function (input, userID) {
  // for each item, check if userID is in yays, add userYay = true, userNay = true
  // return discussions with items augmented with userYays and userNays
  input.forEach(function(item){

    if(item.yays.toString().indexOf(userID) > -1){
      item.userYay = true;
    }
    if(!item.userYay){ //If we found a Yay, there's not going to be a nay - so don't check
      if(item.nays.toString().indexOf(userID) > -1){
        item.userNay = true;
      }  
    }
  });

  return input;
  
}

discussionSchema.statics.calculateYayNayScore = function (input) {
  input.forEach(function(item){
    item.yays = item.yays.length;
    item.nays = item.nays.length;
    item.points = item.yays - item.nays;
  });
  return input
}

discussionSchema.statics.sortDiscussions = function (input) {
  _.sortRecursive = function (array, propertyName) {
      array.forEach(function (item) {
          var keys = _.keys(item);
          keys.forEach(function(key){
              if(_.isArray(item[key])){
                  item[key] = _.sortRecursive(item[key], propertyName);
              }
          });
      });
      return _.sortBy(array, propertyName).reverse();
  };
  var sortedInput = _.sortRecursive(input, 'points');
  return sortedInput;
}


module.exports = mongoose.model('Discussion',discussionSchema);


