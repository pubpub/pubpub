import { Attributes } from 'sequelize';
import {
	Discussion as DiscussionModel,
	DiscussionAnchor as DiscussionAnchorModel,
} from 'server/models';

export type DiscussionAnchor = Attributes<DiscussionAnchorModel>;
export type Discussion = Attributes<DiscussionModel>;
