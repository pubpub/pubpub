import { Collection as CollectionModel, CollectionPub as CollectionPubModel } from 'server/models';
import { RecursiveAttributes } from './recursiveAttributes';

export type CollectionKind = 'tag' | 'issue' | 'book' | 'conference';
export type ReadNextPreviewSize = 'none' | 'minimal' | 'medium' | 'choose-best';

export type Collection = RecursiveAttributes<CollectionModel>;

export type CollectionPub = RecursiveAttributes<CollectionPubModel>;
