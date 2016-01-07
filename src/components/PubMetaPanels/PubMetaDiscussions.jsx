// import React, { PropTypes } from 'react';
// import Radium from 'radium';
// import PubDiscussionsItem from '../PubDiscussions/PubDiscussionsItem';
// import PubDiscussionsInput from '../PubDiscussions/PubDiscussionsInput';
// // import {globalStyles} from '../../utils/styleConstants';

// let styles = {};

// const PubMetaDiscussions = React.createClass({
// 	propTypes: {
// 		metaID: PropTypes.string,
// 		slug: PropTypes.string,
// 		discussionsData: PropTypes.array,
// 		addDiscussionHandler: PropTypes.func,
// 		addDiscussionStatus: PropTypes.string,
// 		activeSaveID: PropTypes.string,
// 		newDiscussionData: PropTypes.object,
// 		userThumbnail: PropTypes.string,
// 		handleVoteSubmit: PropTypes.func
// 	},

// 	getDefaultProps: function() {
// 		return {
// 			discussionsData: [],
// 		};
// 	},

// 	filterDiscussions: function(metaID) {
// 		function findDiscussionRoot(discussions, searchID) {
// 			for (let index = 0; index < discussions.length; index++) {
// 				if (discussions[index]._id === searchID) {
// 					return discussions[index];
// 				} else if (discussions[index].children && discussions[index].children.length) {
// 					return findDiscussionRoot(discussions[index].children, searchID);
// 				}
// 			}
// 		}

// 		return [findDiscussionRoot(this.props.discussionsData, metaID)];
// 	},

// 	render: function() {
// 		const discussionsData = this.props.metaID ? this.filterDiscussions(this.props.metaID) : this.props.discussionsData;
// 		return (
// 			<div style={styles.container}>

// 					{
// 						!this.props.metaID 
// 							? <PubDiscussionsInput 
// 								addDiscussionHandler={this.props.addDiscussionHandler}
// 								addDiscussionStatus={this.props.addDiscussionStatus} 
// 								newDiscussionData={this.props.newDiscussionData} 
// 								userThumbnail={this.props.userThumbnail} 
// 								activeSaveID={this.props.activeSaveID}
// 								saveID={'root'}
// 								isReply={false}
// 								codeMirrorID={'rootCommentInput'}/>
// 							: null
// 					}
					
// 					{
// 						discussionsData.map((discussion)=>{
// 							return (<PubDiscussionsItem 
// 								key={discussion._id}
// 								slug={this.props.slug}
// 								discussionItem={discussion}

// 								activeSaveID={this.props.activeSaveID}
// 								addDiscussionHandler={this.props.addDiscussionHandler}
// 								addDiscussionStatus={this.props.addDiscussionStatus} 
// 								newDiscussionData={this.props.newDiscussionData} 
// 								userThumbnail={this.props.userThumbnail} 
// 								handleVoteSubmit={this.props.handleVoteSubmit} />
// 							);
// 						})
// 					}
					
// 			</div>
// 		);
// 	}
// });

// export default Radium(PubMetaDiscussions);

// styles = {
// 	container: {
// 		padding: 15,
// 	},
// };
