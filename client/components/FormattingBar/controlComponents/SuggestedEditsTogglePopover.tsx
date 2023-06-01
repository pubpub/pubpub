import React from 'react';

import { usePubContext } from 'client/containers/Pub/pubHooks';

require('./suggestedEditsTogglePopover.scss');

export const SuggestedEditsTogglePopover = () => {
	const { inPub } = usePubContext();

	if (!inPub) {
		return null;
	}

	return (
		<p className="suggested-edits-toggle-popover-component">
			While active, edits will create suggestions that must be resolved before publication.
		</p>
	);
};
