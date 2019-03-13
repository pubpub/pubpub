import * as React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import fuzzysearch from 'fuzzysearch';

import collectionType from 'types/collection';
import communityType from 'types/community';

const propTypes = {
	collection: collectionType.isRequired,
	communityData: communityType.isRequired,
	onCollectionUpdate: PropTypes.func.isRequired,
};

const LinkedPageSelect = ({ communityData, collection, onCollectionUpdate }) => (
	<Select
		items={communityData.pages}
		itemRenderer={(item, { handleClick, modifiers }) => {
			return (
				<button
					key={item.title}
					type="button"
					tabIndex={-1}
					onClick={handleClick}
					className={modifiers.active ? 'bp3-menu-item bp3-active' : 'bp3-menu-item'}
				>
					{item.title}
				</button>
			);
		}}
		itemListPredicate={(query, items) => {
			return items.filter((item) => {
				return fuzzysearch(query.toLowerCase(), item.title.toLowerCase());
			});
		}}
		onItemSelect={(item) => {
			onCollectionUpdate({
				pageId: item.id,
				collectionId: collection.id,
			});
		}}
		popoverProps={{ popoverClassName: 'bp3-minimal' }}
	>
		<Button
			minimal
			text={collection.page ? `Linked to: ${collection.page.title}` : 'Link to Page'}
			rightIcon="caret-down"
		/>
	</Select>
);

LinkedPageSelect.propTypes = propTypes;
export default LinkedPageSelect;
