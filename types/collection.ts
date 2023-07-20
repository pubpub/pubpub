import { Attributes } from 'sequelize';
import { Collection as CollectionModel, CollectionPub as CollectionPubModel } from 'server/models';

export type CollectionKind = 'tag' | 'issue' | 'book' | 'conference';
export type ReadNextPreviewSize = 'none' | 'minimal' | 'medium' | 'choose-best';

export type Collection = Attributes<CollectionModel>;

export type CollectionPub = Attributes<CollectionPubModel>;
