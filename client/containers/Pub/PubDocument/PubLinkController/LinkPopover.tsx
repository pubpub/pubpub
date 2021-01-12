import React, { useEffect, useRef } from 'react';
import Popper from 'popper.js';

import { ClickToCopyButton } from 'components';
import { getLowestAncestorWithId } from 'client/utils/dom';
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

	return (
		<div
			ref={popoverRef}
			style={{ position: 'absolute', top: '-9999px' }}
			className="click-to-copy"
		>
			<ClickToCopyButton
				copyString={`https://${locationData.hostname}${locationData.path}#${parent?.id}`}
				beforeCopyPrompt={
					pubData.isReadOnly && unstableLink
						? 'You must create a new release to link to this block.'
						: ''
				}
				disabled={unstableLink}
			/>
		</div>
	);
};
export default LinkPopover;
