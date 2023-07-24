import {
	ThreadEvent as ThreadEventModel,
	ThreadComment as ThreadCommentModel,
	Thread as ThreadModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';
import { Discussion } from './discussion';
import { Review } from './review';

export type Commenter = {
	id: string;
	name: string;
};

export type ThreadEvent = RecursiveAttributes<ThreadEventModel>;

export type ThreadComment = RecursiveAttributes<ThreadCommentModel>;

export type Thread = RecursiveAttributes<ThreadModel>;

export type TaggedThreadParent<T = {}> =
	| { type: 'discussion'; value: T & Discussion }
	| { type: 'review'; value: T & Review };
