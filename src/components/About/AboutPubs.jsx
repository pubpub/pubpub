import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {styles} from './aboutStyles';

export const AboutJournals = React.createClass({

	render: function() {
		const metaData = {
			title: 'Pubs · PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={styles.section}>

						<h1 style={[styles.headerTitle, styles.headerTextMax]}>Pubs</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.</p>
						<Link style={globalStyles.link} to={'/signup'}><div className={'button'} style={styles.headerButton}>Create Pub</div></Link>

					</div>
				</div>

				<div style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Made with PubPub</h2>
						
					</div>
				</div>
				
			</div>
		);
	}

});


export default Radium(AboutJournals);
