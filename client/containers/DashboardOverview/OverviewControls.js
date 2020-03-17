import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from '@blueprintjs/core';

import { LinkedPageSelect } from 'components';
import { MenuButton, MenuItem } from 'components/Menu';
import { usePageContext } from 'utils/hooks';

import { useCollectionState, useCollectionPubs } from './collectionState';
import PubSelect from './PubSelect';

const propTypes = {
	overviewData: PropTypes.object.isRequired,
};

const OverviewControls = (props) => {
	const { overviewData } = props;
	const { scopeData } = usePageContext();
	const { canManage } = scopeData.activePermissions;
	const { activeCommunity, activeTargetType } = scopeData.elements;
	const isCollectionView = activeTargetType === 'collection';
	const { collection, updateCollection } = useCollectionState(scopeData);
	const { collectionPubs, addCollectionPub } = useCollectionPubs({
		scopeData: scopeData,
		overviewData: overviewData,
	});

	const { isPublic } = collection;
	if (!canManage || !isCollectionView) {
		return null;
	}
	return (
		<React.Fragment>
			<ButtonGroup>
				<MenuButton
					aria-label="Set collection public or private"
					buttonContent={isPublic ? 'Public' : 'Private'}
					buttonProps={{
						icon: isPublic ? 'globe' : 'lock2',
						rightIcon: 'caret-down',
					}}
				>
					<MenuItem
						icon={isPublic ? 'tick' : 'blank'}
						text="Public"
						onClick={() => updateCollection({ isPublic: true })}
					/>
					<MenuItem
						icon={isPublic ? 'blank' : 'tick'}
						text="Private"
						onClick={() => updateCollection({ isPublic: false })}
					/>
				</MenuButton>
				<LinkedPageSelect
					selfContained={true}
					communityData={activeCommunity}
					collection={collection}
					onSelectPage={(page) => updateCollection({ pageId: page.id })}
				/>
				<PubSelect
					pubs={overviewData.pubs}
					usedPubIds={collectionPubs.map((cp) => cp.pubId)}
					onSelectPub={addCollectionPub}
				>
					<Button icon="plus">Add Pubs</Button>
				</PubSelect>
			</ButtonGroup>
			<Button icon="edit" text="New Pub" />
		</React.Fragment>
	);
};

OverviewControls.propTypes = propTypes;
export default OverviewControls;
