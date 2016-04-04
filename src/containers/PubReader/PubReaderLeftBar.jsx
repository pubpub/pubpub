import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubLeftBar = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		query: PropTypes.object,
		pubStatus: PropTypes.string,
		readRandomPubHandler: PropTypes.func,
		randomSlug: PropTypes.string,
		journalCount: PropTypes.number,
		historyCount: PropTypes.number,
		analyticsCount: PropTypes.number,
		citationsCount: PropTypes.number,
		newsCount: PropTypes.number,

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

				<Link style={globalStyles.link} to={'/pubs'}><div key={'test1'} style={styles.detail}>
					Read
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test2'} style={styles.detail}>
					Edit
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test3'} style={styles.detail}>
					Discussions
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test4'} style={styles.detail}>
					Journals
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test5'} style={styles.detail}>
					History
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test6'} style={styles.detail}>
					Source
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test7'} style={styles.detail}>
					Cite
				</div></Link>

				<div style={styles.leftBarDivider}></div>

				<Link style={globalStyles.link} to={'/pubs'}><div key={'test8'} style={styles.detail}>
					Follow
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test67'} style={styles.detail}>
					Table of Contents
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test76'} style={styles.detail}>
					Print
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'test43'} style={styles.detail}>
					Permalink
				</div></Link>

				{/* <Link style={globalStyles.link} to={'/'}><div key={'leftBar0'} style={styles.detail}>
					<FormattedMessage id="pub.home" defaultMessage="Home"/>
				</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.randomSlug}><div key={'leftBar1'} style={styles.detail} onClick={this.props.readRandomPubHandler}>
					<FormattedMessage id="pub.randomPub" defaultMessage="Random Pub"/>
				</div></Link>
				<Link style={globalStyles.link} to={'/pubs'}><div key={'leftBar2'} style={styles.detail}>
					<FormattedMessage {...globalMessages.Explore} />
				</div></Link>

				<Link style={globalStyles.link} to={'/pub/about'}><div key={'leftBar9'} style={styles.detail}>
					<FormattedMessage {...globalMessages.FAQ} />
				</div></Link>

				<a style={globalStyles.link} target="_blank" href={'mailto:pubpub@media.mit.edu'}><div key={'leftBar10'} style={styles.detail}>
					<FormattedMessage {...globalMessages.Feedback} />
				</div></a> */}

				{/* <div style={styles.leftBarDivider}></div> */}
				{/*
					<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/reviews'}><div key={'leftBar8'} style={[styles.detail, this.props.pubStatus === 'Draft' && styles.hidden]}>
						<FormattedMessage {...globalMessages.reviews} />
					</div></Link>
				*/}

				{/* <Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/experts'}><div key={'leftBar9'} style={styles.detail}>Experts</div></Link> */}



				{/* <Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/journals'}><div key={'leftBar13'} style={styles.detail}>
					<FormattedMessage {...globalMessages.Journals} /> <span style={styles.count}>({this.props.journalCount || 0})</span>
				</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/history'}><div key={'leftBar3'} style={styles.detail}>
					<FormattedMessage {...globalMessages.history} /> <span style={styles.count}>({this.props.historyCount || 0})</span>
				</div></Link> */}



				{/* <Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/analytics'}><div key={'leftBar5'} style={styles.detail}>
					<FormattedMessage {...globalMessages.analytics} /> <span style={styles.count}>({this.props.analyticsCount || 0})</span>
				</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/citations'}><div key={'leftBar6'} style={styles.detail}>
					<FormattedMessage {...globalMessages.citations} /> <span style={styles.count}>({this.props.citationsCount || 0})</span>
				</div></Link>
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/news'}><div key={'leftBar7'} style={styles.detail}>
					<FormattedMessage {...globalMessages.inthenews} /> <span style={styles.count}>({this.props.newsCount || 0})</span>
				</div></Link> */}


				{/* <Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/source' + versionURL}><div key={'leftBar4'} style={styles.detail}>
					<FormattedMessage {...globalMessages.source} />
				</div></Link> */}



				{/* <div style={styles.leftBarDivider}></div> */}

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
		width: '85%',
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
	count: {
		// paddingLeft: '10px',
		float: 'right',
		paddingRight: '15px',
	},
};
