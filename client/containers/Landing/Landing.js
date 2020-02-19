import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { GridWrapper, Icon, PageWrapper } from 'components';
import { hydrateWrapper } from 'utils';

require('./landing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
};

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			landingHeader: 'Communities',
		};
	}

	componentDidMount() {
		const landingHeaders = [
			'Journals',
			'Publishers',
			'Conferences',
			'Researchers',
			'Communities',
		];
		setInterval(() => {
			const currentIndex = landingHeaders.indexOf(this.state.landingHeader);
			const nextIndex = (currentIndex + 1) % landingHeaders.length;
			this.setState({
				landingHeader: landingHeaders[nextIndex],
			});
		}, 4000);
	}

	render() {
		const features = [
			{
				icon: 'badge',
				title: 'DOI Support',
				desc: 'Generate CrossRef DOIs for your documents in one click.',
			},
			{
				icon: 'shield',
				title: 'Submissions & Review',
				desc: 'Manage submissions and peer review right from within PubPub.',
			},
			{
				icon: 'comment',
				title: 'Discussions & Annotations',
				desc: 'Host public and private discussions with your readers and community.',
			},
			{
				icon: 'page-layout',
				title: 'Beautiful, Customizable Layouts',
				desc: 'Create your custom site without writing a line of code.',
			},
			{
				icon: 'book',
				title: 'Collection Metadata',
				desc:
					'Including article & collection-level metadata for easier organization of content.',
			},
			{
				icon: 'changes',
				title: 'Branches as versions',
				desc:
					'Work on multiple versions by spawning different branches and merging when ready.',
			},
			{
				icon: 'people',
				title: 'Access Control',
				desc: 'Allow anyone to access your community, or just the people you choose.',
			},
			{
				icon: 'lightbulb',
				title: 'Suggest a feature',
				desc:
					"We're constantly adding new features, and love hearing ideas from users like you.",
			},
		];
		const featureGrid = features.map((feature) => {
			return (
				<div className="feature">
					<Icon icon={feature.icon} className="icon" />
					<div className="description">
						<h4>{feature.title}</h4>
						<p>{feature.desc}</p>
					</div>
				</div>
			);
		});
		const communities = [
			{
				name: 'Harvard Data Science Review',
				description: 'A Microscopic, Telescopic & Kaleidoscopic View of Data Science',
				logo: '/static/landing/hdsr.png',
				type: 'Journal',
				category: 'Science',
			},
			{
				name: 'Harvard Data Science Review',
				description: 'A Microscopic, Telescopic & Kaleidoscopic View of Data Science',
				logo: '/static/landing/hdsr.png',
				type: 'Journal',
				category: 'Science',
			},
			{
				name: 'Harvard Data Science Review',
				description: 'A Microscopic, Telescopic & Kaleidoscopic View of Data Science',
				logo: '/static/landing/hdsr.png',
				type: 'Journal',
				category: 'Science',
			},
			{
				name: 'Harvard Data Science Review',
				description: 'A Microscopic, Telescopic & Kaleidoscopic View of Data Science',
				logo: '/static/landing/hdsr.png',
				type: 'Journal',
				category: 'Science',
			},
			{
				name: 'Harvard Data Science Review',
				description: 'A Microscopic, Telescopic & Kaleidoscopic View of Data Science',
				logo: '/static/landing/hdsr.png',
				type: 'Journal',
				category: 'Science',
			},
			{
				name: 'Harvard Data Science Review',
				description: 'A Microscopic, Telescopic & Kaleidoscopic View of Data Science',
				logo: '/static/landing/hdsr.png',
				type: 'Journal',
				category: 'Science',
			},
		];
		const communityGrid = communities.map((community) => {
			return (
				<div className="community">
					<div className="type">
						<strong>{community.type}</strong> / {community.category}
					</div>
					<h4 className="name">{community.name}</h4>
					<img className="logo" src={community.logo} alt={`Logo of ${community.name}`} />
					<p className="description">{community.description}</p>
				</div>
			);
		});
		return (
			<div id="landing-container">
				<PageWrapper
					loginData={this.props.loginData}
					communityData={this.props.communityData}
					locationData={this.props.locationData}
					hideNav={true}
				>
					{/* BEGIN Jumbotron */}
					<div id="jumbotron">
						{/* BEGIN Jumbotron Content */}
						<div className="container">
							<div className="row content">
								<div className="col-4">
									<h1>PubPub</h1>
									<p className="subtitle">
										The open-source, privacy-respecting, turnkey, all-in-one
										collaborative publishing platform for communities small and
										large.
									</p>
									<h2>Manage, evolve & perfect your publishing process</h2>
									<div className="buttons">
										{!this.props.loginData.id && (
											<a
												href="/signup"
												className="bp3-button bp3-intent-primary bp3-large"
											>
												Join PubPub
											</a>
										)}
										<a
											href="/community/create"
											className="bp3-button bp3-large"
										>
											Create your Community
										</a>
									</div>
								</div>
							</div>
						</div>
						{/* END Jumbotron Content */}
					</div>
					{/* END Jumbotron */}
					{/* BEGIN Main content */}
					<div id="main">
						{/* BEGIN Mission Block */}
						<div id="mission">
							<div className="container">
								<div className="left">
									<h3>Mission</h3>
								</div>
								<div>
									As part of the <strong>Knowledge Futures Group</strong>,  we’re
									committed to making PubPub not just open, but easily accessible
									to a wide range of groups. That means we’ve committed to
									providing a free version of PubPub forever, releasing
									open-source code, and operating under non-profit, sustainable,
									researcher-friendly business models.
								</div>
								<div>
									<h3>Open Source</h3>
								</div>
								<div className="right">
									<a className="git" href="https://github.com/pubpub/pubpub">
										<Icon icon="git-repo" /> pubpub
									</a>
									<a
										className="git"
										href="https://github.com/pubpub/pubpub-editor"
									>
										<Icon icon="git-repo" /> pubpub-editor
									</a>
								</div>
							</div>
						</div>
						{/* END Mission Block */}
						{/* BEGIN Features Block */}
						<div id="features">
							<div className="container">
								<div>
									<h3>Key Features</h3>
								</div>
							</div>
							<div className="container">
								<div>
									<p className="feature-number">01</p>
									<ul>
										<li>No emailing back and forth</li>
										<li>Live authoring updates</li>
										<li>Assign roles on-the-fly</li>
									</ul>
								</div>
								<div>
									<h4>Collaborate & edit with co-authors in real time</h4>
									<img
										src="/static/landing/authoring.png"
										alt="Screenshot of a PubPub editor interface with multiple users editing at the same time."
									/>
								</div>
								<div>
									<p className="feature-number">02</p>
									<ul>
										<li>Streamlined multi-file imports</li>
										<li>Complex-content friendly</li>
										<li>Markdown, Word and even LaTeX</li>
									</ul>
								</div>
								<div>
									<h4>Import your work from any source</h4>
									<img
										src="/static/landing/importing.png"
										alt="You can see multiple users editing at the same time."
									/>
								</div>
								<div>
									<p className="feature-number">03</p>
									<ul>
										<li>Data visualizations</li>
										<li>Images, videos, tables, and math</li>
										<li>Code, embedded interactives & more</li>
									</ul>
								</div>
								<div>
									<h4>Embed rich multimedia in your publication</h4>
									<img
										src="/static/landing/multimedia.png"
										alt="You can see multiple users editing at the same time."
									/>
								</div>
								<div className="other-features">
									<h3>Other Features</h3>
								</div>
								<div className="feature-grid">{featureGrid}</div>
							</div>
						</div>
						{/* END Features Block */}
						{/* BEGIN Case Study Block */}
						<div id="case-study">
							<div className="container">
								<div>
									<h3>Case Study</h3>
								</div>
								<div>
									<p>
										Learn how <strong>the MIT Press</strong> uses PubPub for
										collaborative community review.{' '}
									</p>
								</div>
							</div>
						</div>
						{/* END Case Study Block */}
						{/* BEGIN Communities Block */}
						<div id="communities">
							<div className="container">
								<div>
									<h3>Communities</h3>
								</div>
								<div>
									<p>
										Communities are groups focused on a particular topic, theme,
										or expertise. While their focus may be narrow, they invite
										perspective and contribution from all. You can start your
										own community (including your own private space!), or browse
										any of the existing communities:
									</p>
									<div className="community-grid">{communityGrid}</div>
								</div>
							</div>
						</div>
						{/* END Communities Block */}
						{/* BEGIN Create Block */}
						<div id="create">
							<div className="container">
								<div>
									<h3>Create</h3>
								</div>
								<div>
									<h4>Start experimenting today</h4>
									<button>Create your community</button>
									<p>
										* A community can be just your individual space to create
										content, or you can invite others to collaborate with you!
									</p>
								</div>
							</div>
						</div>
						{/* END Create Block */}
						{/* BEGIN Pitch Block */}
						<div id="pitch">
							<div className="container">
								<div>
									<p>
										With PubPub, one tool supports your entire publishing
										workflow, including • drafting the content • editorial
										review process • power to publish • and engaging the
										community to spark conversations around your content
										allowing you to work efficiently, flexibly, and
										collaboratively.
									</p>
								</div>
							</div>
						</div>
						{/* END Create Block */}
					</div>
					{/* END Main content */}
				</PageWrapper>
			</div>
		);
	}
}

Landing.propTypes = propTypes;
export default Landing;

hydrateWrapper(Landing);
