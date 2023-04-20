import React from 'react';

// import { GridWrapper, Icon, IconName } from 'components';
import { IconName } from 'components';
import { iconPaths } from './twoColumnFooterData';

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
	console.log({ props });
	return (
		<div className="two-column-footer-component">
			<div className="site-footer__container">
				<div className="grid-cell">
					<nav className="footer-navigation">
						<ul className="footer-navigation__list">
							<li className="footer-navigation__list_item">
								<a href="/about" className="footer-navigation__list_link">
									About
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/jobs" className="footer-navigation__list_link">
									Jobs
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a
									href="/who-we-work-with"
									className="footer-navigation__list_link"
								>
									Who we work with
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/alerts" className="footer-navigation__list_link">
									Alerts
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/contact" className="footer-navigation__list_link">
									Contact
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/terms" className="footer-navigation__list_link">
									Terms and conditions
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/privacy" className="footer-navigation__list_link">
									Privacy notice
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/inside-elife" className="footer-navigation__list_link">
									Inside eLife
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/archive/2023" className="footer-navigation__list_link">
									Monthly archive
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/for-the-press" className="footer-navigation__list_link">
									For the press
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a href="/resources" className="footer-navigation__list_link">
									Resources
								</a>
							</li>
							<li className="footer-navigation__list_item">
								<a
									href="http://developers.elifesciences.org"
									className="footer-navigation__list_link"
								>
									XML and Data
								</a>
							</li>
						</ul>
					</nav>

					<div
						className="social-links"
						aria-label="Social media links for eLife Sciences"
					>
						<ul className="social-links__list">
							<li className="social-links__list_item">
								<a
									href="https://twitter.com/elife"
									className="social-links__list_link"
									aria-label="Twitter"
								>
									<svg width="28" height="28">
										<path
											d={iconPaths.twitter}
											id="Path"
											fill="#000000"
											fillRule="nonzero"
										/>
									</svg>
								</a>
							</li>
							<li className="social-links__list_item">
								<a
									href="https://www.facebook.com/elifesciences"
									className="social-links__list_link"
									aria-label="Facebook"
								>
									<svg width="28" height="28">
										<path d={iconPaths.facebook} id="Fill-1" fill="#0A0B09" />
									</svg>
								</a>
							</li>
							<li className="social-links__list_item">
								<a
									href="https://www.instagram.com/elifesciences/"
									className="social-links__list_link"
									aria-label="Instagram"
								>
									<svg width="28" height="28">
										<path
											d={iconPaths.instagram}
											id="Shape"
											fill="#212121"
											fillRule="nonzero"
										/>
									</svg>
								</a>
							</li>
							<li className="social-links__list_item">
								<a
									href="https://www.youtube.com/channel/UCNEHLtAc_JPI84xW8V4XWyw"
									className="social-links__list_link"
									aria-label="YouTube"
								>
									<svg width="28" height="28">
										<path
											d={iconPaths.youtube}
											id="Combined-Shape"
											fill="#222321"
										/>
									</svg>
								</a>
							</li>
							<li className="social-links__list_item">
								<a
									href="https://www.linkedin.com/company/elife-sciences-publications-ltd"
									className="social-links__list_link"
									aria-label="LinkedIn"
								>
									<svg width="28" height="28">
										<path
											d={iconPaths.linkedin}
											id="Path_2520"
											fill="#212121"
											fillRule="nonzero"
										/>
									</svg>
								</a>
							</li>
							<li className="social-links__list_item">
								<a
									rel="me"
									href="https://fediscience.org/@eLife"
									className="social-links__list_link"
									aria-label="Mastodon"
								>
									<svg width="28px" height="28px">
										<g
											id="Artboard"
											stroke="none"
											strokeWidth="1"
											fill="none"
											fillRule="evenodd"
										>
											<g
												id="Group-7"
												transform="translate(3.000000, 2.000000)"
												fill="#212121"
												fillRule="nonzero"
											>
												<g id="mastodon-24px-black">
													<path
														d={iconPaths.mastodon}
														id="Combined-Shape"
													/>
												</g>
											</g>
										</g>
									</svg>
								</a>
							</li>
						</ul>
					</div>

					<div className="github-link-wrapper">
						<a href="https://github.com/elifesciences" className="github-link">
							<svg width="20" height="20">
								<g
									id="Page-1"
									stroke="none"
									strokeWidth="1"
									fill="none"
									fillRule="evenodd"
								>
									<g id="github-logo-svg" fill="#000000">
										<path d={iconPaths.github} id="Fill-51" />
									</g>
								</g>
							</svg>
							<div className="github-link--text">Find us on GitHub</div>
						</a>
					</div>

					<div className="carbon-neutral-wrapper">
						<a
							href="https://positiveplanet.uk/company-dashboards/elife-sciences/"
							className="carbon-neutral-link"
						>
							<img
								src="/assets/patterns/img/patterns/molecules/carbon-neutral.706efe6d.svg"
								alt="Positive Planet - Certified Carbon Neutral"
							/>
						</a>
					</div>
				</div>

				<div className="grid-cell">
					<div className="site-smallprint">
						<small>
							eLife is a non-profit organisation inspired by research funders and led
							by scientists. Our mission is to help scientists accelerate discovery by
							operating a platform for research communication that encourages and
							recognises the most responsible behaviours in science.
						</small>
						<small>
							eLife Sciences Publications, Ltd is a limited liability non-profit
							non-stock corporation incorporated in the State of Delaware, USA, with
							company number 5030732, and is registered in the UK with company number
							FC030576 and branch number BR015634 at the address:
						</small>

						<address>
							eLife Sciences Publications, Ltd
							<br />
							Westbrook Centre, Milton Road
							<br />
							Cambridge CB4 1YG
							<br />
							UK
						</address>
					</div>

					<div className="site-smallprint">
						<small>
							© <time>2023</time> eLife Sciences Publications Ltd.Subject to a{' '}
							<a
								href="https://creativecommons.org/licenses/by/4.0/"
								rel="license"
								className="site-smallprint__copyright_link"
							>
								Creative Commons Attribution license
							</a>
							, except where otherwise noted.ISSN: &nbsp; 2050-084X
						</small>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TwoColumnFooter;
