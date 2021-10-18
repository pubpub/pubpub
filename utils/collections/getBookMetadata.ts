import { Collection } from 'types';

const getBookCopyright = (collection: Collection) => collection.metadata?.copyrightYear;
const getBookIsbn = (collection) => collection.metadata?.isbn;
const getBookEdition = (collection) => collection.metadata?.edition;
const getBookPublicationDate = (collection) => collection.metadata?.publicationDate;

export const bookMetadata = (collection: Collection) => {
	const isbn = getBookIsbn(collection);
	const copyright = getBookCopyright(collection);
	const published = getBookPublicationDate(collection);
	const edition = getBookEdition(collection);

	return { isbn, copyright, published, edition };
};
