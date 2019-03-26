export default ({ title, issn, language, children }) => ({
	journal: {
		journal_metadata: {
			...(issn ? { '@media_type': 'electronic', '#text': issn } : {}),
			'@language': language,
			full_title: title,
			abbrev_title: title,
		},
		...children,
	},
});
