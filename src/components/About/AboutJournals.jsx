import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {styles} from './aboutStyles';

export const AboutJournals = React.createClass({

	render: function() {
		const metaData = {
			title: 'Journals · PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className={'lightest-bg'}>
					<div className={'section'}>

						<h1>Journals</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>Description of Journals coming here.</p>
						<Link style={globalStyles.link} to={'/journals/create'}><div className={'button'} style={styles.headerButton}>Create Journal</div></Link>

					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Features of Journals</h2>
						
					</div>
				</div>
				
			</div>
		);
	}

});


export default Radium(AboutJournals);
