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
				icon: 'edit',
				title: 'Collaborative Editor',
				desc: 'Draft with colleagues around the world in real-time.',
			},
			{
				icon: 'media',
				title: 'Rich Media Embeds',
				desc: 'Add videos, photos, tables, and interactives to your publications.',
			},
			{
				icon: 'changes',
				title: 'Import & Export',
				desc: 'Support for MS Word, LaTex, XML, ePub, and more.',
			},
			{
				icon: 'citation',
				title: 'Citation Management',
				desc: 'Easily add and manage citations, footnotes, and figure notes.',
			},
			{
				icon: 'function',
				title: 'Equation Editor',
				desc: 'Embed and edit LaTex equations right in your documents.',
			},
			{
				icon: 'badge',
				title: 'DOI Support',
				desc: 'Generate CrossRef DOIs for your documents in one click, for free.',
			},
			{
				icon: 'book',
				title: 'Chapters & Sections',
				desc: 'Break long documents into browsable chapters and sections.',
			},
			{
				icon: 'comment',
				title: 'Discussions & Annotations',
				desc: 'Host public and private discussions with your readers and community.',
			},
			{
				icon: 'shield',
				title: 'Submissions & Review',
				desc: 'Manage submissions and peer review right from within PubPub.',
			},
			{
				icon: 'page-layout',
				title: 'Beautiful Layouts',
				desc:
					'Host your entire site on PubPub with customizable, mobile-friendly page layouts.',
			},
			{
				icon: 'people',
				title: 'Access Levels',
				desc: 'Allow anyone to access your community, or just the people you choose.',
			},
			{
				icon: 'lightbulb',
				title: 'More To Come',
				desc:
					"We're constantly adding new features, and love hearing ideas from users like you.",
			},
		];
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
								<div className="right">
									As part of the <strong>Knowledge Futures Group</strong>, we’re
									committed to making PubPub not just open, but easily accessible
									to a wide range of groups. That means we’ve committed to
									providing a free version of PubPub forever, releasing
									open-source code, and operating under non-profit, sustainable,
									researcher-friendly business models.
								</div>
								<div className="left">
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
							</div>
							<div className="container">
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
							</div>
						</div>
						{/* END Features Block */}
						{/* BEGIN Case Study Block */}
						{/* END Case Study Block */}
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
