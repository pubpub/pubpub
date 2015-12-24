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
		activeSaveID: PropTypes.string,
		newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,
		handleVoteSubmit: PropTypes.func,
		toggleHighlightsHandler: PropTypes.func,
		showPubHighlights: PropTypes.bool,
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
						{/* <Link to={'/pub/' + this.props.slug + '/experts'} style={globalStyles.link}><span key={'discussionButton1'} style={rightBarStyles.sectionSubHeaderSpan}>View Experts ({this.props.expertsData.approved.length}) </span></Link>
						| */}
						<Link to={'/pub/' + this.props.slug + '/invite'} style={globalStyles.link}><span key={'discussionButton2'} style={rightBarStyles.sectionSubHeaderSpan}>Invite Reviewers</span></Link>
						<span style={styles.optionSeparator}>|</span>
						<span style={styles.option} key={'discussions-highlight-toggle'} onClick={this.props.toggleHighlightsHandler}>Turn Highlights {this.props.showPubHighlights ? 'Off' : 'On'}</span>
					</div>
					<PubDiscussionsInput 
						addDiscussionHandler={this.props.addDiscussionHandler}
						addDiscussionStatus={this.props.addDiscussionStatus} 
						newDiscussionData={this.props.newDiscussionData} 
						userThumbnail={this.props.userThumbnail} 
						activeSaveID={this.props.activeSaveID}
						saveID={'root'}
						isReply={false}
						codeMirrorID={'rootCommentInput'}/>
					{
						this.props.discussionsData.map((discussion)=>{
							return (<PubDiscussionsItem 
								key={discussion._id}
								slug={this.props.slug}
								pHashes={this.props.pHashes}
								discussionItem={discussion}

								activeSaveID={this.props.activeSaveID}
								addDiscussionHandler={this.props.addDiscussionHandler}
								addDiscussionStatus={this.props.addDiscussionStatus} 
								newDiscussionData={this.props.newDiscussionData} 
								userThumbnail={this.props.userThumbnail} 
								handleVoteSubmit={this.props.handleVoteSubmit} />
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
	container: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0px 10px',
		},
	},
	option: {
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: '#000',
		}
	},
	optionSeparator: {
		padding: '0px 6px',
	},
};
