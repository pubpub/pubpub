import React from 'react';
import PropTypes from 'prop-types';

import { GridWrapper, PageWrapper } from 'components';
import { hydrateWrapper } from 'utils';

require('./pricing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Pricing = (props) => {
	return (
		<div id="pricing-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
				hideNav={true}
				hideFooter={true}
			>
				<GridWrapper>
					<h1>Pricing</h1>
					<p>
						PubPub's goal is to provide a high-quality, institution-owned, hosted
						alternative to commercial publishing software. We're committed to giving
						anyone the ability to start a community and publish without limitations for
						free. For organizations who need advanced features (or just want to support
						our mission), we offer paid options designed to scale to meet the needs of
						any organization.
					</p>
					<div className="pricing-tiers">
						<div className="option bp3-card bp3-elevation-1">
							<h2>Free</h2>
							<p className="subtitle">Free, forever</p>
							<ul className="features">
								<li>
									All of PubPub&apos;s core drafting, review, publishing, and
									discussion features
								</li>
								<li>Your own pubpub.org subdomain</li>
								<li>Publish with select CC licenses</li>
								<li>Unlimited publications</li>
								<li>1 PubPub Community</li>
								<li>
									Community support on our{` `}
									<a
										href="https://discourse.knowledgefutures.org"
										target="_blank"
										rel="noopener noreferrer"
									>
										Discourse forums
									</a>
								</li>
							</ul>
							<a
								href="/community/create"
								className="bp3-button bp3-large bp3-intent-primary"
							>
								Create your Community
							</a>
						</div>
						<div className="option bp3-card bp3-elevation-1">
							<h2>Team</h2>
							<p className="subtitle">Yearly Fee Per Active Admin</p>
							<ul className="features">
								<li>
									All of PubPub&apos;s core drafting, review, publishing, and
									discussion features
								</li>
								<li>Your own custom domain name</li>
								<li>Publish with any license</li>
								<li>Unlimited publications</li>
								<li>1 PubPub Community</li>
								<li>Email support</li>
							</ul>
							<a
								href="mailto:team@pubpub.org?subject=PubPub%20Team%20Inquiry"
								target="_blank"
								rel="noopener noreferrer"
								className="bp3-button bp3-large bp3-intent-primary"
							>
								Get In Touch
							</a>
						</div>
						<div className="option bp3-card bp3-elevation-1">
							<h2>Organization</h2>
							<p className="subtitle">Yearly Fee Per Active Admin</p>
							<ul className="features">
								<li>
									All of PubPub&apos;s core drafting, review, publishing, and
									discussion features
								</li>
								<li>Your own custom domain name</li>
								<li>Publish with any license</li>
								<li>Unlimited publications</li>
								<li>Unlimited PubPub Communities</li>
								<li>Dedicated support</li>
								<li>Organization Dashboard for managing multiple Communities</li>
								<li>
									Organization Landing Page for displaying all of the content and
									Communities in your organization
								</li>
								<li>Service-Level Agreement</li>
							</ul>
							<a
								href="mailto:team@pubpub.org?subject=PubPub%20Organization%20Inquiry"
								target="_blank"
								rel="noopener noreferrer"
								className="bp3-button bp3-large bp3-intent-primary"
							>
								Get In Touch
							</a>
						</div>
					</div>
					<p>
						We also provide article production, community design and setup, and training
						workshops for communities of any size. If you're interested in these
						services,{` `}
						<a href="mailto:team@pubpub.org?subject=Additional%20Services">
							feel free to get in touch
						</a>
						.
					</p>
				</GridWrapper>
			</PageWrapper>
		</div>
	);
};

Pricing.propTypes = propTypes;
export default Pricing;

hydrateWrapper(Pricing);
