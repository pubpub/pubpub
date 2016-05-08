// A mode can expose any of the following methods:
// - Process Tree: Will be passed a javascript structure of the DOM tree, prior to iteration for pruning, moving around, etc./
// - HandleIterate: Used while iterating through the tree, must return either a React Component for the tree branch OR false to indicate no action.

import RSSMode from './RSSMode';
import HTMLMode from './HTMLMode';

export default {
  html: HTMLMode,
  rss: RSSMode,
};
