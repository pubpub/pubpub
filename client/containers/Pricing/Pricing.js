import React from 'react';
import PropTypes from 'prop-types';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper } from 'utilities';

require('./pricing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

const Pricing = (props)=> {
	return (
		<div id="pricing-container">
			<PageWrapper
				loginData={props.loginData}
				communityData={props.communityData}
				locationData={props.locationData}
				hideNav={true}
			>
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h1>Pricing</h1>
							<div className="pricing-tiers">
								<div className="option pt-card pt-interactive">
									<h2>Community</h2>
									<p className="subtitle">Free, forever</p>
									<ul className="features">
										<li>All of PubPub's core drafting, review, publishing, and discussion features.</li>
										<li>Unlimited publications</li>
										<li>Your own pubpub.org domain name</li>
										<li>Publish with Creative Commons licenses</li>
										<li>Basic analytics</li>
										<li>Community support</li>
									</ul>
									<button className="pt-button pt-large">Create your Community</button>
								</div>
								<div className="option pt-card pt-interactive">
									<h2>Professional</h2>
									<p className="subtitle">Contact for pricing</p>
									<ul className="features">
										<li>All of PubPub's core drafting, review, publishing, and discussion features.</li>
										<li>Unlimited publications</li>
										<li><strong>Custom</strong> domain name</li>
										<li>Publish with <strong>any license</strong> you choose</li>
										<li><strong>Advanced</strong> analytics</li>
										<li><strong>E-mail</strong> support from the PubPub team</li>
										<li>Dashboard for managing multiple communities</li>
										<li>Free archive mode for inactive communities</li>
									</ul>
									<button className="pt-button pt-large">Get In Touch</button>
								</div>
								<div className="option pt-card pt-interactive">
									<h2>Full Service</h2>
									<p className="subtitle">Contact for pricing</p>
									<ul className="features">
										<li>Everything in PubPub Premium, including a custom domain, unlimited pubs, and advanced analytics.</li>
										<hr />
										<li>Dedicated, hands-on support for setting up and managing your community</li>
										<hr />
										<li>Production, editorial, marketing, and community management support.</li>
									</ul>
									<button className="pt-button pt-large">Get In Touch</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</PageWrapper>
		</div>
	);
};

Pricing.propTypes = propTypes;
export default Pricing;

hydrateWrapper(Pricing);
