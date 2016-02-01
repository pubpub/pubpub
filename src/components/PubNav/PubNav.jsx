import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubNav = React.createClass({
	propTypes: {
		height: PropTypes.number,
		openPubModalHandler: PropTypes.func,
		status: PropTypes.string,
		slug: PropTypes.string,
		query: PropTypes.object,
		meta: PropTypes.string, 
		isAuthor: PropTypes.bool,
		pubStatus: PropTypes.string,
		isFollowing: PropTypes.bool,
		handleFollow: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			query: {},
			openPubModalHandler: ()=>{},
		};
	},

	handlePrint: function() {
		window.print();
	},

	render: function() {
		const versionURL = this.props.query.version !== undefined ? '?version=' + this.props.query.version : '';
		return (
			<div>
				{
					this.props.meta 
						? <ul style={[styles.pubNav, globalStyles[this.props.status]]}>
							<Link to={'/pub/' + this.props.slug + versionURL}><li key="pubNav8"style={[styles.pubNavItem, styles.pubNavRight]}>
								<FormattedMessage id="pub.readPub" defaultMessage="Read Pub"/>
							</li></Link>
							<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>
						</ul>

						: <ul style={[styles.pubNav, globalStyles[this.props.status]]}>

							<li key="pubNav0"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.props.openPubModalHandler('tableOfContents')}>
								<FormattedMessage {...globalMessages.tableOfContents} />
							</li>
							<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
							<li key="pubNav3"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.handlePrint}>
								<FormattedMessage {...globalMessages.print} />
							</li>
							<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
							<li key="pubNav4"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={this.props.openPubModalHandler('cite')}>
								<FormattedMessage {...globalMessages.cite} />
							</li>


							<Link to={'/pub/' + this.props.slug + '/draft'}><li key="pubNav7"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavDesktopOnly, styles.pubNavAuthorOnly, styles.pubAuthor[this.props.isAuthor]]}>
								<FormattedMessage id="pub.editPub" defaultMessage="Edit Pub"/>
							</li></Link>
							<li style={[styles.pubNavSeparator, styles.pubNavRight, styles.pubNavDesktopOnly, styles.pubNavAuthorOnly, styles.pubAuthor[this.props.isAuthor]]}></li>

							<li key="pubNav5"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavMobileOnly]} onClick={this.props.openPubModalHandler('discussions')}>
								<FormattedMessage {...globalMessages.discussions} />
							</li>
							<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>
							
							{/* <li key="pubNav6"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavMobileOnly, this.props.pubStatus === 'Draft' && styles.draftNav]} onClick={this.props.pubStatus !== 'Draft' ? this.props.openPubModalHandler('reviews') : null}>
								{this.props.pubStatus === 'Draft' ? <FormattedMessage {...globalMessages.Draft} /> : ''}
							</li> */}
							<li key="pubNav6"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavMobileOnly]} >
								
							</li>

							<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>

							<li key="pubNav8"style={[styles.pubNavItem, styles.pubNavRight]} onClick={this.props.handleFollow}>
								{this.props.isFollowing 
									? <FormattedMessage {...globalMessages.following} />
									: <FormattedMessage {...globalMessages.follow} />
								}
							</li>
							
						</ul>
				}
				
			</div>
		);
	}
});

export default Radium(PubNav);

styles = {
	navContainer: {

	},
	pubNav: {
		listStyle: 'none',
		pointerEvents: 'auto',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,
		color: '#888',
		fontFamily: 'Lato',
		transition: '.3s linear opacity .25s',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
		},
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	pubNavItem: {
		height: '100%',
		padding: '0px 10px',
		lineHeight: globalStyles.headerHeight,
		fontSize: '14px',
		float: 'left',
		color: '#888',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(33% - 1px)',
			lineHeight: globalStyles.headerHeightMobile,
			padding: 0,
			textAlign: 'center',
			fontSize: '20px'
		},
	},
	pubNavRight: {
		float: 'right',
	},
	pubNavMobileOnly: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	pubNavDesktopOnly: {
		display: 'block',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	pubNavSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 30px)',
			margin: '15px 0px',
		},
	},
	pubNavAuthorOnly: {
		display: 'none',
	},
	pubAuthor: {
		true: {
			display: 'block',
		},
	},
	draftNav: {
		color: '#ccc',
		':hover': {
			color: '#ccc',
		},
	},

};
