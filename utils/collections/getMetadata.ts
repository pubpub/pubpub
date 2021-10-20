import { Collection } from 'types';
import { deserializeMetadata } from 'utils/collections/metadata';
import { getSchemaForKind } from 'utils/collections/schemas';

export const issueMetadata = (collection: Collection) => {
	const metadata = deserializeMetadata({
		metadata: collection.metadata,
		kind: collection.kind,
		fallback: null,
	});

	const {
		printIssn,
		electronicIssn,
		volume,
		issue,
		printPublicationDate,
		publicationDate,
	} = metadata;
	return { printIssn, electronicIssn, volume, issue, printPublicationDate, publicationDate };
};

export const bookMetadata = (collection: Collection) => {
	const metadata = deserializeMetadata({
		metadata: collection.metadata,
		kind: collection.kind,
		fallback: null,
	});

	const { isbn, copyright, published, edition } = metadata;
	return { isbn, copyright, published, edition };
};

export const conferenceMetadata = (collection: Collection) => {
	const metadata = deserializeMetadata({
		metadata: collection.metadata,
		kind: collection.kind,
		fallback: null,
	});

	const { theme, location, acronym, date } = metadata;
	return { theme, location, acronym, date };
};

export const getOrderedCollectionMetadataFields = (collection: Collection) => {
	return getSchemaForKind(collection.kind)!.metadata;
};
