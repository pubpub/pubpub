import React from 'react';

import { PubPageData } from 'types';
import { useAnalytics } from 'utils/analytics/useAnalytics';

import PubHeader from './PubHeader';
import SpubHeader from './SpubHeader';
import PubDocument from './PubDocument';
import { usePubContext } from './pubHooks';
import { PubContextProvider } from './PubContextProvider';
import { PubSuspendWhileTypingProvider } from './PubSuspendWhileTyping';

require('./pub.scss');

type Props = {
	pubData: PubPageData;
};

const SomePubHeader = () => {
	const pubContext = usePubContext();
	const { submissionState } = pubContext;
	const HeaderComponent = submissionState ? SpubHeader : PubHeader;
	return <HeaderComponent />;
};

const Pub = (props: Props) => {
	const { pubData } = props;
	const uniqueCollectionIds = Array.from(
		new Set((pubData.collectionPubs ?? []).map((cp) => cp.collectionId)),
	);

	const { page } = useAnalytics();

	page({
		type: 'pub',
		communityId: pubData.communityId,
		title: pubData.title,
		pubSlug: pubData.slug,
		pubId: pubData.id,
		pubTitle: pubData.title,
		collectionIds: uniqueCollectionIds,
	});

	return (
		<div id="pub-container">
			<PubSuspendWhileTypingProvider>
				<PubContextProvider pubData={pubData}>
					<SomePubHeader />
					<PubDocument />
				</PubContextProvider>
			</PubSuspendWhileTypingProvider>
		</div>
	);
};

export default Pub;
