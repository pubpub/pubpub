import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import {RelatedPub} from 'components';

let styles = {};

const PubLeftBar = React.createClass({
	propTypes: {
		slug: PropTypes.string,
		query: PropTypes.object,
		meta: PropTypes.string,
		pubStatus: PropTypes.string,
		readRandomPubHandler: PropTypes.func,
		randomSlug: PropTypes.string,
		journalCount: PropTypes.number,
		historyCount: PropTypes.number,
		analyticsCount: PropTypes.number,
		citationsCount: PropTypes.number,
		newsCount: PropTypes.number,
		isFollowing: PropTypes.bool,
		handleFollow: PropTypes.func,
		isAuthor: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	handlePrint: function() {
		window.print();
	},

	render: function() {
		const versionURL = this.props.query.version !== undefined ? '?version=' + this.props.query.version : '';
		const pubViews = [
			{label: <FormattedMessage {...globalMessages.read} />, metaPath: undefined},
			{label: <FormattedMessage {...globalMessages.edit} />, metaPath: 'draft'},
			{label: <FormattedMessage {...globalMessages.discussions} />, metaPath: 'discussions'},
			{label: <span><FormattedMessage {...globalMessages.Journals} /> <span style={styles.count}>({this.props.journalCount || 0})</span></span>, metaPath: 'journals'},
			{label: <span><FormattedMessage {...globalMessages.history} /> <span style={styles.count}>({this.props.historyCount || 0})</span></span>, metaPath: 'history'},
			{label: <FormattedMessage {...globalMessages.source} />, metaPath: 'source'},
			// {label: 'Cite', metaPath: 'cite'},
		];
		return (
			<div style={styles.container}>
				{pubViews.map((view, index)=>{
					const path = view.metaPath || '';
					const authorOnlyStyle = !this.props.isAuthor && view.metaPath === 'draft' && {display: 'none'};
					return (
						<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/' + path + versionURL} key={'metaLink-' + index}>
						<div key={'metaLinkLabel-' + index} style={[styles.detail, this.props.meta === view.metaPath && styles.detailActive, authorOnlyStyle]}>{view.label}</div>
						</Link>
					);
				})}

				<div style={styles.leftBarDivider}></div>

				<div key="pubNav8" style={[styles.detail]} onClick={this.props.handleFollow}>
					{this.props.isFollowing
						? <FormattedMessage {...globalMessages.following} />
						: <FormattedMessage {...globalMessages.follow} />
					}
				</div>

				{/* <Link style={globalStyles.link} to={'/pubs'}><div key={'test67'} style={styles.detail}>
					Table of Contents
				</div></Link> */}

				{/* <a href={'/api/print?slug=' + this.props.slug} target="_blank" style={globalStyles.link}>
					<div key={'test76'} style={styles.detail}>
						PDF
					</div>
				</a> */}

				{
				/*
				<div style={styles.leftBarDivider}></div>
				<RelatedPub/>
				*/
				}

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
	detailActive: {
		fontWeight: 'bold',
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
