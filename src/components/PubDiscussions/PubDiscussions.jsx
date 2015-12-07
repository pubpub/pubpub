import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';
import {PubDiscussion} from './PubDiscussion';

let styles = {};

const PubDiscussions = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		discussionsData: PropTypes.array,
		expertsData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			discussionsData: [],
			expertsData: {approved: []},
		};
	},

	render: function() {
		const pubData = {discussions: []};
		return (
			<div style={styles.container}>
				
				<div className="pub-discussions-wrapper" style={rightBarStyles.sectionWrapper}>
					<div style={rightBarStyles.sectionHeader}>Discussions</div>
					<div style={rightBarStyles.sectionSubHeader}>
						<Link to={'/pub/' + this.props.slug + '/experts'} style={globalStyles.link}><span key={'discussionButton1'} style={rightBarStyles.sectionSubHeaderSpan}>View Experts ({this.props.expertsData.approved.length}) </span></Link>
						| 
						<Link to={'/pub/' + this.props.slug + '/experts'} style={globalStyles.link}><span key={'discussionButton2'} style={rightBarStyles.sectionSubHeaderSpan}>Suggest Expert</span></Link>
					</div>
					{
						pubData.discussions.map((discussion)=>{
							return <PubDiscussion key={discussion._id} discussionItem={discussion}/>;
						})
					}
				</div>
				
			</div>
		);
	}
});

export default Radium(PubDiscussions);

styles = {
	
};
