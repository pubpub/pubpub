/**
 * Renders a date
 */
export default (kind, date, mediaType = 'online') => ({
	[kind]: {
		'@media_type': mediaType,
		month: `0${date.getMonth() + 1}`.slice(-2),
		day: date.getDate(),
		year: date.getFullYear(),
	},
});
