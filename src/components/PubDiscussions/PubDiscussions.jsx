import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';
import {rightBarStyles} from '../../containers/PubReader/rightBarStyles';
import PubDiscussionsItem from './PubDiscussionsItem';
import PubDiscussionsInput from './PubDiscussionsInput';

let styles = {};

const PubDiscussions = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		discussionsData: PropTypes.array,
		pHashes: PropTypes.object,
		expertsData: PropTypes.object,
		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object
	},

	getDefaultProps: function() {
		return {
			discussionsData: [],
			expertsData: {approved: []},
		};
	},

	render: function() {
		// const pubData = {discussions: []};
		return (
			<div style={styles.container}>
				
				<div className="pub-discussions-wrapper" style={rightBarStyles.sectionWrapper}>
					<div style={rightBarStyles.sectionHeader}>Discussions</div>
					<div style={rightBarStyles.sectionSubHeader}>
						<Link to={'/pub/' + this.props.slug + '/experts'} style={globalStyles.link}><span key={'discussionButton1'} style={rightBarStyles.sectionSubHeaderSpan}>View Experts ({this.props.expertsData.approved.length}) </span></Link>
						| 
						<Link to={'/pub/' + this.props.slug + '/experts'} style={globalStyles.link}><span key={'discussionButton2'} style={rightBarStyles.sectionSubHeaderSpan}>Suggest Expert</span></Link>
					</div>
					<PubDiscussionsInput 
						addDiscussionHandler={this.props.addDiscussionHandler}
						addDiscussionStatus={this.props.addDiscussionStatus} 
						newDiscussionData={this.props.newDiscussionData} />
					{
						this.props.discussionsData.map((discussion)=>{
							return (<PubDiscussionsItem 
								key={discussion._id} 
								pHashes={this.props.pHashes}
								discussionItem={discussion}/>
							);
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
