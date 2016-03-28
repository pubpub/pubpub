import mongoose from './connectMongo';
import Discussion from '../models/discussion-model';

export function migrateDiscussions () {

  Discussion.find({}).exec(function(err, discussions) {
    for (let discussion of discussions) {
       const postDate = discussion.postDate;
       discussion.createDate = postDate;
       discussion.lastUpdated = postDate;
       discussion.postDate = undefined;
       discussion.assets = undefined;
       discussion.references = undefined;
       // discussion.selections = undefined;

       discussion.history = [{
         markdown: discussion.markdown,
         datePosted: postDate,
         version: discussion.version,
       }];

       Discussion.update({_id: discussion._id}, {$set: discussion, $unset: {postDate: 1, assets: 1, references: 1 }}, function(err, numAffected) {
         if (err) {
           console.log(err);
         }
       });
    }

    console.log('looped through them all');

  });


  /*
  Discussion.update({}, {$rename:{"postDate":"createDate"}}, {upsert: false, multi: true}, function(err,discussions) {

    if (err) {
      console.log(err);
      return;
    }
    console.log(arguments);

  });
  */

}
