import React from 'react';
import { PubAttributionEditor } from 'components';

import { usePageContext } from 'utils/hooks';
import { PubPageData, DefinitelyHas } from 'types';

type Props = {
	pubData: DefinitelyHas<PubPageData, 'submission'>;
	onUpdatePub: (pub: Partial<PubPageData>) => unknown;
};

const Contributors = (props: Props) => {
	const { onUpdatePub, pubData } = props;
	const { communityData } = usePageContext();

	const renderAttributions = () => {
		return (
			<div>
				<p>
					Add the names, roles & affiliations of other people who have a part to play in
					the creation of this submission’s content.
				</p>
				<div>
					<PubAttributionEditor
						pubData={pubData}
						communityData={communityData}
						updatePubData={onUpdatePub}
						canEdit={true}
					/>
				</div>
			</div>
		);
	};
	return <>{renderAttributions()}</>;
};

export default Contributors;
