import date from './helpers/date';
import contributors from './contributors';

export default ({ attributions, children, title, theme, acronym, location, conferenceDate }) => ({
	conference: {
		event_metadata: {
			conference_name: title,
			conference_theme: theme,
			conference_acronym: acronym,
			conference_location: location,
			...date('conference_date', conferenceDate),
		},
		...contributors(attributions),
		...children,
	},
});
