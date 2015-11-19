import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubNav = React.createClass({
	propTypes: {
		height: PropTypes.number,
		navClickFunction: PropTypes.func,
		status: PropTypes.string
	},

	render: function() {
		const navClickFunction = this.props.navClickFunction;
		function clickWrapper(clickOption) {
			return ()=>navClickFunction(clickOption);
		}

		return (
			<div>
				<ul style={[styles.pubNav, styles[this.props.status]]}>

					<li key="pubNav0"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={clickWrapper('pubnav-tableOfContents')}>Table of Contents</li>
					<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
					<li key="pubNav1"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={clickWrapper('pubnav-history')}>History</li>
					<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
					<li key="pubNav2"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={clickWrapper('pubnav-source')}>Source</li>
					<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
					<li key="pubNav3"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={clickWrapper('pubnav-print')}>Print</li>
					<li style={[styles.pubNavSeparator, styles.pubNavDesktopOnly]}></li>
					<li key="pubNav4"style={[styles.pubNavItem, styles.pubNavDesktopOnly]} onClick={clickWrapper('pubnav-cite')}>Cite</li>

					<li key="pubNav7"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavAuthorOnly, styles.pubNavDesktopOnly]} onClick={clickWrapper('pubnav-edit')}>Edit Pub</li>
					<li style={[styles.pubNavSeparator, styles.pubNavAuthorOnly, styles.pubNavRight, styles.pubNavDesktopOnly]}></li>
					<li key="pubNav5"style={[styles.pubNavItem, styles.pubNavRight, styles.pubNavMobileOnly]} onClick={clickWrapper('pubnav-discussions')}>Discussions</li>
					<li style={[styles.pubNavSeparator, styles.pubNavMobileOnly, styles.pubNavRight]}></li>
					<li key="pubNav6"style={[styles.pubNavItem, styles.pubNavRight]} onClick={clickWrapper('pubnav-favorite')}>Favorite</li>
					
				</ul>
			</div>
		);
	}
});

styles = {
	navContainer: {

	},
	pubNav: {
		listStyle: 'none',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,
		color: '#888',
		fontFamily: 'Lato',
		transition: '.3s linear opacity .25s',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: 'calc(50% - 1px)',
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'block',
		},
	},
	pubNavDesktopOnly: {
		display: 'block',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
	},
	pubNavSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 30px)',
			margin: '15px 0px',
		},
	}

};
	
export default Radium(PubNav);
