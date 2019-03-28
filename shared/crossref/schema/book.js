import contributors from './contributors';
import date from './helpers/date';
import doiData from './doiData';
import renderIsbn from './isbn';

export default ({
	attributions,
	children,
	doi,
	edition,
	isbn,
	publicationDate,
	publisherName,
	timestamp,
	title,
	url,
}) => {
	return {
		book: {
			// STOPSHIP(ian): fix this
			'@book_type': 'other',
			book_metadata: {
				...contributors(attributions),
				titles: {
					title: title,
				},
				edition_number: edition || '1',
				...date('publication_date', publicationDate),
				...renderIsbn(isbn),
				publisher: {
					publisher_name: publisherName,
				},
				...doiData(doi, timestamp, url),
			},
			...children,
		},
	};
};
