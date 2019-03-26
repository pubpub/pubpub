/**
 * Renders a submission for a paper from a conference.
 */
import transformCollection from '../transform/collection';
import transformPub from '../transform/pub';
import conference from '../schema/conference';
import conferencePaper from '../schema/conferencePaper';

export default ({ collection, pub }) => {
	const collectionProps = transformCollection(collection);
	const pubProps = transformPub(pub);
	return conference({
		...collectionProps,
		children: {
			...conferencePaper(pubProps),
		},
	});
};
