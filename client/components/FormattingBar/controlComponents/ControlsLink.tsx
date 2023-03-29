import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { moveToEndOfSelection } from 'components/Editor';
import { Button, AnchorButton, InputGroup, Checkbox, Icon } from '@blueprintjs/core';
import { usePubContext } from 'containers/Pub/pubHooks';
import { pubUrl } from 'utils/canonicalUrls';
import { usePageContext } from 'utils/hooks';

type Props = {
	editorChangeObject: {
		activeLink?: any;
		view?: any;
	};
	onClose: (...args: any[]) => any;
};

const ControlsLink = (props: Props) => {
	const {
		editorChangeObject: { activeLink, view },
		onClose,
	} = props;

	const { communityData } = usePageContext();
	const { inPub, pubData } = usePubContext();
	const [href, setHref] = useState(activeLink.attrs.href);
	// const [openInNewTab, setOpenInNewTab] = useState(true); // this must change mark attrs on link node
	const [debouncedHref] = useDebounce(href, 250);
	const inputRef = useRef();

	const setHashOrUrl = (value: string) => {
		if (inPub) {
			const basePubUrl = pubUrl(communityData, pubData);
			const hashMatches = value.match(`^${basePubUrl}(.*)?#(.*)$`);
			setHref(hashMatches ? `#${hashMatches[2]}` : value);
		}
		setHref(value);
	};

	// in actuality you would be updating mark attrs for the activeLink
	// const target = openInNewTab ? '_blank' : '_self';

	// check link to see mark attr for tyarget
	// derive check in check box from this
	// ex: if activeLink.attrs.target === _blank checked is true
	// useEffect(()=>{if(activeLink.attrs) }, [target])

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => activeLink.updateAttrs({ href: debouncedHref }), [debouncedHref]);

	useEffect(() => {
		// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
		if (inputRef.current && typeof inputRef.current.focus === 'function' && !href) {
			// @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
			inputRef.current.focus();
		}
	}, [href]);

	const restoreSelection = useCallback(() => {
		view.focus();
		moveToEndOfSelection(view);
	}, [view]);

	const handleKeyPress = (evt) => {
		if (evt.key === 'Enter') {
			activeLink.updateAttrs({ href });
			onClose();
			setTimeout(restoreSelection, 0);
		}
	};

	function ControlsLinkPopover() {
		return (
			<div>
				<Checkbox label="Open in new tab" checked={true} />
				<Checkbox label="Create a pub connection for this url" />
				<div>Type: connection type dropdown</div>
				<div>Direction: direction dropdown</div>
				<Icon icon="info-sign" /> Preview
			</div>
		);
	}

	return (
		<div className="controls-link-component" style={{ flexDirection: 'column' }}>
			<InputGroup
				placeholder="Enter a URL"
				value={href}
				onChange={(evt) => setHashOrUrl(evt.target.value)}
				onKeyPress={handleKeyPress}
				// @ts-expect-error ts-migrate(2322) FIXME: Type 'MutableRefObject<undefined>' is not assignab... Remove this comment to see the full error message
				inputRef={inputRef}
			/>
			<div>
				<AnchorButton small minimal title="Visit" icon="chevron-up" />
				<AnchorButton
					small
					minimal
					title="Optiona"
					icon="share"
					href={href}
					target="_blank"
					// target={target}
				/>
				<Button
					small
					minimal
					title="Remove"
					icon="disable"
					onClick={activeLink.removeLink}
				/>
			</div>
			<ControlsLinkPopover />
		</div>
	);
};

export default ControlsLink;
