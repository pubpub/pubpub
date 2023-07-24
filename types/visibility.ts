import { Attributes } from 'sequelize';
import {
	Visibility as VisibilityModel,
	VisibilityUser as VisibilityUserModel,
} from 'server/models';
import { Discussion } from './discussion';
import { Review } from './review';

export type VisibilityAccess = 'private' | 'members' | 'public';

export type VisibilityUser = Attributes<VisibilityUserModel>;

export type Visibility = Attributes<VisibilityModel>;

export type TaggedVisibilityParent =
	| { type: 'discussion'; value: Discussion }
	| { type: 'review'; value: Review };
