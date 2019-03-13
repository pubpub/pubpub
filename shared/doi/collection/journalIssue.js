/**
 * Submission skeleton for a journal issue.
 */
import skeletonize from '../skeletonize';

import { collectionIsOfKind } from './collection';

const existsFor = ({ collection }) => collectionIsOfKind(collection, 'journal_issue');

const transformer = () => ({});

const skeleton = () => ({});

export default skeletonize(transformer, skeleton, existsFor);
