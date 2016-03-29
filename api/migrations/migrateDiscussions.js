import mongoose from './connectMongo';
// import Discussion from '../models/discussion-model';
import Discussion from './oldModels/old-discussion-model';
import newDiscussion from '../models/discussion-model';


import Highlight from './oldModels/old-highlight-model';
import widgetProcessor from './processors/widgetReplace';
import {queue} from 'async';

import {assetRefactorDiscussion} from './processors/assetRefactor';

export function migrateDiscussions (MAX_TO_MIGRATE) {

  const discussionQueue = queue(migrateDiscussion, 10);
  let migrateCount = 0;
  const errorDiscussions = [];


  Discussion.find({}).populate({ path: 'selections', model: 'oldHighlight' })
  .exec(function(err, discussions) {
    console.log('Fetched discussions');
    for (let discussion of discussions) {

      if (err || !discussion || migrateCount >= MAX_TO_MIGRATE) {
        continue;
      }
      migrateCount++;

      discussionQueue.push({discussion}, function (err) {
        if (err) {
          console.log(err);
          errorDiscussions.push(discussion);
        } else {
          console.log('Processed ', discussion._id);
        }
      });

    }

  });

  discussionQueue.drain = function() {
    console.log('all discussions have been processed');
    console.log('The following discussions had errors');
    console.log(errorDiscussions.map((disc) => disc._id));
  }

}


function migrateDiscussion({discussion}, callback) {
  const processorCallback = (err, newAssets) => {

    if (err) {
      console.log(err);
      callback(err);
      return;
    }

    try {
      const postDate = discussion.postDate;
      discussion.createDate = postDate;
      discussion.lastUpdated = postDate;
      discussion.postDate = undefined;
      discussion.assets = undefined;
      discussion.references = undefined;
      discussion.markdown = widgetProcessor({markdown: discussion.markdown, assets: newAssets});
      // console.log(discussion.markdown);
      // discussion.selections = undefined;

      discussion.history = [{
        markdown: discussion.markdown,
        datePosted: postDate,
        version: discussion.version,
      }];

      console.log('About to update discussion!');

      newDiscussion.update({_id: discussion._id}, {$set: discussion, $unset: {postDate: 1, assets: 1, references: 1 }}, function(err, numAffected) {
        if (err) {
          console.log(err);
        }
        callback(err);
      });

    } catch (err) {
      console.log(err);
      console.log(discussion);
      callback(err);
    }

  };

  assetRefactorDiscussion({discussion: discussion, highlights: discussion.selections || [], callback: processorCallback});
}
