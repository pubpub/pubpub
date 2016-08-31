import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {PreviewCard} from 'components';

import {styles} from './aboutStyles';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage, formatMessage} from 'react-intl';

export const AboutPubs = React.createClass({

	render() {
		console.log(formatMessage(globalMessages.Reviews));

		const metaData = {
			title: 'Pubs · PubPub',
		};

		const featuredContent = [
			{
				slug: 'designandscience',
				title: 'Design and Science',
				previewImage: 'https://jake.pubpub.org/unsafe/100x100/https://assets.pubpub.org/ezmruszq/1470268609181.jpg',
				description: 'Can design advance science, and can science advance design?'
			},
			{
				slug: 'direct-radio-introspection',
				title: 'Against the Law: Countering Lawful Abuses of Digital Surveillance',
				previewImage: 'https://assets.pubpub.org/ggyuwams/1470270014688.jpg',
				description: 'Front-line journalists are high-value targets, and their enemies will spare no expense to silence them. Unfortunately, journalists can be betrayed by their own tools.'
			},
			{
				slug: 'design-as-participation',
				title: 'Design as Participation',
				previewImage: 'https://jake.pubpub.org/unsafe/100x100/https://assets.pubpub.org/kqrdhoxs/1470268781373.jpg',
				description: 'A consideration of design as a form of participation in complex adaptive systems.'
			},


			{
				slug: 'enlightenment-to-entanglement',
				title: 'The Enlightenment is Dead, Long Live the Entanglement',
				previewImage: 'https://jake.pubpub.org/unsafe/100x100/https://assets.pubpub.org/luiwqids/1470268727436.jpg',
				description: 'We humans are changing. We have become so intertwined with what we have created that we are no longer separate from it.'
			},
			{
				slug: 'cannibalism_by_a_barred_owl',
				title: 'Cannibalism by a Barred Owl',
				previewImage: 'https://assets.pubpub.org/sqjisolp/1470270304869.jpg',
				description: 'Front-line journalists are high-value targets, and their enemies will spare no expense to silence them. Unfortunately, journalists can be betrayed by their own tools.'
			},
			{
				slug: 'ageofentanglement',
				title: 'Age of Entanglement',
				previewImage: 'https://jake.pubpub.org/unsafe/100x100/https://assets.pubpub.org/ekdigesq/1470269089657.jpg',
				description: 'An inaugural essay for the Journal of Design and Science (JoDS)'
			},

		];

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className={'lightest-bg'}>
					<div className={'section'}>

						<h1>Pubs</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>
							<FormattedMessage id="about.PubsP1" defaultMessage="PubPub is a network of digitally native publications called Pubs."/>
						</p>
						<p>
							<FormattedMessage id="about.PubsP2" defaultMessage="If it can be rendered on the web, it can be a Pub. Allowing it to be published, versioned, cited, and shared."/>
						</p>
						<p>
							<FormattedMessage id="about.PubsP3" defaultMessage="The goal PubPub is to allow research and scientific exploration to be documented in full fidelity. Publishing should not be a lossy snapshot, but rather a rich and ongoing conversation."/>
						</p>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<div style={[styles.forWhoBlock]}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h2 style={styles.noMargin}>
									<FormattedMessage id="about.CollaborativeEvolutionH" defaultMessage="Collaborative Evolution"/>
								</h2>
								<p>
									<FormattedMessage id="about.CollaborativeEvolutionP1" defaultMessage="Pubs feature rich inline discussions and a transparent review process."/>

								</p>
								<p>
									<FormattedMessage id="about.CollaborativeEvolutionP2" defaultMessage="Versioned history encourages a mindset of incremental development rather than opaque publication."/>
								</p>
								<p>
									<FormattedMessage id="about.CollaborativeEvolutionP3" defaultMessage="Documents are a special type of Pub that allow for real-time collaborative editing and embedding of other pubs (images, videos, data, etc)."/>
								</p>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://assets.pubpub.org/_site/thread.png'} alt={'PubPub features rich discussion'}/>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<div style={[styles.forWhoBlock]}>
							<div style={[styles.forWhoText, styles.forWhoLeft]}>
								<h2 style={styles.noMargin}>
									<FormattedMessage id="about.ProcessOverImpactH" defaultMessage="Process over Impact"/>

								</h2>
								<p>
									<FormattedMessage id="about.ProcessOverImpactP1" defaultMessage="Ideas don't come from a vacuum. They exist in a network of other ideas, findings, and beliefs.Some of these ideas go on to win Nobel prizes, but all of these ideas contribute to the culture and progress of science."/>

								</p>
								<p>
									<FormattedMessage id="about.ProcessOverImpactP2" defaultMessage="We believe it is critical to reward the process of good science and research, rather than the outcome or impact."/>

								</p>
								<p>
									<FormattedMessage id="about.ProcessOverImpactP3" defaultMessage="PubPub encourages the documentation of research results as they happen so that they can be embedded, cited, or referenced when it comes time to publish your findings."/>
								</p>
								<p>
									<FormattedMessage id="about.ProcessOverImpactP4" defaultMessage="A powerful transclusion model makes it easy to trace context and attribution."/>
								</p>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoRight]} src={'https://assets.pubpub.org/_site/pub.gif'} alt={'PubPub versions and citations'}/>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<div style={[styles.forWhoBlock]}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h2 style={styles.noMargin}>
									<FormattedMessage id="about.ForResearchersH" defaultMessage="For Researchers, By Researchers"/>

								</h2>
								<p>
									<FormattedMessage
											id="about.ForResearchersP1"
											defaultMessage={`PubPub is {opensource} and dedicated to serving as a public utility for scientific communication.`}
											values={{opensource: <a style={{color: 'inherit'}} href="https://github.com/pubpub/pubpub">open-source</a>}}
									/>
								</p>
								<p>
									<FormattedMessage
											id="about.ForResearchersP2"
											defaultMessage={`If there are features, pub types, or data that enables you to better perform research, we strongly encourage you to {pr}, {code}, or fork the project and build it to your own specifications.`}
											values={{pr: <a style={{color: 'inherit'}} href="https://github.com/pubpub/pubpub/issues/new">submit a feature request</a>, code: <a style={{color: 'inherit'}} href="https://github.com/pubpub/pubpub/blob/master/CONTRIBUTING.md">contribute code to PubPub</a>}}
									/>

							</p>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://assets.pubpub.org/_site/github.png'} alt={'PubPub on GitHub'}/>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>
							<FormattedMessage id="about.FeaturedPubsH" defaultMessage="Featured Pubs"/>
						</h2>

						{featuredContent.map((item, index)=>{
							return (
								<div style={[item.inactive && styles.inactive]} key={'submitted-' + index}>
									<PreviewCard
										type={'atom'}
										image={item.previewImage}
										title={item.title}
										slug={item.slug}
										description={item.description} />
								</div>
							);
						})}

					</div>
				</div>

			</div>
		);
	}

});

export default Radium(AboutPubs);
