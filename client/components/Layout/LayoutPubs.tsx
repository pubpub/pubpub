import React from 'react';

import { PubPreview } from 'components';
import { Pub } from 'utils/types';
import { LayoutBlockPubs } from 'utils/layout/types';

type Props = {
	content: LayoutBlockPubs['content'];
	pubs: Pub[];
};

const LayoutPubs = (props: Props) => {
	const { pubs, content } = props;
	const {
		hideByline,
		hideContributors,
		hideDates,
		hideDescription,
		hideEdges,
		pubPreviewType,
		title,
	} = content;
	const isTwoColumn = ['medium', 'minimal'].includes(pubPreviewType);

	const renderPubRow = (currentPub: Pub, index: number, allPubs: Pub[]) => {
		if (isTwoColumn && index % 2 === 1) {
			return null;
		}
		const nextPub = isTwoColumn && index < allPubs.length - 1 ? allPubs[index + 1] : null;
		return (
			<div key={currentPub.id} className="row">
				<div className={isTwoColumn ? 'col-6' : 'col-12'}>
					<PubPreview
						pubData={currentPub}
						size={pubPreviewType}
						hideByline={hideByline}
						hideDescription={hideDescription}
						hideDates={hideDates}
						hideEdges={hideEdges}
						hideContributors={hideContributors}
					/>
				</div>
				{nextPub && (
					<div className={isTwoColumn ? 'col-6' : 'col-12'}>
						<PubPreview
							pubData={nextPub}
							size={pubPreviewType}
							hideByline={hideByline}
							hideDescription={hideDescription}
							hideDates={hideDates}
							hideEdges={hideEdges}
							hideContributors={hideContributors}
						/>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="block-content">
			<div className="container">
				{title && (
					<div className="row">
						<div className="col-12">
							<h1>{title}</h1>
						</div>
					</div>
				)}
				{pubs.map(renderPubRow)}
			</div>
		</div>
	);
};

export default LayoutPubs;
