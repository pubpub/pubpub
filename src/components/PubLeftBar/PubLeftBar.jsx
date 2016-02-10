import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import RelatedPub from '../RelatedPub/RelatedPub';

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

				<Link style={globalStyles.link} to={'/'}><div key={'leftBar0'} style={styles.detail}>
					<FormattedMessage id="pub.home" defaultMessage="Home"/>
				</div></Link>
				{ /* <Link style={globalStyles.link} to={'/pub/' + this.props.randomSlug}><div key={'leftBar1'} style={styles.detail} onClick={this.props.readRandomPubHandler}>
					<FormattedMessage id="pub.randomPub" defaultMessage="Random Pub"/>
				</div></Link>*/ }
				<Link style={globalStyles.link} to={'/pubs'}><div key={'leftBar2'} style={styles.detail}>
					<FormattedMessage {...globalMessages.Explore} />
				</div></Link>

				<Link style={globalStyles.link} to={'/pub/about'}><div key={'leftBar9'} style={styles.detail}>
					<FormattedMessage {...globalMessages.FAQ} />
				</div></Link>

				<a style={globalStyles.link} target="_blank" href={'mailto:pubpub@media.mit.edu'}><div key={'leftBar10'} style={styles.detail}>
					<FormattedMessage {...globalMessages.Feedback} />
				</div></a>

				<div style={styles.leftBarDivider}></div>
				{/*
					<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/reviews'}><div key={'leftBar8'} style={[styles.detail, this.props.pubStatus === 'Draft' && styles.hidden]}>
						<FormattedMessage {...globalMessages.reviews} />
					</div></Link>
				*/}

				<div style={styles.title}>This Pub</div>

				{/* <Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/experts'}><div key={'leftBar9'} style={styles.detail}>Experts</div></Link> */}
				<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/journals'}><div key={'leftBar13'} style={[styles.detail, styles.meta]}>
					<FormattedMessage {...globalMessages.Journals} /> { <span style={styles.count}>({this.props.journalCount || 0})</span>}
				</div></Link>
			<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/history'}><div key={'leftBar3'} style={[styles.detail, styles.meta]}>
					<FormattedMessage {...globalMessages.history} /> { <span style={styles.count}>({this.props.historyCount || 0})</span>}
				</div></Link>
			<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/analytics'}><div key={'leftBar5'} style={[styles.detail, styles.meta]}>
					<FormattedMessage {...globalMessages.analytics} /> {/* <span style={styles.count}>({this.props.analyticsCount || 0})</span>*/}
				</div></Link>
			<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/citations'}><div key={'leftBar6'} style={[styles.detail, styles.meta]}>
					<FormattedMessage {...globalMessages.citations} /> { <span style={styles.count}>({this.props.citationsCount || 0})</span>}
				</div></Link>
			{/* <Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/news'}><div key={'leftBar7'} style={[styles.detail, styles.meta]}>
					<FormattedMessage {...globalMessages.inthenews} />
				</div></Link> */ }
			{/* <span style={styles.count}>({this.props.newsCount || 0})</span>*/}

			<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/source' + versionURL}><div key={'leftBar4'} style={[styles.detail, styles.meta]}>
					<FormattedMessage {...globalMessages.source} />
				</div></Link>

			{/*
				<div style={styles.leftBarDivider}></div>
				<RelatedPub/>
			*/}

			</div>
		);
	}
});

export default Radium(PubLeftBar);

styles = {
	container: {

	},
	title: {
		textAlign: 'center',
		marginBottom: '0.50em',
		userSelect: 'none',
	},
	meta: {
		textAlign: 'left',
		width: '100%'
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
		fontSize: '1em',
		paddingRight: '15px',
		marginLeft: '5px',
		color: '#bbb',
	},
};
