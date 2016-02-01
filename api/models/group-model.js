var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var groupSchema = new Schema({
  
  groupName: { type: String },
  groupSlug: { type: String, required: true, index: { unique: true } },
  description: { type: String },
  
  pubs: [ { type: ObjectId, ref: 'Pub' } ],
  
  background: { type: String },
  
  admins: [ { type: ObjectId, ref: 'User' } ],
  members: [ { type: ObjectId, ref: 'User' } ],
  
  createDate: { type: Date },

  
});

groupSchema.statics.isUnique = function (slug,callback) {

  this.findOne({'groupSlug':slug})
  .exec(function (err, group) {
      if (err) return callback(err);
      // if (err) return res.json(500);

      if(group!=null){ //We found a group
        return callback(null,false);  //False - is not unique
      }else{ //We did not find a pub
        return callback(null,true) //True -  is unique.
      }
    });
};

groupSchema.statics.getGroup = function (groupSlug, readerID, callback) {
  this.findOne({groupSlug: groupSlug})
  .populate({path: "members", select:'name firstName lastName username thumbnail'})
  .populate({path: "admins", select:'name firstName lastName username thumbnail'})
  .populate({
    path: "pubs", 
    select:"title abstract slug collaborators settings discussions editorComments lastUpdated",
    populate: [{
      path: 'authors',
      model: 'User',
      select: 'name firstName lastName username thumbnail',
    },
    {
      path: 'collaborators.canEdit',
      model: 'User',
      select: 'name firstName lastName username thumbnail',
    },
    {
      path: 'discussions',
      model: 'Discussion',
      select: 'markdown author postDate',
      populate: {
        path: 'author',
        model: 'User',
        select: 'name firstName lastName username thumbnail',
      },
    },
    {
      path: 'editorComments',
      model: 'Discussion',
      select: 'markdown author postDate',
      populate: {
        path: 'author',
        model: 'User',
        select: 'name firstName lastName username thumbnail',
      },
    }],
  })
  .lean().exec((err, group) =>{
    if (err) { return callback(err, null); }

    if (!group) { return callback(null, 'Group Not Found'); }

    // Check if the user is a member of the group
    const memberList ={};
    for (let index = group.members.length; index--;) {
      memberList[group.members[index]._id] = true;
    }
    if (readerID in memberList === false) {
      return callback(null, 'Not Authorized');
    }
    // Check if the user is an admin of the group
    const adminList ={};
    for (let index = group.admins.length; index--;) {
      adminList[group.admins[index]._id] = true;
    }
    group.isAdmin = readerID in adminList;

    return callback(null, group);

  })
};

module.exports = mongoose.model('Group', groupSchema);
