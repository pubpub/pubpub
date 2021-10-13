import { Collection } from 'types';

const getBookCopyright = (collection) => {
	if (collection.metadata.copyrightYear) {
		return collection.metadata.copyrightYear;
	}
	return collection.metadata && collection.metadata.copyrightYear;
};

const getBookIsbn = (collection) => {
	if (collection.metadata.isbn) {
		return collection.metadata.isbn;
	}
	return collection.metadata && collection.metadata.isbn;
};

const getBookEdition = (collection) => {
	if (collection.metadata.edition) {
		return collection.metadata.edition;
	}
	return collection.metadata && collection.metadata.edition;
};

const getBookPublicationDate = (collection) => {
	if (collection.metadata.publicationDate) {
		return collection.metadata.publicationDate;
	}
	return collection.metadata && collection.metadata.publicationDate;
};

export const IssueMetadata = (collection: Collection) => {
	const printIssn = getBookCopyright(collection);
	const electronicIssn = getBookIsbn(collection);
	const volume = getBookEdition(collection);
	const printPublicationDate = getBookPublicationDate(collection);

	return { printIssn, electronicIssn, volume, printPublicationDate };
};
