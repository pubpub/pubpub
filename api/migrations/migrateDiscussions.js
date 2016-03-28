import mongoose from './connectMongo';
import Discussion from '../models/discussion-model';

export function migrateDiscussions () {
  Discussion.update({}, {$rename:{"postDate":"createDate"}}, false, true);

  Discussion.find({}).exec(function(err, discussions) {
    for (let discussion of discussions) {
       discussion.lastUpdated = discussion.postDate || discussion.createDate;
       discussion.history = {
         markdown: discussion.markdown,
         datePosted: discussion.postDate || discussion.createDate,
         version: discussion.version,
       };

       /*
       Discussion.update({}, {'$set': {
         'history.markdown': 'updated item2',
         'items.$.value': 'two updated'
       }};
       */

       Discussion.update({_id: discussion._id}, discussion, function(err, newDiscussion) {
         if (err) {
           console.log(err);
           return;
         }
         console.log('Updated' + newDiscussion._id);
       });

    }

  );

}
