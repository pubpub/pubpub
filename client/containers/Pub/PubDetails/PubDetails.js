import React, { useState, useContext } from 'react';
import { Button } from '@blueprintjs/core';

import ensureUserForAttribution from 'shared/utils/ensureUserForAttribution';
import { Icon, GridWrapper } from 'components';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import Avatar from 'components/Avatar/Avatar';
import ClickToCopyButton from 'components/ClickToCopyButton/ClickToCopyButton';

require('./pubDetails.scss');

const maxContributorsInCompactView = 5;

const PubDetailsCompact = (props) => {
	const { pubData, accentColor } = props;
	const collaboratorsWithAvatars = pubData.attributions
		.slice(0, maxContributorsInCompactView)
		.map(ensureUserForAttribution);
	const leftoverCollaborators = pubData.attributions.length - maxContributorsInCompactView;
	return (
		<div className="pub-details-component compact">
			<div className="collaborators">
				<h6>Contributors</h6>
				{collaboratorsWithAvatars.map(({ user }, i) => (
					<Avatar
						key={i}
						userInitials={user.initials}
						userAvatar={user.avatar}
						width={20}
					/>
				))}
				{leftoverCollaborators > 0 && <span>&amp; {leftoverCollaborators} more</span>}
			</div>
			{pubData.doi && (
				<div className="doi">
					<h6>DOI</h6>
					{pubData.doi}
					<ClickToCopyButton
						copyString={`https://doi.org/${pubData.doi}`}
						icon="clipboard"
						className="click-to-copy"
					/>
				</div>
			)}
			<div className="expand-contract">
				<Button minimal icon={<Icon icon="expand-all" />} style={{ color: accentColor }}>
					Pub details
				</Button>
			</div>
		</div>
	);
};

const PubDetails = (props) => {
	const [isExpanded, setIsExpanded] = useState();
	const { communityData } = useContext(PageContext);
	return (
		<GridWrapper containerClassName="pub">
			{isExpanded && (
				<PubDetailsExpanded
					pubData={props.pubData}
					onCollapse={() => setIsExpanded(false)}
					accentColor={communityData.accentColorDark}
				/>
			)}
			{!isExpanded && (
				<PubDetailsCompact
					pubData={props.pubData}
					onExpand={() => setIsExpanded(true)}
					accentColor={communityData.accentColorDark}
				/>
			)}
		</GridWrapper>
	);
};

export default PubDetails;
