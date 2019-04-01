/**
 * Renders a submission for a book.
 */
import book from '../schema/book';
import contentItem from '../schema/contentItem';

import transformCollection from '../transform/collection';
import transformPub from '../transform/pub';

export default ({ globals, community, collection, pub }) => {
	// STOPSHIP(ian): get actual componentType from collectionPub
	const pubProps = pub && transformPub({ globals: globals, community: community })(pub);
	const collectionProps = transformCollection({ globals: globals, community: community })(
		collection,
	);
	return book({
		...collectionProps,
		children: {
			...(pubProps && contentItem({ ...pubProps, componentType: 'chapter' })),
		},
	});
};
