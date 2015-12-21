import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';

let styles = {};

const LandingComponentCollectionList = React.createClass({
	propTypes: {
		style: PropTypes.object,
		pubList: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			pubList: [
				{
					title: 'Human Health by Austin Burt',
					abstract: 'Insect/human disease transmission. Technology assessment for control of human diseases such as malaria, dengue, and trypanosomiasis: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.',
					author: 'Sam on Dec 19 at 4:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 18
				},
				{
					title: 'Conservation by Caroline Leitschuh',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Sam on Dec 12 at 12:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 34
				},
				{
					title: 'Agricultural Production by Max Scott',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Sam on Dec 21 at 4:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 15
				},
				{
					title: 'Gene Drive Capabilities by Kevin Esvelt',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Sam on Nov 19 at 8:17PM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 4
				},
				{
					title: 'Skeletal Systems Map by Todd Kuiken',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Devin on Dec 12 at 9:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 98
				},
				{
					title: 'Human Health by Austin Burt',
					abstract: 'Insect/human disease transmission. Technology assessment for control of human diseases such as malaria, dengue, and trypanosomiasis: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.',
					author: 'Sam on Dec 19 at 4:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 18
				},
				{
					title: 'Conservation by Caroline Leitschuh',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Sam on Dec 12 at 12:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 34
				},
				{
					title: 'Agricultural Production by Max Scott',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Sam on Dec 21 at 4:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 15
				},
				{
					title: 'Gene Drive Capabilities by Kevin Esvelt',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Sam on Nov 19 at 8:17PM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 4
				},
				{
					title: 'Skeletal Systems Map by Todd Kuiken',
					abstract: 'Technology assessment for invasive rodent control on islands: What is the technology? What is its purpose? Features of the ecological systems and technical issues to consider, like feasibility, efficacy and specificity, irreversibility, fitness, etc.?',
					author: 'Devin on Dec 12 at 9:27AM',
					comment: 'Austin raises an interesting point, but misses a broader issue about the cultural grounding of the construction of risk as associated with infectious artichoke populations.',
					commentCount: 98
				},
			]
		};
	},

	render: function() {
		return (
			<div style={[styles.container, this.props.style]}>
				<div style={styles.leftColumn}>
					<div style={styles.leftHeader}>Conference Drafts</div>
					<div style={styles.leftText}>This collection features conference drafts that will be used in our upcoming assesment of topological surveys for which adequate funding requirements lead us to believe that in 1905, before the second world war, few had ever even heard of a magical land similar to, but without, the consequences of chief magistrate oversight.</div>
				</div>

				<div style={styles.rightColumn}>
					<div style={styles.rightHeader}>
						<div key={'rightHeaderItem0'}style={[styles.rightHeaderItem, styles.rightHeaderItemActive]}>Conference Drafts</div>
						<div key={'rightHeaderItem1'}style={styles.rightHeaderItem}>Further Perspective</div>
						<div key={'rightHeaderItem2'}style={styles.rightHeaderItem}>In the News</div>
						<div style={globalStyles.clearFix}></div>
					</div>

					{
						this.props.pubList.map((pub, index)=>{
							return (
								<div style={styles.pubItem} key={'pubItem-' + index}>
									<div style={styles.pubTitle}>{pub.title}</div>
									<div style={styles.pubAbstract}>{pub.abstract}</div>
									<div style={styles.pubAuthor}>{pub.author}</div>
									<div style={styles.pubComment}>{pub.comment}</div>
									<div style={styles.pubCommentMore}>Read {pub.commentCount} more</div>
								</div>
							);
						})
					}
				</div>
			</div>
		);
	}
});

export default Radium(LandingComponentCollectionList);

styles = {
	container: {
		height: 800,
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
		paddingLeft: '5px',
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
		width: '90%',
		margin: '0px auto',
		padding: '20px 0px',
		borderBottom: '2px solid #ccc',
		':hover': {
			cursor: 'pointer',
			backgroundColor: '#F5F5F5',
		}
	},
	pubTitle: {
		fontSize: '20px',
		color: '#222',
	},
	pubAbstract: {
		fontSize: '16px',
		color: '#555',
		paddingBottom: '10px',
	},
	pubAuthor: {
		fontSize: '14px',
		color: '#999',
		paddingLeft: '20px',
	},
	pubComment: {
		fontSize: '14px',
		color: '#555',
		paddingLeft: '20px',
		width: 'calc(100% - 20px)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	pubCommentMore: {
		fontSize: '14px',
		color: '#777',
		paddingLeft: '20px',
	},

};
