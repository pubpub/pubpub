import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types';
import { hydrateWrapper } from 'utilities';
import Icon from 'components/Icon/Icon';

require('./newLanding.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class Landing extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			landingHeader: 'Communities',
			landingHeaderToggle: true
		}
	}
	componentDidMount() {
		const landingHeaders = ['Journals', 'Publishers', 'Conferences', 'Researchers', 'Communities']
		let i = 0
		setInterval(() => {
			this.setState({
				landingHeader: landingHeaders[i],
				landingHeaderToggle: !this.state.landingHeaderToggle
			})
			i >= landingHeaders.length-1 ? i=0 : i++
			this.setState({
				landingHeaderToggle: !this.state.landingHeaderToggle
			})
		}, 4000)
	}
	render() {
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
									<a href="/new/about" className="link">About</a>
									<a href="/new/features" className="link">Features</a>
									<a href="/new/pricing" className="link">Pricing</a>
									<a href="/new/contact" className="link">Contact</a>
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
									<h1>
										<TransitionGroup className="landing-header" component='span'>
										<CSSTransition
											timeout={750}
											classNames="landing-header"
											appear={true}
											key={this.state.landingHeader}>
											<span className="landing-header">{this.state.landingHeader}</span>
										</CSSTransition>
										</TransitionGroup>
										&nbsp;use PubPub to make their research stronger.
									</h1>
								<p className="subtitle">Collaboratively research, draft, review, and publish in a single, integrated process – as it should be!</p>
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
								<h2>One PubPub, Any Community</h2>
								{/* Journals */}
								<div className="type-block">
									<div className="content">
										<div className="title">For Journals</div>
										<div className="description">Host and publish your entire journal on PubPub. Accept submissions, manage peer review, publish to the web with one-click DOI generation, export to print, and more.</div>
										<button className="pt-button">Create your Journal</button>
									</div>
									<div className="image pt-elevation-3"><img src="/static/jods.png" /></div>
								</div>

								{/* Books */}
								<div className="type-block flipped">
									<div className="content">
										<div className="title">For Book Publishers</div>
										<div className="description">Publish beautiful digital editions of your books on PubPub. Embed bonus multimedia content, include interactive discussions and annotations, and use analytics to make smarter publishing decisions.</div>
										<button className="pt-button">Create your Book</button>
									</div>
									<div className="image"></div>
								</div>

								{/* Research Labs */}
								<div className="type-block">
									<div className="content">
										<div className="title">For Research Labs</div>
										<div className="description">Host your lab’s online presence on PubPub. Publicly post papers and citations, publish a lab blog, host resources, and use private channels for lab notes and journal clubs.</div>
										<button className="pt-button">Create your Lab Site</button>
									</div>
									<div className="image"></div>
								</div>

								{/* Conferences */}
								<div className="type-block flipped">
									<div className="content">
										<div className="title">For Conferences</div>
										<div className="description">Host your interactive conference website on PubPub. Solicit and review submissions, publish accepted papers, post blogs and recaps, and encourage private and public conversation before and after your gathering.</div>
										<button className="pt-button">Create your Conference</button>
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
								<h2>For You!</h2>
								<p>We designed PubPub with flexibility in mind. Use every feature, or just the ones you need. If you’re a company or community that needs to collaboratively draft, review, edit and publish documents, we want to support you.</p>
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
								<h2>Rich Features for Community Publishing</h2>
								<p className="subtitle">Everything you need to write, review, publish, and discuss, all in one place.</p>
								<div className="type-block">
									<ul className="content">
										<li><Icon icon="edit" /> Real-time, collaborative writing and editing</li>
										<li><Icon icon="media" /> Rich media embeds like videos, photos, and tables</li>
										<li><Icon icon="changes" /> Import and export MS Word, LaTex, XML, and more</li>
										<li><Icon icon="citation" /> Add citations, footnotes, and figures</li>
										<li><Icon icon="function" /> Embed LaTex equations</li>
										<li><Icon icon="badge" /> Create DOIs in one click, for free</li>
										<li><Icon icon="book" />Include chapters and sections</li>
										<li><Icon icon="comment" /> Host public and private discussions and annotations</li>
										<li><Icon icon="shield" /> Manage submissions and peer review</li>
										<li><Icon icon="page-layout" /> Create beautiful, customizable, mobile-friendly page layouts</li>
										<li><Icon icon="people" /> Allow anyone to access your community, or just people you choose</li>
										<li><Icon icon="more" /> And much more. Full feature list coming soon.</li>
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
								<h2>Free, Open Access, and Open Source</h2>
								<p>A member of MIT’s <a href="https://mitpress.mit.edu/kfg" target="_blank">Knowledge Futures Group</a>, we are committed to providing PubPub for free forever, releasing open-source code, and operating under non-profit, researcher-friendly business models. We make money from donations and by charging for enterprise setup and features, not by charging for access or running ads.</p>
								<div>
									<button className="pt-button">PubPub Mission</button>
								</div>
								<div className="pubpub-links">
									<a><Icon icon="git-repo" /> pubpub</a>
									<a><Icon icon="git-repo" /> pubpub-editor</a>
									<a>review-maps</a>
								</div>
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
	}
};

Landing.propTypes = propTypes;
export default Landing;

hydrateWrapper(Landing);
