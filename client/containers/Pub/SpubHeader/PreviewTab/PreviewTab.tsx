import React from 'react';

import { GridWrapper, PubByline } from 'components';
import { usePageContext } from 'utils/hooks';
import { PubPageData } from 'types';
import PubHeaderBackground from '../../PubHeader/PubHeaderBackground';

require('./previewTab.scss');

type Props = {
	pubData: PubPageData;
};

const PreviewTab = (props: Props) => {
	const { communityData } = usePageContext();
	const { pubData } = props;
	return (
		<PubHeaderBackground
			className="pub-header-component"
			communityData={communityData}
			pubData={props.pubData}
		>
			<GridWrapper containerClassName="pub">
				<div className="pub-header-content-component">
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
