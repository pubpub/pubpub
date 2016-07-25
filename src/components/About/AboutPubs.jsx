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

				<div className={'lightest-bg'}>
					<div className={'section'}>

						<h1>Pubs</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>Description of Pubs coming here.</p>
						<Link style={globalStyles.link} to={'/signup'}><div className={'button'} style={styles.headerButton}>Create Pub</div></Link>

					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Features of Pubs</h2>
						
					</div>
				</div>
				
			</div>
		);
	}

});


export default Radium(AboutJournals);
