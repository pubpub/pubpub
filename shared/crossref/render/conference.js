/**
 * Renders a submission for a paper from a conference.
 */
import transformCollection from '../transform/collection';
import transformPub from '../transform/pub';
import conference from '../schema/conference';
import conferencePaper from '../schema/conferencePaper';

export default ({ globals, collection, pub }) => {
	const collectionProps = transformCollection({ globals: globals })(collection);
	const pubProps = pub && transformPub({ globals: globals })(pub);
	return conference({
		...collectionProps,
		children: {
			...(pubProps ? conferencePaper(pubProps) : {}),
		},
	});
};
