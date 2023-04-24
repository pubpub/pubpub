import React from 'react';

require('./twoColumnFooter.scss');

type SmallPrint = {
	key: string;
	text: string;
};

type IconLink = {
	url: string;
	ariaLabel: string;
	pathProps?: {
		d: string;
		id?: string;
		fill?: string;
		fillRule?: 'evenodd' | 'nonzero' | 'inherit';
	};
};

type Link = {
	url: string;
	text: string;
};

export type TwoColumnFooterProps = {
	certification?: {
		url: string;
		alt: string;
		imageUrl: string;
	};
	copyright: {
		date: string;
		attribution: string;
		url: string;
		type: string;
		exception: string;
	};
	addressLines: string[];
	fullWidthLink: {
		url: string;
		path: string;
		text: string;
	};
	smallPrints: SmallPrint[];
	iconLinks: IconLink[];
	links: Link[];
};

const TwoColumnFooter = (props: TwoColumnFooterProps) => {
	const { copyright, addressLines, smallPrints, certification, iconLinks, links, fullWidthLink } =
		props;
	return (
		<div className="two-column-footer-component">
			<div className="left-column">
				<nav className="footer-navigation">
					<ul className="footer-navigation__list">
						{links.map((link) => (
							<li key={link.text} className="footer-navigation__list_item">
								<a href={link.url} className="footer-navigation__list_link">
									{link.text}
								</a>
							</li>
						))}
					</ul>
				</nav>
				<div className="social-links" aria-label="Social media links">
					<ul className="social-links__list">
						{iconLinks.map((link) => (
							<li key={link.ariaLabel} className="social-links__list_item">
								<a
									href={link.url}
									className="social-links__list_link"
									aria-label={link.ariaLabel}
								>
									<svg width="28" height="28">
										<path {...link.pathProps} />
									</svg>
								</a>
							</li>
						))}
					</ul>
				</div>
				<div className="fullWidthLink-wrapper">
					<a href={fullWidthLink.url} className="fullWidthLink">
						<svg width="20" height="20">
							<g
								id="Page-1"
								stroke="none"
								strokeWidth="1"
								fill="none"
								fillRule="evenodd"
							>
								<g id="github-logo-svg" fill="#000000">
									<path d={fullWidthLink.path} />
								</g>
							</g>
						</svg>
						<div className="fullWidthLink--text">{fullWidthLink.text}</div>
					</a>
				</div>
				{certification && (
					<div className="certification-wrapper">
						<a href={certification.url} className="certification-link">
							<img src={certification.imageUrl} alt={certification.alt} />
						</a>
					</div>
				)}
			</div>

			<div className="right-column">
				<div className="site-smallprint">
					{smallPrints.map((smallPrint) => (
						<small key={smallPrint.key}>{smallPrint.text}</small>
					))}
					<address>
						{addressLines.map((line, index) => (
							<>
								{line}
								{index < addressLines.length - 1 && <br />}
							</>
						))}
					</address>
				</div>

				<div className="site-smallprint">
					<small>
						© <time>{copyright.date}</time> {copyright.attribution} Subject to a{' '}
						<a
							href={copyright.url}
							rel="license"
							className="site-smallprint__copyright_link"
						>
							{copyright.type}
						</a>
						{copyright.exception}
					</small>
				</div>
			</div>
		</div>
	);
};

export default TwoColumnFooter;
