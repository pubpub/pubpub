import { Collection } from 'types';
import { getSchemaForKind } from 'utils/collections/schemas';


export const getOrderedCollectionMetadataFields = (collection: Collection) => {
	return getSchemaForKind(collection.kind)!.metadata;
};
