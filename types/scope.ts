import { Attributes } from 'sequelize';
import {
	ScopeSummary as ScopeSummaryModel,
	UserScopeVisit as UserScopeVisitModel,
} from 'server/models';

export type ScopeId = { communityId: string } & ({ pubId: string } | { collectionId: string } | {});

export type SingleScopeId = { communityId: string } | { pubId: string } | { collectionId: string };

export type ScopeSummary = Attributes<ScopeSummaryModel>;
export type UserScopeVisit = Attributes<UserScopeVisitModel>;
