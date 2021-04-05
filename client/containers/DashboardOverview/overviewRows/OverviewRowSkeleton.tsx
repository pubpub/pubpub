import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';

import { Icon, IconName } from 'client/components';

import { iconColor, iconSize } from './constants';

require('./overviewRowSkeleton.scss');

type Props = {
	className?: string;
	href: string;
	leftIcon: IconName;
	title: React.ReactNode;
	byline?: React.ReactNode;
	rightElement?: React.ReactNode;
	iconLabelPairs: { icon: IconName; label: React.ReactNode }[];
	withBorder?: boolean;
	onClick?: React.MouseEventHandler<any>;
};

const OverviewRowSkeleton = React.forwardRef((props: Props, ref: any) => {
	const {
		className,
		leftIcon,
		iconLabelPairs,
		title,
		byline,
		rightElement = null,
		withBorder = true,
		onClick,
		href,
	} = props;
	const centerContainerRef = useRef<null | HTMLDivElement>(null);

	const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
		// Disable text selection on double-click of text-free areas
		if (e.target === centerContainerRef.current) {
			e.preventDefault();
		}
	}, []);

	const handleClickTitle = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
		e.stopPropagation();
	}, []);

	return (
		// This click handler is a convenience for mouse users; the same handler should be made
		// available in the rightElement (e.g. to disclose a Collection row)
		// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
		<div
			onClick={onClick}
			ref={ref}
			onMouseDown={handleMouseDown}
			role="listitem"
			className={classNames(
				'overview-row-skeleton-component',
				withBorder && 'with-border',
				className,
			)}
		>
			<Icon icon={leftIcon} iconSize={iconSize} color={iconColor} />
			<div className="center-container" ref={centerContainerRef}>
				<a href={href} className="title" onClick={handleClickTitle}>
					{title}
				</a>
				{byline && <div className="byline">{byline}</div>}
				<div className="summary-icons">
					{iconLabelPairs.map(({ icon, label }, index) => {
						const iconElement =
							typeof icon === 'string' ? <Icon icon={icon} iconSize={12} /> : icon;
						return (
							// eslint-disable-next-line react/no-array-index-key
							<div className="summary-icon-pair" key={index}>
								{iconElement}
								{label}
							</div>
						);
					})}
				</div>
			</div>
			{rightElement}
		</div>
	);
});

export default OverviewRowSkeleton;
