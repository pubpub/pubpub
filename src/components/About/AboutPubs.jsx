import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {PreviewCard} from 'components';

import {styles as aboutStyles} from './aboutStyles';
let styles = {};

export const AboutPubs = React.createClass({

	render() {
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
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>PubPub is a network of digitally native publications called Pubs. </p>

						<p>Pubs can be documents, datasets, images, videos, Jupyter notebooks, interactive visualizations, etc.
							If it can be rendered on the web, it can be a Pub. Allowing it to be published, versioned, cited, and shared.</p>
						<p>The goal PubPub is to allow research and scientific exploration to be documented in full fidelity. Publishing should not be a lossy snapshot, but rather a rich and ongoing conversation.</p>

					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2 style={styles.noMargin}>Collaborative Evolution</h2>
						<div style={[styles.aboutPubText, styles.aboutPubRight]}>
							<p>Pubs feature rich inline discussions and a transparent review process.</p>
							<p>Versioned history encourages a mindset of incremental development rather than opaque publication.</p>
							<p>Documents are a special type of Pub that allow for real-time collaborative editing and embedding of other pubs (images, videos, data, etc).</p>
						</div>
						<img style={[styles.aboutPubImage, styles.aboutPubLeft]} src={'https://assets.pubpub.org/_site/thread.png'} alt={'PubPub features rich discussion'}/>
						<div style={globalStyles.clearFix}></div>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2 style={styles.noMargin}>Process over Impact</h2>
						<div style={[styles.aboutPubText, styles.aboutPubLeft]}>
							<p>Ideas don't come out of a vacuum. They exist in a network of other ideas, findings, and beliefs.</p>
							<p>Some of these ideas go on to win Nobel prizes, but all of these ideas contribute to the culture and progress of science. Therefore, we believe it is critical to reward the process of good science and research, rather than the outcome or impact.</p>
							<p>PubPub encourages the documentation of research results as they happen so that they can be embedded, cited, or referenced when it comes time to publish your findings.</p>
							<p>A powerful transclusion model makes it easy to trace context and attribution.</p>
						</div>
						<img style={[styles.aboutPubImage, styles.aboutPubRight]} src={'https://assets.pubpub.org/_site/pub.gif'} alt={'PubPub versions and citations'}/>
						<div style={globalStyles.clearFix}></div>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2 style={styles.noMargin}>For Researchers, By Researchers</h2>
						<div style={[styles.aboutPubText, styles.aboutPubRight]}>
							<p>PubPub is <a href="https://github.com/pubpub/pubpub">open-source</a> and dedicated to serving as a public utility for scientific communication.</p>
							<p>If there are features, pub types, or data that enables you to better perform research, we strongly encourage you to <a href="https://github.com/pubpub/pubpub/issues/new">submit a feature request</a>, <a href="https://github.com/pubpub/pubpub/blob/master/CONTRIBUTING.md">contribute code to PubPub</a>, or fork the project and build it to your own specifications.</p>
						</div>
						<img style={[styles.aboutPubImage, styles.aboutPubLeft]} src={'https://assets.pubpub.org/_site/github.png'} alt={'PubPub on GitHub'}/>
						<div style={globalStyles.clearFix}></div>
					</div>
				</div>
				
				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>Featured Pubs</h2>

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

styles = {
	...aboutStyles,
	noMargin: {
		margin: 0
	},
	aboutPubText: {
		width: '50%',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
		}
	},
	aboutPubImage: {
		width: 'calc(50% - 50px)',
		boxShadow: '0px 0px 5px #808284',
		marginTop: '20px',
		marginBottom: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			margin: '2em 0em',
		}
	},
	aboutPubLeft: {
		marginLeft: 0,
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
		}
	},
	aboutPubRight: {
		marginRight: 0,
		float: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
		}
	},
};

export default Radium(AboutPubs);
