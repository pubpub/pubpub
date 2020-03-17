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
		if (type === 'pubs') {
			return activeList.length;
		}
		return activeList.reduce((count, pub) => {
			return count + pub[type].length;
		}, 0);
	};
	const types = [
		{ type: 'pubs', icon: 'pubDoc' },
		{ type: 'discussions', icon: 'chat' },
		{ type: 'forks', icon: 'git-branch' },
		{ type: 'reviews', icon: 'social-media' },
	];
	return (
		<div className="overview-blocks-component">
			{types.map((item) => {
				return (
					<div className="overview-block" key={item.type}>
						<Icon icon={item.icon} iconSize={18} />
						<div className="text">
							<span className="count">{countItems(item.type)}</span> {item.type}
						</div>
					</div>
				);
			})}
		</div>
	);
};

OverviewBlocks.propTypes = propTypes;
export default OverviewBlocks;
