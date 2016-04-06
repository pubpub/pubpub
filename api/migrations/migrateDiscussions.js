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
      if (err.code !== 11000) {
        callback(err);
        return;
      }
    }

    try {
      const newDiscussionDoc = JSON.parse(JSON.stringify(discussion));
      const postDate = newDiscussionDoc.postDate;
      newDiscussionDoc.createDate = postDate;
      newDiscussionDoc.lastUpdated = postDate;
      newDiscussionDoc.markdown = widgetProcessor({markdown: newDiscussionDoc.markdown, assets: newAssets});
      newDiscussionDoc.postDate = undefined;
      newDiscussionDoc.assets = undefined;
      newDiscussionDoc.references = undefined;
      // console.log(discussion.markdown);
      // discussion.selections = undefined;

      newDiscussionDoc.history = [{
        markdown: newDiscussionDoc.markdown,
        datePosted: postDate,
        version: newDiscussionDoc.version,
      }];


      newDiscussion.create(newDiscussionDoc, function(err2, results) {
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
