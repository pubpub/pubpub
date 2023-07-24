import {
	Discussion as DiscussionModel,
	DiscussionAnchor as DiscussionAnchorModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type DiscussionAnchor = RecursiveAttributes<DiscussionAnchorModel>;
export type Discussion = RecursiveAttributes<DiscussionModel>;
