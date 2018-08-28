import React from 'react';
import PropTypes from 'prop-types';
import CommunityPreview from 'components/CommunityPreview/CommunityPreview';
import LandingFeature from 'components/LandingFeature/LandingFeature';
import PageWrapper from 'components/PageWrapper/PageWrapper';
import { hydrateWrapper, getResizedUrl } from 'utilities';

require('./newLanding.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	landingData: PropTypes.object.isRequired,
};

const Landing = (props)=> {
	const landingData = props.landingData;
	const features = [
		{
			title: 'Collaborative Editing',
			description: 'Edit documents in real-time with your team. Or, open your document to the public for large-scale collaboration.',
			icon: 'edit',
		},
		{
			title: 'Rich Media Documents',
			description: 'Embed videos, LaTeX equations, references, interactive frames, and more.',
			icon: 'media',
		},
		{
			title: 'Continuous, Structured Review',
			description: 'Invite reviewers before or after publication. Reviews can be made open to the public, or kept private.',
			icon: 'endorsed',
		},
		{
			title: 'Empowered Communities',
			description: 'Tools to help communities organize, publish, and disseminate their research. Keep your community small and close-knit, or open submissions to the public.',
			icon: 'globe',
		},
		{
			title: 'Dedicated to Longevity',
			description: 'We\'re focused on long-term stable solutions for authors, reviewers, and publishers. We care about business models that are good for research, rather than good for advertisers.',
			icon: 'time',
		},
		{
			title: 'Open Source',
			description: 'We operate in the open and all code is available. Add a new feature yourself, or fork the codebase entirely and host the platform independently.',
			icon: 'code',
		},
	];
	return (
		<div id="new-landing-container">
			<div className="header">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<nav>
								<img src="/static/logoWhite.png" alt="PubPub" />
								<span className="title">PubPub</span>
								<div className="spacer" />
								<a className="link">About</a>
								<a className="link">Features</a>
								<a className="link">Pricing</a>
								<a className="link">Contact</a>
								<span className="separator">·</span>
								<a className="link">Search</a>
								<a className="link">Signup or Login</a>
							</nav>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-12 content">
							<h1>Higher quality, more transparent publishing.</h1>
							<p>PubPub improves your content with community publishing, the collaborative process of drafting, review, and discussion that results in trusted, transparent documents with rich context, review maps, and group support. PubPub is the first community publishing platform.</p>
							<button className="pt-button pt-intent-primary pt-large">Join PubPub</button>
							<button className="pt-button pt-large">Create your Community</button>
							<img src="/static/hero.png" />
						</div>
					</div>
				</div>
			</div>
			<div className="bg0">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h2>For Communities of all types</h2>
							{/* Journals */}
							<div className="type-block">
								<div className="content">
									<div className="title">For Journals</div>
									<div className="description">Host and publish your open access journal, with one-click DOI creation, support for citations, equations, submissions, peer review, import and export, analytics, and more.</div>
									<button className="pt-button">Create your Community</button>
								</div>
								<div className="image"></div>
							</div>

							{/* Books */}
							<div className="type-block flipped">
								<div className="content">
									<div className="title">For Book Publishers</div>
									<div className="description">Publish beautiful digital editions of your books with bonus multimedia content, interactive discussions and annotations, and analytics to help you make smarter publishing decisions.</div>
									<button className="pt-button">Create your Community</button>
								</div>
								<div className="image"></div>
							</div>

							{/* Research Labs */}
							<div className="type-block">
								<div className="content">
									<div className="title">For Research Labs</div>
									<div className="description">Host your lab’s online presence in one place. Publicly post papers and citations, blogs, resources, and use private channels for lab notes and journal clubs.</div>
									<button className="pt-button">Create your Community</button>
								</div>
								<div className="image"></div>
							</div>

							{/* Conferences */}
							<div className="type-block flipped">
								<div className="content">
									<div className="title">For Conferences</div>
									<div className="description">Host your interactive conference website. Solicit and review submissions, publish accepted papers, post blogs and recaps, and encourage private and public conversation before and after your gathering.</div>
									<button className="pt-button">Create your Community</button>
								</div>
								<div className="image"></div>
							</div>
						</div>
					</div>
				</div>

			</div>
			<div className="bg1">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h2>For you!</h2>
							<p>PubPub is designed with flexibility in mind. If you’re a company or community that needs to collaboratively draft, review, edit and publish documents, we want to support you. </p>
							<button className="pt-button">Get in touch</button>
							<button className="pt-button">Explore the possibilities</button>
						</div>
					</div>
				</div>
			</div>
			<div className="bg2">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h2>Rich features for community publishing</h2>
							<p>Take control of your research. PubPub allows you to publish complex documents with and for your community, not arbitrary standards.</p>
							<div className="type-block">
								<ul className="content">
									<li>Real-time, collaborative writing and editing</li>
									<li>Rich media embeds like videos, photos, and tables</li>
									<li>Import and export MS Word, LaTex, XML, and more</li>
									<li>Citations, footnotes, and figures</li>
									<li>LaTex equation support</li>
									<li>One-click DOI creation</li>
									<li>Chapters and sections</li>
									<li>Public and private discussions</li>
									<li>Customizable review processes with review maps</li>
									<li>Beautiful, customizable page layouts</li>
									<li>Community permissions</li>
									<li>Version control</li>
									<li>SEO friendly</li>
									<li>Mobile Responsive</li>
								</ul>
								<div className="image"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg1">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h2>Free, open access, and open source</h2>
							<p>A member of MIT’s Knowledge Futures Groups, we are committed to providing PubPub for free forever, releasing open-source code, and operating under non-profit, researcher-friendly business models. We make money from donations and by charging for enterprise setup and features, not by charging for access or running ads.</p>
							<div>
								<button className="pt-button">PubPub Mission</button>	
							</div>
							<a>pubpub</a>
							<a>pubpub-editor</a>
							<a>review-maps</a>
						</div>
					</div>
				</div>
			</div>
			<div className="bg2">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<h2>Built with a growing, open communtiy</h2>
							<ul>
								<li>Travis</li>
								<li>Catherine</li>
								<li>Gabe</li>
								<li>SJ</li>
								<li>Amy Brand</li>
								<li>Joi Ito</li>
								<li>Jess Polka</li>
								<li>Andy Lippman</li>
								<li>Terry</li>
								<li>Joel</li>
								<li>Ed Finn</li>
								<li>Thomas</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<div className="footer">
				<div className="container">
					<div className="row">
						<div className="col-12">
							Footer content
						</div>
					</div>
				</div>
			</div>

		</div>
	);
};

Landing.propTypes = propTypes;
export default Landing;

hydrateWrapper(Landing);
