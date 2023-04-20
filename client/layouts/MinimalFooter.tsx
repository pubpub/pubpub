import React from 'react';

import { GridWrapper, Icon, IconName } from 'components';
import { usePageContext } from 'utils/hooks';

require('./minimalFooter.scss');

type MinimalFooterLink = {
	label: string;
	url?: string;
};

export type MinimalFooterProps = {
	leftItem: {
		title: string;
		image: string;
		url: string;
	};
	centerItems: {
		top: MinimalFooterLink[];
		bottom: MinimalFooterLink[];
	};
	rightItem: {
		label: string;
		url: string;
		icon: IconName;
	};
};

const MinimalFooter = (props: MinimalFooterProps) => {
	const { communityData } = usePageContext();
	const pubpubLogo =
		communityData.headerColorType === 'light'
			? '/static/logoBlack.svg'
			: '/static/logoWhite.svg';

	return (
		<div className="minimal-footer-component" style={{ color: 'white !important' }}>
			<GridWrapper>
				<div className="left">
					<a
						key={props.leftItem.title}
						area-label={props.leftItem.title}
						href={props.leftItem.url}
					>
						<img alt="" src={props.leftItem.image} />
					</a>
				</div>
				<div className="center">
					<div className="top">
						{props.centerItems.top.map((item: MinimalFooterLink) => (
							<a key={item.label} href={item.url}>
								{item.label}
							</a>
						))}
					</div>
					<div className="bottom">
						{props.centerItems.bottom.map((item: MinimalFooterLink) => (
							<React.Fragment key={item.label}>{item.label}</React.Fragment>
						))}
						<>
							Published with
							<img className="logo" src={pubpubLogo} alt="PubPub logo" />
						</>
					</div>
				</div>
				<div className="right">
					<a aria-label={props.rightItem.label} href={props.rightItem.url}>
						<Icon icon={props.rightItem.icon} iconSize={22} />
					</a>
				</div>
			</GridWrapper>
		</div>
	);
};

export default MinimalFooter;
