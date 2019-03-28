import date from './helpers/date';
import contributors from './contributors';

export default ({ title, attributions, volume, issue, publicationDate }) => ({
	journal_issue: {
		titles: {
			title: title,
		},
		...(volume
			? {
					journal_volume: {
						volume: volume,
					},
			  }
			: {}),
		issue: issue,
		...contributors(attributions),
		...date('publication_date', publicationDate),
	},
});
