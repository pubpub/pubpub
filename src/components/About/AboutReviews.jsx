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
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>Description of Reviews coming here.</p>

					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>Features of Reviews</h2>
						
					</div>
				</div>
				
			</div>
		);
	}

});


export default Radium(AboutReviews);
