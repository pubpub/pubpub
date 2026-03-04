import React, { useCallback, useState } from 'react';

import './defangedLink.scss';

import { Popover, Position } from '@blueprintjs/core';

type ClickedLink = {
	href: string;
	rect: DOMRect;
};

type Props = {
	children: React.ReactNode;
};

const DefangedLinkPopover = ({ children }: Props) => {
	const [clicked, setClicked] = useState<ClickedLink | null>(null);

	const handleClick = useCallback((evt: React.MouseEvent) => {
		const target = (evt.target as HTMLElement).closest('.defanged-link');
		if (!target) return;
		evt.preventDefault();
		evt.stopPropagation();
		const href = target.getAttribute('data-href') ?? '';
		setClicked({ href, rect: target.getBoundingClientRect() });
	}, []);

	const handleClose = useCallback(() => setClicked(null), []);

	return (
		<div onClick={handleClick}>
			{children}
			{clicked && (
				<Popover
					isOpen
					onClose={handleClose}
					minimal
					position={Position.TOP}
					// placement="bottom-start"
					content={
						<div className="defanged-link-popover-content">
							<p className="defanged-link-popover-notice">
								We no longer allow links in comments. This comment was made before
								the policy went into effect.
							</p>
							<p className="defanged-link-popover-notice">It pointed to:</p>
							<code className="defanged-link-popover-url">{clicked.href}</code>
						</div>
					}
				>
					<span
						style={{
							position: 'fixed',
							left: clicked.rect.left,
							top: clicked.rect.bottom,
							width: 1,
							height: 1,
							pointerEvents: 'none',
						}}
					/>
				</Popover>
			)}
		</div>
	);
};

export default DefangedLinkPopover;
