import transformAttributions from './attributions';
import { collectionComponentDoi } from '../components';

export default (collection) => {
	const { title, metadata, attributions } = collection;
	return {
		...metadata,
		title: title,
		doi: collectionComponentDoi(collection),
		attributions: transformAttributions(attributions),
	};
};
