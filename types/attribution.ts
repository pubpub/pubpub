import {
	PubAttribution as PubAttributionModel,
	CollectionAttribution as CollectionAttributionModel,
} from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

import { DefinitelyHas } from './util';

export type PubAttribution = RecursiveAttributes<PubAttributionModel>;

export type CollectionAttribution = RecursiveAttributes<CollectionAttributionModel>;

export type Attribution = CollectionAttribution | PubAttribution;
export type AttributionWithUser = DefinitelyHas<Attribution, 'user'>;

export const isAttributionWithUser = (
	attribution: Attribution,
): attribution is AttributionWithUser => 'user' in attribution && !!attribution.user;

export const isCollectionAttribution = (
	attribution: Attribution,
): attribution is CollectionAttribution => 'collectionId' in attribution;

export const isPubAttribution = (attribution: Attribution): attribution is PubAttribution =>
	'pubId' in attribution;
