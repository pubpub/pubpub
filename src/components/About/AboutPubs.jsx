import React from 'react';
import Radium from 'radium';
// import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';
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

						<p>Pubs can be documents, datasets, images, videos, Jupyter notebooks, interactive visualizations, etc.
							If it can be rendered on the web, it can be a Pub. Allowing it to be published, versioned, cited, and shared.</p>
						<p>The goal PubPub is to allow research and scientific exploration to be documented in full fidelity. Publishing should not be a lossy snapshot, but rather a rich and ongoing conversation.</p>

					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Collaborative Evolution</h2>
						<p>Pubs feature rich inline discussions and a transparent review process.</p>
						<p>Versioned history encourages a mindset of incremental development rather than opaque publication.</p>
						<p>Documents are a special type of Pub that allow for real-time collaborative editing and embedding of other pubs (images, videos, data, etc).</p>
					</div>
				</div>

				<div className={'lightest-bg'}>
					<div className={'section'}>
						<h2>Process over Impact</h2>
						<p>Ideas don't come out of a vacuum. They exist in a network of other ideas, findings, and beliefs.</p>
						<p>Some of these ideas go on to win Nobel prizes, but all of these ideas contribute to the culture and progress of science. Therefore, we believe it is critical to reward the process of good science and research, rather than the outcome or impact.</p>
						<p>PubPub encourages the documentation of research results as they happen so that they can be embedded, cited, or referenced when it comes time to publish your findings.</p>
						<p>A powerful transclusion model makes it easy to trace context and attribution.</p>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>For Researchers, By Researchers</h2>
						<p>PubPub is open-source and dedicated to serving as a public utility for scientific communication.</p>
						<p>If there are features, pub types, or data that enables you to better perform research, we strongly encourage you to submit a feature request, contribute code to PubPub, or fork the project and build it to your own specifications.</p>
					</div>
				</div>
	
				
			</div>
		);
	}

});


export default Radium(AboutPubs);
