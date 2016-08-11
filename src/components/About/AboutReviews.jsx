import React from 'react';
import Radium from 'radium';
<<<<<<< Updated upstream
// import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';
=======
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
>>>>>>> Stashed changes
import Helmet from 'react-helmet';

import {styles} from './aboutStyles';

<<<<<<< Updated upstream
export const AboutReviews = React.createClass({
=======
export const AboutJournals = React.createClass({
>>>>>>> Stashed changes

	render: function() {
		const metaData = {
			title: 'Reviews · PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

<<<<<<< Updated upstream
				<div className={'lightest-bg'}>
					<div className={'section'}>

						<h1>Reviews</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>Reviews in PubPub are open, iterative, and contributory.</p>

						<p>When reviewing science, it can often be hard to understand the methods, analysis, and results if operating purely on the author's description of these things. For this reason, PubPub is designed to give reviewers access to the data, code, and raw results of research in a way that makes it actionably reviewable. </p>

=======
				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={styles.section}>

						<h1 style={[styles.headerTitle, styles.headerTextMax]}>Reviews</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.</p>
>>>>>>> Stashed changes

					</div>
				</div>

<<<<<<< Updated upstream
				<div>
					<div className={'section'}>
						<h2>Contributory Review</h2>
						<p>Allow reviewers to clone, edit, and publish embedded content, data, code.</p>
						<p>Reviews are open, show the productivity of your reviews.</p>
=======
				<div style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Made with PubPub</h2>
>>>>>>> Stashed changes
						
					</div>
				</div>
				
			</div>
		);
	}

});


<<<<<<< Updated upstream
export default Radium(AboutReviews);
=======
export default Radium(AboutJournals);
>>>>>>> Stashed changes
