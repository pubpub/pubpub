import transformAttributions from './attributions';

export default ({ globals }) => (collection) => {
	const { title, metadata, attributions } = collection;
	return {
		...metadata,
		title: title,
		timestamp: globals.timestamp,
		attributions: transformAttributions(attributions),
	};
};
