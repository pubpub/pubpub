import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {styles} from './aboutStyles';

export const AboutPubs = React.createClass({

	render() {
		const metaData = {
			title: 'Pubs · PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h1>Pubs</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>PubPub is a network of digitally native publications called Pubs. </p>
						<p>
							Publishing shouldn't be a lossy compression, but static PDFs are tedious to compile, 
							obscure their own development, and capture only shallow snapshots of their context.
							Pubs are a modern type of document designed for everyone and built in the 21st century. 
						</p>
						<Link style={globalStyles.link} to={'/signup'}><div className={'button'} style={styles.headerButton}>Sign Up</div></Link>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Collaborative Evolution</h2>
						<p>
							Pubs feature real-time collaborative editing, rich inline discussions, and a transparent review process.
							Versioned history encourages a mindset of incremental development rather than opaque publication.
						</p>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>Dynamic Media</h2>
						<p>
							It's the 21st century.
							Pubs emphasize interactive visualization, direct manipulation, and live execution.
							Everything is open source and designed to be extensible.
						</p>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Collaborative Evolution</h2>
						<p>
							Pubs feature real-time collaborative editing, rich inline discussions, and a transparent review process.
							Versioned history encourages a mindset of incremental development rather than opaque publication.
						</p>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>Dynamic Media</h2>
						<p>
							It's the 21st century.
							Pubs emphasize interactive visualization, direct manipulation, and live execution.
							Everything is open source and designed to be extensible.
						</p>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Idea-oriented Documents</h2>
						<p>
							Ideas don't come out of a vacuum.
							Pubs can embed other pubs, reference replies, and share media.
							A powerful transclusion model makes it easy to trace context and attribution.
						</p>
					</div>
				</div>
	
			</div>
		);
	}

});


export default Radium(AboutPubs);
