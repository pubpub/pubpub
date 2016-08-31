import React from 'react';
import Radium from 'radium';
// import {globalStyles} from 'utils/styleConstants';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';

import {styles} from './aboutStyles';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

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

						<h1>
							<FormattedMessage {...globalMessages.Reviews}/>
						</h1>
						<p style={[styles.headerSubtitle, styles.headerTextMax]}>
						</p>

						<p>
							<FormattedMessage id="about.ReviewsP2" defaultMessage="When reviewing science, it can often be hard to understand the methods, analysis, and results if operating purely on the author's description of these things. For this reason, PubPub is designed to give reviewers access to the data, code, and raw results of research in a way that makes it actionably reviewable."/>
						</p>
					</div>
				</div>

				<div>
					<div className={'section'}>
						<h2>
							<FormattedMessage id="about.ContributoryReviewH" defaultMessage="Contributory Review."/>
						</h2>
						<p>
							<FormattedMessage id="about.ContributoryReviewP1" defaultMessage="Allow reviewers to clone, edit, and publish embedded content, data, code."/>
						</p>
						<p>
							<FormattedMessage id="about.ContributoryReviewP2" defaultMessage="Reviews are open, show the productivity of your reviews."/>
						</p>
					</div>
				</div>
			</div>
		);
	}

});


export default Radium(AboutReviews);
