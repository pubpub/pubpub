/**
 * Code that builds a submission that we can send to Crossref. We build JSON here, and let that
 * get converted to equivalent XML downstream.
 */
import { makeComponentId } from './components';
import doiBatch from './schema/doiBatch';
import renderJournal from './render/journal';

const renderBody = (context) => {
	return renderJournal(context);
};

export default ({ community, collection, pub }) => {
	const componentId = makeComponentId(community, collection, pub);
	const timestamp = new Date().getTime();
	const body = renderBody({
		globals: { timestamp: timestamp },
		community: community,
		collection: collection,
		pub: pub,
	});
	return doiBatch({ body: body, componentId: componentId, timestamp: timestamp });
};
