import React from 'react';
import classNames from 'classnames';

import { PubPreview } from 'components';
import { Pub } from 'utils/types';
import { PubsContentOptions } from 'utils/layout/types';

type Props = {
	className?: string;
	pubsContentOptions: PubsContentOptions;
	pubs: Pub[];
	title?: string;
};

const BaseLayoutPubs = (props: Props) => {
	const { className = '', pubs, pubsContentOptions, title } = props;
	const {
		hideByline,
		hideContributors,
		hideDates,
		hideDescription,
		hideEdges,
		limit,
		pubPreviewType,
	} = pubsContentOptions;
	const displayLimit = limit || Math.max(4, pubs.length);
	const isTwoColumn = ['medium', 'minimal'].includes(pubPreviewType);

	const emptyPreviews: any[] = [];
	for (let index = 0; index < displayLimit; index += 1) {
		emptyPreviews.push(null);
	}

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
		<div className={classNames('base-layout-pubs-component', className)}>
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
		</div>
	);
};

export default BaseLayoutPubs;
