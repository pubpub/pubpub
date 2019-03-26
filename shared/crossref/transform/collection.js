import transformAttributions from './attributions';
import { collectionComponentDoi } from '../components';

export default ({ globals }) => (collection) => {
	const { title, metadata, attributions } = collection;
	return {
		...metadata,
		title: title,
		timestamp: globals.timestamp,
		doi: collectionComponentDoi(collection),
		attributions: transformAttributions(attributions),
	};
};
