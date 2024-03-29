/** Renders a submission for a paper from a conference. */
import transformCollection from '../transform/collection';
import transformPub from '../transform/pub';
import conference from '../schema/conference';
import conferencePaper from '../schema/conferencePaper';

export default ({ globals, collection, community, pub }) => {
	const collectionProps = transformCollection({ globals, community })(collection);
	const pubProps = pub && transformPub({ globals, community })(pub);
	return conference({
		...collectionProps,
		children: {
			...(pubProps && conferencePaper(pubProps)),
		},
	});
};
