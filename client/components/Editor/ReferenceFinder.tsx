import React, { useCallback, useMemo } from 'react';
import { Menu, MenuItem } from '@blueprintjs/core';

import SuggestionManager, {
	SuggestionManagerSuggesting,
} from 'client/utils/suggestions/suggestionManager';

import { buildLabel, NodeReference } from './utils';

require('./referenceFinder.scss');

export type ReferenceFinderProps = {
	blockNames: { [key: string]: string };
	suggestionManager: SuggestionManagerSuggesting<NodeReference>;
};

const ReferenceFinder = (props: ReferenceFinderProps) => {
	const { blockNames, suggestionManager } = props;
	const {
		state: { items },
	} = suggestionManager;
	const onItemSelect = useCallback((reference: NodeReference) => {
		suggestionManager.select(reference);
	}, []);
	const active = SuggestionManager.getSelectedValue(suggestionManager);
	const menuItems = useMemo(
		() =>
			items.map((reference) => (
				<MenuItem
					key={reference.node.attrs.id}
					onClick={() => onItemSelect(reference)}
					icon={reference.icon}
					text={buildLabel(reference.node, blockNames[reference.node.type.name])}
					active={reference === active}
				/>
			)),
		[items],
	);

	return (
		<Menu className="reference-finder-component bp3-elevation-1">
			{menuItems.length > 0 ? menuItems : <MenuItem text="No references found" disabled />}
		</Menu>
	);
};

export default ReferenceFinder;
