import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const GroupMain = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			groupData: {
				pubs: [],
			},
		};
	},

	authorString: function(pub) {
		if (pub.authors) {
			let output = 'by ';
			for (let index = pub.authors.length; index--;) {
				output += pub.authors[index].name;
				if (index !== 0) {
					output += ', ';
				}
			}
			return output;	
		}
		let output = 'by ';
		for (let index = pub.collaborators.canEdit.length; index--;) {
			output += pub.collaborators.canEdit[index].name;
			if (index !== 0) {
				output += ', ';
			}
		}
		return output;	
		
	},

	render: function() {
		// console.log(this.props.groupData);

		return (
			<div style={styles.container}>
				{this.props.groupData.pubs.length === 0
					? <div style={styles.noPubsWrapper}>
						<div style={styles.noPubsText}>No pubs shared with this group yet</div>
					</div>

					: this.props.groupData.pubs.map((pub, index)=>{
						const discussionsList = pub.discussions.length ? pub.discussions : pub.editorComments;
						const linkPath = pub.lastUpdated ? '/pub/' + pub.slug : '/pub/' + pub.slug + '/draft';
						// console.log(discussionsList);
						return (
							<Link to={linkPath} style={globalStyles.link} key={'pubItemLink-' + index}>
							<div style={styles.pubItem} key={'pubItem-' + index}>
								<div>
									<span style={styles.pubTitle}>{pub.title}</span>
									<span style={styles.pubAuthor}>{this.authorString(pub)}</span>
								</div>

								<div style={styles.pubDetail}>{dateFormat(pub.lastUpdated, 'mmm dd, yyyy')}</div>
								<div style={styles.separator}>|</div>
								<div style={styles.pubDetail}>{pub.discussions ? pub.discussions.length : 0} comments</div>

								<div style={styles.pubAbstract}>
									{pub.abstract.length > 200 
										? pub.abstract.substring(0, 200).trim() + '...'
										: pub.abstract
									}
								</div>
								
								
								{discussionsList.length
									? <div>
										<div style={styles.commentTitle}>
											<span>Latest Comment: </span>
											{discussionsList[discussionsList.length - 1].author.name} 
											<span> on </span>
											{dateFormat(discussionsList[discussionsList.length - 1].postDate, 'mmm dd, yyyy h:MMTT')}
										</div>
										<div style={styles.commentWrapper}>
											{/* <div style={styles.commentHeader}>
												{discussionsList[discussionsList.length - 1].author.name} 
												<span> on </span>
												{dateFormat(discussionsList[discussionsList.length - 1].postDate, ''mmm dd, yyyy', h:MMTT')}
											</div> */}
											<div style={styles.commentText}>
												{discussionsList[discussionsList.length - 1].markdown.replace(/\[\[(.*)\]\]/g, '').length > 100 
													? discussionsList[discussionsList.length - 1].markdown.replace(/\[\[(.*)\]\]/g, '').substring(0, 100).trim() + '...'
													: discussionsList[discussionsList.length - 1].markdown.replace(/\[\[(.*)\]\]/g, '')
												}
											</div>
										</div>
									</div>
									: null
								}
								
							</div>
							</Link>
						);
					})
				}
			</div>
		);
	}
});

export default Radium(GroupMain);

styles = {
	noPubsWrapper: {
		margin: '20px auto',
		width: '60%',
		backgroundColor: '#eee',
		textAlign: 'center',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			margin: '40px auto',
			width: '80%',
		}
	},
	noPubsText: {
		fontSize: '20px',
		padding: '30px 0px',
		color: '#555',
	},
	pubItem: {
		width: 'calc(80% - 20px)',
		margin: '0px auto',
		padding: '20px 10px',
		borderBottom: '1px solid #ccc',
		':hover': {
			cursor: 'pointer',
			backgroundColor: '#F5F5F5',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(95% - 20px)',
		}
	},
	pubTitle: {
		fontSize: '20px',
		color: '#222',
		// display: 'inline-block',
		paddingRight: '20px',
	},
	pubAuthor: {
		fontSize: '15px',
		color: '#999',
		// display: 'inline-block',
	},
	pubAbstract: {
		fontSize: '14px',
		color: '#555',
		padding: '5px 0px 20px 0px',
		fontFamily: 'Lora',
	},
	pubDetail: {
		fontStyle: 'italic',
		fontSize: '14px',
		color: '#999',
		display: 'inline-block'
	},
	separator: {
		padding: '0px 10px',
		fontSize: '14px',
		color: '#999',
		display: 'inline-block'
	},

	commentTitle: {
		marginLeft: '20px',
		marginBottom: '5px',
		color: '#555',
		fontSize: '14px',
	},
	commentWrapper: {
		marginLeft: '20px',
		borderLeft: '2px solid #ccc',
		paddingLeft: '20px',
		color: '#555',
		fontSize: '14px',
	},
	commentHeader: {
		
	},
	commentText: {
		fontFamily: 'Lora',

	},
};
