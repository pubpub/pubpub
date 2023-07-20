import { Attributes } from 'sequelize';
import {
	ThreadEvent as ThreadEventModel,
	ThreadComment as ThreadCommentModel,
	Thread as ThreadModel,
} from 'server/models';
import { Discussion } from './discussion';
import { Review } from './review';

export type Commenter = {
	id: string;
	name: string;
};

export type ThreadEvent = Attributes<ThreadEventModel>;

export type ThreadComment = Attributes<ThreadCommentModel>;

export type Thread = Attributes<ThreadModel>;

export type TaggedThreadParent<T = {}> =
	| { type: 'discussion'; value: T & Discussion }
	| { type: 'review'; value: T & Review };
