import React, { useEffect, useRef } from 'react';
import Popper from 'popper.js';

import { ClickToCopyButton } from 'components';
import { getLowestAncestorWithId } from 'client/utils/dom';
import { usePageContext } from 'utils/hooks';

import { usePubData } from '../../pubHooks';

export type HeaderPopoverProps = {
	locationData: any;
	element: any;
	mainContentRef: any;
};

const LinkPopover = (props: HeaderPopoverProps) => {
	const { element, mainContentRef, locationData } = props;
	const parent = getLowestAncestorWithId(element);
	const pubData = usePubData();
	const {
		scopeData: {
			activePermissions: { canManage },
		},
	} = usePageContext();
	const popoverRef = useRef<null | HTMLDivElement>(null);

	useEffect(() => {
		if (!parent) {
			return () => {};
		}

		const popperObject = new Popper(parent, popoverRef.current!, {
			placement: parent.matches('h1, h2, h3, h4, h5, h6') ? 'left' : 'left-start',
		});

		return () => {
			popperObject.destroy();
		};
	}, [parent, mainContentRef]);

	const unstableLink = Boolean(parent && /^r[0-9]*$/.test(parent.id));
	const beforeCopyPrompt =
		pubData.isReadOnly && unstableLink && canManage
			? 'You must create a new Release to link to this block.'
			: '';

	return (
		<div
			ref={popoverRef}
			style={{ position: 'absolute', top: '-9999px' }}
			className="click-to-copy"
		>
			<ClickToCopyButton
				copyString={`https://${locationData.hostname}${locationData.path}#${parent?.id}`}
				beforeCopyPrompt={beforeCopyPrompt}
				disabled={unstableLink}
			/>
		</div>
	);
};
export default LinkPopover;
