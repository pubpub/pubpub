var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
  email: { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true, index: { unique: true } },
  name: { type: String },
  title: { type: String },
  bio: { type: String },
  groups: [{ type: ObjectId, ref: 'Group' }],
  pubs: [ { type: ObjectId, ref: 'Pub' } ],
  discussions: [ { type: ObjectId, ref: 'Discussion' } ],
  // relatedpubs: [ { type: ObjectId, ref: 'Relatedpub' } ],
  // externals: [ { type: ObjectId, ref: 'External' } ],
  references: [ { type: ObjectId, ref: 'Reference' } ],
  highlights: [ { type: ObjectId, ref: 'Highlight' } ],
  assets: [ { type: ObjectId, ref: 'Asset' } ],
  image: { type: String },
  thumbnail: { type: String },
  yays: [ { type: ObjectId, ref: 'Discussion' } ],
  nays: [ { type: ObjectId, ref: 'Discussion' } ],
  reviews: [ { type: ObjectId, ref: 'Review' } ],
  // should user have an assets field - that shows all the assets they've ever uploaded?
  emailPublic: { type: Boolean },
  resetHash: { type: String },
  resetHashExpiration: { type: Date },
  registerDate: { type: Date }
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

module.exports = mongoose.model('User', userSchema);