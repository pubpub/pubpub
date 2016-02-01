import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import dateFormat from 'dateformat';

let styles = {};

const LandingComponentCollectionList = React.createClass({
	propTypes: {
		style: PropTypes.object,
		collections: PropTypes.array,
		selectCollections: PropTypes.array,
	},

	getInitialState() {
		return {
			activeIndex: 0,
			collections: [],
		};
	},
	
	componentWillMount() {
		const collections = this.props.collections;
		const collectionObject = {};
		for (let index = collections.length; index--;) {
			collectionObject[collections[index].slug] = collections[index];
		}

		const newCollections = this.props.selectCollections
			? this.props.selectCollections.map((collectionName)=>{
				return collectionObject[collectionName];
			})
			: [];

		const maxSize = 3;
		this.setState({collections: newCollections.slice(0, maxSize)});
	},

	setActiveIndex: function(index) {
		return ()=>{
			this.setState({activeIndex: index});
		};
		
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
		
		return (this.state.collections.length
			? <div style={[styles.container, this.props.style]}>
				{this.state.collections.length
					? <div style={styles.leftColumn}>
						<Link to={'/collection/' + this.state.collections[this.state.activeIndex].slug} style={globalStyles.link}>
							<div style={styles.leftHeader}>{this.state.collections[this.state.activeIndex].title}</div>
							<div style={styles.leftText}>{this.state.collections[this.state.activeIndex].description}</div>
						</Link>
					</div>
					: null
				}
				

				<div style={styles.rightColumn}>
					<div style={styles.rightHeader}>
						{
							this.state.collections.map((collection, index)=>{
								return <div key={'rightHeaderItem-' + collection.slug} style={[styles.rightHeaderItem, this.state.activeIndex === index && styles.rightHeaderItemActive]} onClick={this.setActiveIndex(index)}>{collection.title}</div>;
							})
						}
						<div style={globalStyles.clearFix}></div>
					</div>

					{
						this.state.collections[this.state.activeIndex] && this.state.collections[this.state.activeIndex].pubs.map((pub, index)=>{
							return (
								<Link to={'/pub/' + pub.slug} style={globalStyles.link} key={'pubItemLink-' + index}>
								<div style={styles.pubItem} key={'pubItem-' + index}>
									<div style={styles.pubTitle}>{pub.title}</div>
									<div style={styles.pubAuthor}>{this.authorString(pub.authors)}</div>

									<div></div>

									<div style={styles.pubDetail}>{dateFormat(pub.lastUpdated, 'mm/dd/yy')}</div>
									<div style={styles.separator}>|</div>
									<div style={styles.pubDetail}>{pub.discussions ? pub.discussions.length : 0} comments</div>

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
												{dateFormat(pub.discussions[pub.discussions.length - 1].postDate, 'mm/dd/yy, h:MMTT')}
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
				<div style={globalStyles.clearFix}></div>
			</div>
			: <div style={styles.noCollectionsWrapper}>
				<div style={styles.noCollectionsText}>No collections featured yet</div>
			</div>
		
		);
	}
});

export default Radium(LandingComponentCollectionList);

styles = {
	container: {
		
	},
	noCollectionsWrapper: {
		margin: '20px auto',
		width: '60%',
		backgroundColor: '#eee',
		textAlign: 'center',
	},
	noCollectionsText: {
		fontSize: '20px',
		padding: '30px 0px',
		color: '#555',
	},
	leftColumn: {
		width: 200,
		paddingRight: '20px',
		float: 'left',
		'@media screen and (min-resolution:3dppx), screen and (max-width:767px)': {
			width: '100%',
			float: 'none',
		}
	},
	leftHeader: {
		fontSize: '25px',
		paddingBottom: '10px',
	},
	leftText: {
		fontSize: '16px',
		marginBottom: '30px',
	},
	rightColumn: {
		width: 'calc(100% - 240px)',
		float: 'left',
		paddingLeft: '20px',
		'@media screen and (min-resolution:3dppx), screen and (max-width:767px)': {
			width: '100%',
			paddingLeft: '0px',
			float: 'none',
		}
	},
	rightHeader: {
		width: '100%',
		borderBottom: '1px solid #999',
		marginBottom: '10px',
	},
	rightHeaderItem: {
		float: 'left',
		width: '33%',
		textAlign: 'center',
		color: '#999',
		padding: '8px 0px',
		':hover': {
			color: '#222',
			cursor: 'pointer',
		},
	},
	rightHeaderItemActive: {
		color: '#222',
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
