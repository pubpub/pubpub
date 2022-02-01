import React from 'react';

import { GridWrapper, PubByline } from 'components';
import { usePageContext } from 'utils/hooks';
import { PubPageData } from 'types';
import PubHeaderBackground from '../../PubHeader/PubHeaderBackground';

type Props = {
	pubData: PubPageData;
};

const PreviewTab = (props: Props) => {
	const { communityData } = usePageContext();
	const { pubData } = props;
	return (
		<PubHeaderBackground
			className="spub-header-component"
			communityData={communityData}
			pubData={props.pubData}
		>
			<GridWrapper containerClassName="pub">
				<div className="spub-header-content-component">
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
