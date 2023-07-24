import {
	Visibility as VisibilityModel,
	VisibilityUser as VisibilityUserModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';
import { Discussion } from './discussion';
import { Review } from './review';

export type VisibilityAccess = 'private' | 'members' | 'public';

export type VisibilityUser = RecursiveAttributes<VisibilityUserModel>;

export type Visibility = RecursiveAttributes<VisibilityModel>;

export type TaggedVisibilityParent =
	| { type: 'discussion'; value: Discussion }
	| { type: 'review'; value: Review };
