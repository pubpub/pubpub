import React from 'react';
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
	onClick?: (e: React.SyntheticEvent<MouseEvent>) => unknown;
};

const OverviewRowSkeleton = (props: Props) => {
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
	return (
		// This click handler is a convenience for mouse users; the same handler should be made
		// available in the rightElement (e.g. to disclose a Collection row)
		// eslint-disable-next-line jsx-a11y/no-static-element-interactions
		<div
			onClick={onClick}
			className={classNames(
				'overview-row-skeleton-component',
				withBorder && 'with-border',
				className,
			)}
		>
			<Icon icon={leftIcon} iconSize={iconSize} color={iconColor} />
			<div className="center-container">
				<a href={href} className="title">
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
};

export default OverviewRowSkeleton;
