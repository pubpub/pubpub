import contributors from './contributors';
import date from './helpers/date';
import doiData from './doiData';

export default ({
	attributions,
	children,
	doi,
	edition,
	isbn,
	publicationDate,
	timestamp,
	title,
}) => {
	return {
		book: {
			'@publication_type': 'full_text',
			titles: {
				title: title,
			},
			book_metadata: {
				isbn: isbn,
				edition: edition,
				...contributors(attributions),
				...doiData(doi, timestamp),
				...date('publication_date', publicationDate),
			},
			...children,
		},
	};
};
