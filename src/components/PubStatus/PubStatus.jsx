import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubStatus = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		pubStatus: PropTypes.string,
		featuredInList: PropTypes.array,
		submittedToList: PropTypes.array,
		isAuthor: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			featuredInList: [],
			submittedToList: [],
		};
	},

	render: function() {
		// const pubData = {featuredInList: [], submittedToList: []};
		return (
			<div style={styles.container}>
				
				<div className="pub-status-wrapper" style={rightBarStyles.sectionWrapper}>
					<div style={rightBarStyles.sectionHeader}><span style={styles.headerPrefix}>
							<FormattedMessage id="pub.Status" defaultMessage="Status"/>:{' '}
						</span> 
						{this.props.pubStatus === 'Draft' 
							? <FormattedMessage {...globalMessages.Draft} />
							: <FormattedMessage {...globalMessages.ReadyForPeerReview} />
						}
					</div>
					<div style={rightBarStyles.sectionSubHeader}>
						<Link to={'/pub/' + this.props.slug + '/journals'} style={globalStyles.link}>
							<div key={'statusButton1'} style={rightBarStyles.sectionSubHeaderSpan}>
								<FormattedMessage
									id="pub.featuredInX"
									defaultMessage="Featured in {number} Journals "
									values={{number: this.props.featuredInList.length || '0'}}/>
								<span style={styles.separator}>|</span>
								<FormattedMessage
									id="pub.submittedToX"
									defaultMessage="Submitted to {number} Journals "
									values={{number: this.props.submittedToList.length || '0'}}/>
							</div>
						</Link>
						{
							this.props.isAuthor 
								? <Link to={'/pub/' + this.props.slug + '/journals'} style={globalStyles.link}>
									<div key={'statusButton2'} style={rightBarStyles.sectionSubHeaderSpan}>
									<FormattedMessage id="pub.submitToNew" defaultMessage="Submit to New Journal"/>
									</div>
								</Link>
								: null
						}

					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(PubStatus);

styles = {
	headerPrefix: {
		paddingRight: 10,
	},
	separator: {
		padding: '0px 10px',
	},
};
