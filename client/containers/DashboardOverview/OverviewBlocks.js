import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'components';

require('./overviewBlocks.scss');

const propTypes = {
	overviewData: PropTypes.object.isRequired,
	useCollectionPubsObject: PropTypes.object.isRequired,
};

const OverviewBlocks = (props) => {
	const { overviewData, useCollectionPubsObject } = props;
	const { collectionPubs } = useCollectionPubsObject;

	const countItems = (type) => {
		const activeList = collectionPubs ? collectionPubs.map((cp) => cp.pub) : overviewData.pubs;
		return activeList.reduce((prev, curr) => {
			return prev + curr[type].length;
		}, 0);
	};
	const types = [
		{ type: 'discussions', icon: 'chat' },
		{ type: 'reviews', icon: 'social-media' },
		{ type: 'releases', icon: 'pubDoc' },
	];
	return (
		<div className="overview-blocks-component">
			{types.map((item) => {
				return (
					<div className="overview-block" key={item.type}>
						<Icon icon={item.icon} iconSize={36} />
						<div className="text">
							{countItems(item.type)}
							<div>{item.type}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

OverviewBlocks.propTypes = propTypes;
export default OverviewBlocks;
