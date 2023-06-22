import React from 'react';
import { Callout } from '@blueprintjs/core';

import { PopoverButton } from 'components';
import { hasSuggestions } from 'client/utils/suggestedEdits';
import { pubData } from 'utils/storybook/data';
import { usePageContext } from 'utils/hooks';

import Download from './Download';
import { usePubContext } from '../pubHooks';
import SmallHeaderButton from './SmallHeaderButton';

const PopoverContent = () => {
	return (
		<Callout className="text-info" intent="warning">
			You still have pending edits. Resolve your edits before downloading this Pub.
		</Callout>
	);
};

const ConditionalWrapper = ({ condition, wrapper, children }) =>
	condition ? wrapper(children) : children;

const DowloadButton = () => {
	const { featureFlags } = usePageContext();
	const { collabData } = usePubContext();
	const { editorChangeObject } = collabData;
	return (
		<ConditionalWrapper
			condition={hasSuggestions(editorChangeObject) && featureFlags.suggestedEdits}
			wrapper={(children) => (
				<PopoverButton
					component={() => <PopoverContent />}
					className="pub-header-popover"
					aria-label="Download this Pub"
				>
					{children}
				</PopoverButton>
			)}
		>
			{hasSuggestions(editorChangeObject) && featureFlags.suggestedEdits ? (
				<SmallHeaderButton label="Download" labelPosition="left" icon="download2" />
			) : (
				<Download pubData={pubData}>
					<SmallHeaderButton label="Download" labelPosition="left" icon="download2" />
				</Download>
			)}
		</ConditionalWrapper>
	);
};

export default DowloadButton;
