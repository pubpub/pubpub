import contributors from './contributors';
import doiData from './doiData';
import date from './helpers/date';
import relations from './relations';

export default ({
	// attributions,
	// language,
	doi,
	// publicationDate,
	resourceUrl,
	timestamp,
	title,
	relatedItems,
}) => ({
	component_list: {
		'@xmlns:rel': 'http://www.crossref.org/relations.xsd',
		sa_component: {
			'@parent_doi': '',
		},
		titles: {
			title: title,
		},
		// ...date('posted_date', publicationDate, 'print'),
		...(relatedItems.length > 0 && relations(relatedItems)),
		...doiData(doi, timestamp, resourceUrl),
	},
});
