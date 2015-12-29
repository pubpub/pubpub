import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';

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
					<div style={rightBarStyles.sectionHeader}><span style={styles.headerPrefix}>Status:</span> {this.props.pubStatus === 'Draft' ? 'Draft' : 'Peer-Review Ready'}</div>
					<div style={rightBarStyles.sectionSubHeader}>
						<Link to={'/pub/' + this.props.slug + '/journals'} style={globalStyles.link}>
							<div key={'statusButton1'} style={rightBarStyles.sectionSubHeaderSpan}>
								Featured in {this.props.featuredInList.length} Journals 
								|
								Submitted to {this.props.submittedToList.length} Journals
							</div>
						</Link>
						{
							this.props.isAuthor 
								? <Link to={'/pub/' + this.props.slug + '/journals'} style={globalStyles.link}>
									<div key={'statusButton2'} style={rightBarStyles.sectionSubHeaderSpan}>
										Submit to New Journal
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
};
