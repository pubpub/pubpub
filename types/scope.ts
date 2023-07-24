import {
	ScopeSummary as ScopeSummaryModel,
	UserScopeVisit as UserScopeVisitModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type ScopeId = { communityId: string } & ({ pubId: string } | { collectionId: string } | {});

export type SingleScopeId = { communityId: string } | { pubId: string } | { collectionId: string };

export type ScopeSummary = RecursiveAttributes<ScopeSummaryModel>;
export type UserScopeVisit = RecursiveAttributes<UserScopeVisitModel>;
