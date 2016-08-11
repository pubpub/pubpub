import React from 'react';
import Radium from 'radium';
// import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {styles} from './aboutStyles';

export const AboutReviews = React.createClass({

	render: function() {
		const metaData = {
			title: 'Reviews · PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className={'lightest-bg'}>
					<div className={'section'}>

						<h1>Reviews</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>Reviews in PubPub are open, iterative, and contributory.</p>

						<p>When reviewing science, it can often be hard to understand the methods, analysis, and results if operating purely on the author's description of these things. For this reason, PubPub is designed to give reviewers access to the data, code, and raw results of research in a way that makes it actionably reviewable. </p>


					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Contributory Review</h2>
						<p>Allow reviewers to clone, edit, and publish embedded content, data, code.</p>
						<p>Reviews are open, show the productivity of your reviews.</p>
						
					</div>
				</div>
				
			</div>
		);
	}

});


export default Radium(AboutReviews);
