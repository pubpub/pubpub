import React from 'react';

import { GridWrapper, Icon, IconName } from 'components';

require('./twoColumnFooter.scss');

type TwoColumnFooterLink = {
	label: string;
	url?: string;
};

export type TwoColumnFooterProps = {
	communityData: any;
	leftItem: {
		title: string;
		image: string;
		url: string;
	};
	centerItems: {
		top: TwoColumnFooterLink[];
		bottom: TwoColumnFooterLink[];
	};
	rightItem: {
		label: string;
		url: string;
		icon: IconName;
	};
};

const TwoColumnFooter = (props: TwoColumnFooterProps) => {
	const { communityData } = props;
	const pubpubLogo =
		communityData.headerColorType === 'light'
			? '/static/logoBlack.svg'
			: '/static/logoWhite.svg';

	return (
		<div className="two-column-footer-component">
			<GridWrapper containerClassName="column-container">
				<div className="left-column">
					<a
						key={props.leftItem.title}
						area-label={props.leftItem.title}
						href={props.leftItem.url}
					>
						<img alt={`${props.leftItem.title} logo`} src={props.leftItem.image} />
					</a>
				</div>
				<div className="center-column">
					<ul className="top-row">
						{props.centerItems.top.map((item: TwoColumnFooterLink) => (
							<li key={item.label}>
								<a href={item.url}>{item.label}</a>
							</li>
						))}
					</ul>
					<div className="bottom-row">
						{props.centerItems.bottom.map((item: TwoColumnFooterLink) => (
							<span key={item.label}>{item.label}</span>
						))}
						<span className="built-on">
							Published with
							<img className="logo" src={pubpubLogo} alt="PubPub logo" />
						</span>
					</div>
				</div>
				<div className="right-column">
					<a
						className="icon"
						aria-label={props.rightItem.label}
						href={props.rightItem.url}
					>
						<Icon icon={props.rightItem.icon} iconSize={22} />
					</a>
				</div>
			</GridWrapper>
		</div>
	);
};

export default TwoColumnFooter;
