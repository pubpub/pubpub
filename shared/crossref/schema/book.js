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
	url,
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
				...doiData(doi, timestamp, url),
				...date('publication_date', publicationDate),
			},
			...children,
		},
	};
};
