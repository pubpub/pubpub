import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
// import {PubGallery} from '../';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
// import { Link } from 'react-router';
// const HoverLink = Radium(Link);

// import {globalMessages} from '../../utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const LandingComponentRecentList = React.createClass({
	propTypes: {
		style: PropTypes.object,
		recentPubs: PropTypes.array,
		
	},

	authorString: function(authors) {
		let output = 'by ';
		for (let index = authors.length; index--;) {
			output += authors[index].name;
			if (index !== 0) {
				output += ', ';
			}
		}
		return output;
	},

	render: function() {		
		this.props.recentPubs.sort(function(pubA, pubB) { 
			return new Date(pubB.lastUpdated).getTime() - new Date(pubA.lastUpdated).getTime();
		});

		return (
			<div style={[styles.container, this.props.style]}>

				{this.props.recentPubs.length
					// ? <PubGallery pubs={this.props.recentPubs} />
					? <div>
						{
							this.props.recentPubs.map((pub, index)=>{
								return (
									<Link to={'/pub/' + pub.slug} style={globalStyles.link} key={'pubItemLink-' + index}>
									<div style={styles.pubItem} key={'pubItem-' + index}>
										<div style={styles.pubTitle}>{pub.title}</div>
										<div style={styles.pubAuthor}>{this.authorString(pub.authors)}</div>

										<div></div>

										<div style={styles.pubDetail}>{dateFormat(pub.lastUpdated, 'mmm dd, yyyy')}</div>
										<div style={styles.separator}>|</div>
										<div style={styles.pubDetail}>{pub.discussions ? pub.discussions.length : 0} comment{pub.discussions && pub.discussions.length === 1 ? '' : 's'}</div>

										<div style={styles.pubAbstract}>
											{pub.abstract.length > 200 
												? pub.abstract.substring(0, 200).trim() + '...'
												: pub.abstract
											}
										</div>
										
										
										{pub.discussions && pub.discussions.length
											? <div>
												<div style={styles.commentTitle}>
													<span>Latest Comment: </span>
													{pub.discussions[pub.discussions.length - 1].author.name} 
													<span> on </span>
													{dateFormat(pub.discussions[pub.discussions.length - 1].postDate, 'mmm dd, yyyy h:MMTT')}
												</div>
												<div style={styles.commentWrapper}>
													{/* <div style={styles.commentHeader}>
														{pub.discussions[pub.discussions.length - 1].author.name} 
														<span> on </span>
														{dateFormat(pub.discussions[pub.discussions.length - 1].postDate, 'mm/dd/yy, h:MMTT')}
													</div> */}
													<div style={styles.commentText}>
														{pub.discussions[pub.discussions.length - 1].markdown.replace(/\[\[(.*)\]\]/g, '').length > 100 
															? pub.discussions[pub.discussions.length - 1].markdown.replace(/\[\[(.*)\]\]/g, '').substring(0, 100).trim() + '...'
															: pub.discussions[pub.discussions.length - 1].markdown.replace(/\[\[(.*)\]\]/g, '')
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
					: <div style={styles.noPubsWrapper}>
						<div style={styles.noPubsText}>No pubs featured yet</div>
					</div>
				}
				
			</div>
		);
	}
});

export default Radium(LandingComponentRecentList);

styles = {
	container: {
		width: 'calc(100% - 60px)',
		padding: '10px 30px',
		// backgroundColor: 'transparent',
		color: '#888',
	},
	noPubsWrapper: {
		margin: '20px auto',
		width: '60%',
		backgroundColor: '#eee',
		textAlign: 'center',
	},
	noPubsText: {
		fontSize: '20px',
		padding: '30px 0px',
		color: '#555',
	},
	pubItem: {
		width: 'calc(100% - 20px)',
		margin: '0px auto',
		padding: '20px 10px',
		borderBottom: '1px solid #ccc',
		':hover': {
			cursor: 'pointer',
			backgroundColor: '#F5F5F5',
		}
	},
	pubTitle: {
		fontSize: '20px',
		color: '#222',
		display: 'inline-block',
		paddingRight: '20px',
	},
	pubAuthor: {
		fontSize: '15px',
		color: '#999',
		display: 'inline-block',
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
