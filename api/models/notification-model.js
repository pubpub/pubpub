var _         = require('underscore');
var mongoose  = require('mongoose');
var Schema    =  mongoose.Schema;
var ObjectId  = Schema.Types.ObjectId;

var notificationSchema = new Schema({
  source: { type: ObjectId, ref: 'Pub' },
  sender: { type: ObjectId, ref: 'User' },
  recipient: { type: ObjectId, ref: 'User', required: true, index: true },
  senderContent: { type: String },
  sourceContent: { type: String },
  type: { type: String },
  created: { type: Date },
  url: { type: String },
  read: { type: Boolean },
  sent: { type: Boolean },
  email: { type: Boolean }
});

notificationSchema.statics.deleteNotification = function(notificationID,callback) {
  this.findById(notificationID).remove().exec(function(err, notification) {
    if (err) callback(err);
    callback(null,notification);
  });
  return;
}

notificationSchema.statics.deleteAllNotifications = function (user,callback) {
  this.find({'recipient':user}).remove().exec(function(err, notifications) {
    if (err) callback(err);
    callback(null,notifications);
  });
  return;
};

notificationSchema.statics.getNotification = function(notificationID,callback) {
  this.findById(notificationID)
  .exec(function (err, notification) {
    if (err) callback(err);
    callback(null,notification);
  });
}

notificationSchema.statics.getNotifications = function (user,callback) {
  this.find({'recipient':user})
  .sort({'created': -1})
  .limit(15)
  .exec(function(err, notifications) {
      if (err) callback(err);
      callback(null,notifications);
    });
  return;
};

notificationSchema.statics.createNotification = function (options) {

  var date = new Date().getTime();

  var notification = new Notification({
    recipient: options.recipient,
    content: options.content,
    sender: options.sender,
    type: options.type,
    created: date,
    source: options.source,
    url: options.url,
    senderContent: options.senderContent,
    sourceContent: options.sourceContent,
    read: false,
    sent: false,
    email: false
  });

  notification.save(function (err, notification) {
    if (err) { console.log(err); }
    //console.log(notification);
    return;
  });

}

notificationSchema.statics.sendCommentNotification = function (sender,recipient,pub,url) {

  Notification.createNotification({
    recipient:  recipient,
    type:       'comment',
    sender:     sender,
    source:     pub,
    url:        url,
    senderContent: sender.name,
    sourceContent: pub.displayTitle
  });
};



var Notification = mongoose.model('Notification',notificationSchema);

module.exports = Notification;
