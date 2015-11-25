var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  image: { type: String },
  thumbnail: { type: String },
  title: { type: String },
  bio: { type: String },
  
  pubs: [ { type: ObjectId, ref: 'Pub' } ],
  discussions: [ { type: ObjectId, ref: 'Discussion' } ],
  highlights: [ { type: ObjectId, ref: 'Highlight' } ],
  assets: [ { type: ObjectId, ref: 'Asset' } ],
  
  yays: [ { type: ObjectId, ref: 'Discussion' } ],
  nays: [ { type: ObjectId, ref: 'Discussion' } ],
  reviews: [ { type: ObjectId, ref: 'Review' } ],
  
  emailPublic: { type: Boolean },
  resetHash: { type: String },
  resetHashExpiration: { type: Date },
  registerDate: { type: Date },
  settings: { 
    editorFont: { type: String },
    editorFontSize: { type: String },
    editorColor: { type: String },
  },
})
userSchema.plugin(passportLocalMongoose,{'usernameField':'email', 'digestAlgorithm':'sha1'});

userSchema.statics.generateUniqueUsername = function (fullname, callback) {
  var self = this;

  function findUniqueName(username, count){
    var tweakedUsername = username;
    if(count){
      tweakedUsername = tweakedUsername + String(count);
    }

    self.findOne({'username':tweakedUsername}).exec(function (err, user) {
      if(!user){
        // console.log(tweakedUsername);
        return callback(tweakedUsername);
      }else{
        // console.log('Next one');
        return findUniqueName(username,count+1);
      }
    });  
  };

  var username = fullname.replace(/[^\w\s]/gi, '').replace(/ /g, '_').toLowerCase();
  findUniqueName(username,0);
};

userSchema.statics.getUser = function (username, readerID, callback) {
  this.findOne({username: username})
  .populate({path: "pubs", select:"title slug"})
  .lean().exec((err, user) =>{
    if (err) { return callback(err, null); }

    if (!user) { return callback(null, 'User Not Found'); }
    const outputUser = {
      username: user.username,
      image: user.image,
      name: user.name,
      pubs: user.pubs,
    }
    return callback(null, outputUser);
  })
};

module.exports = mongoose.model('User', userSchema);
