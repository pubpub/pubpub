import doiData from './doiData';

export default ({ title, issn, language, children, doi, timestamp, url }) => ({
	journal: {
		journal_metadata: {
			...(issn ? { '@media_type': 'electronic', '#text': issn } : {}),
			'@language': language,
			full_title: title,
			abbrev_title: title,
			...doiData(doi, timestamp, url),
		},
		...children,
	},
});
