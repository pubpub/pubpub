import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubLeftBar = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		query: PropTypes.object,
		pubStatus: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	render: function() {
		const versionURL = this.props.query.version !== undefined ? '?version=' + this.props.query.version : '';
		return (
			<div style={styles.container}>
				
				<Link style={globalStyles.link} to={'/'}><div key={'leftBar0'} style={styles.detail}>Home</div></Link>
				<div key={'leftBar1'} style={styles.detail}>Random Pub</div>
				<Link style={globalStyles.link} to={'/explore'}><div key={'leftBar2'} style={styles.detail}>Explore PubPub</div></Link>

				<div style={styles.leftBarDivider}></div>

				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/reviews'}><div key={'leftBar8'} style={[styles.detail, this.props.pubStatus === 'Draft' && styles.hidden]}>Reviews</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/experts'}><div key={'leftBar9'} style={styles.detail}>Experts</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/history'}><div key={'leftBar3'} style={styles.detail}>History</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/analytics'}><div key={'leftBar5'} style={styles.detail}>Analytics</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/citations'}><div key={'leftBar6'} style={styles.detail}>Citations</div></Link>
				
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/news'}><div key={'leftBar7'} style={styles.detail}>In the News</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/source' + versionURL}><div key={'leftBar4'} style={styles.detail}>Source</div></Link>
				
				{/* <div style={styles.detail}>Related Pub</div> */}
				{/* <div style={styles.detail}>Share</div> */}
				
			</div>
		);
	}
});

export default Radium(PubLeftBar);

styles = {
	container: {

	},
	detail: {
		fontSize: '13px',
		padding: '8px 0px',
		userSelect: 'none',
		color: globalStyles.sideText,
		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
	},
	hidden: {
		display: 'none',
	},
	leftBarDivider: {
		backgroundColor: '#DDD',
		width: '100%',
		height: 1,
		margin: '15px auto',
	},
};
