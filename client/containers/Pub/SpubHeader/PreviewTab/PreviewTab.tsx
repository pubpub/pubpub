import React from 'react';

import { GridWrapper, PubByline } from 'components';
import { usePageContext } from 'utils/hooks';
import { PubPageData } from 'types';
import { Button } from '@blueprintjs/core';
import PubHeaderBackground from '../../PubHeader/PubHeaderBackground';

require('./previewTab.scss');

type Props = {
	pubData: PubPageData;
};

const PreviewTab = (props: Props) => {
	const { communityData } = usePageContext();
	const { pubData } = props;
	const { collectionPubs, submission } = pubData;
	const collection = collectionPubs[0].collection;
	return (
		<PubHeaderBackground
			className="pub-header-component"
			communityData={communityData}
			pubData={props.pubData}
		>
			<GridWrapper>
				<div className="pub-header-content-component">
					<div className="pub-header-top-area has-bottom-hairline">
						<Button
							type="button"
							intent="primary"
							disabled={true}
							text={collection?.title}
						/>
						<div className="basic-details">
							<span>Status: {submission?.status}</span>
						</div>
						<Button
							type="button"
							intent="primary"
							disabled={true}
							text="close preview"
						/>
					</div>
					<div className="title-group-component">
						<h1 className="title">
							<span className="text-wrapper">{pubData.title}</span>
						</h1>
						<h3 className="description pub-header-themed-secondary">
							{pubData.description}
						</h3>
						<PubByline pubData={pubData} />
					</div>
				</div>
			</GridWrapper>
		</PubHeaderBackground>
	);
};

export default PreviewTab;
