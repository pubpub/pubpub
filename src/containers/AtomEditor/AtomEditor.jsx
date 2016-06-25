import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {getAtomEdit} from './actions';
import {toggleVisibility, follow, unfollow} from 'containers/Login/actions';
import {createHighlight} from 'containers/MediaLibrary/actions';

import {PubBody, HorizontalNav} from 'components';
import {AtomEditorHeader} from './AtomEditorHeader';

// import PubMeta from './PubMeta/PubMeta';
// import PubReaderLeftBar from './PubReaderLeftBar';
// import PubReaderNav from './PubReaderNav';
import {Discussions} from 'containers';

import {globalStyles} from 'utils/styleConstants';

import {generateTOC} from 'utils/generateTOC';

// import {globalMessages} from 'utils/globalMessages';

import {FormattedMessage} from 'react-intl';

let styles = {};

const AtomEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
		appData: PropTypes.object,
		slug: PropTypes.string,
		query: PropTypes.object, // version: integer
		meta: PropTypes.string,
		metaID: PropTypes.string,
		inviteStatus: PropTypes.string,
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			return dispatch(getAtomEdit(routeParams.slug));
		}
	},

	getInitialState() {
		return {
		};
	},

	render: function() {
		// const pubData = this.props.readerData.get('pubData').toJS();
		// const versionIndex = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version <= (this.props.readerData.getIn(['pubData', 'history']).size - 1)
		// 	? this.props.query.version - 1
		// 	: this.props.readerData.getIn(['pubData', 'history']).size - 1;

		const metaData = {};


		const navItems = [
			{link: '/a/' + this.props.slug, text: 'View'},
			{link: '/a/' + this.props.slug + '/draft', text: 'Edit', active: true},
			{link: '/a/' + this.props.slug + '/analytics', text: 'Details', rightAlign: true},
			{link: '/a/' + this.props.slug + '/contributors', text: 'Collaborators', rightAlign: true},
			{link: '/a/' + this.props.slug + '/source', text: 'Styles', rightAlign: true},
			{link: '/a/' + this.props.slug + '/journals', text: 'Publishing', rightAlign: true},
		];

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />


				{/* Pub Section */}
				<div style={styles.pubSection}>

					<HorizontalNav navItems={navItems} />

					<AtomEditorHeader
						title={this.props.atomEditData.getIn(['atomData', 'title'])}/>

					<h3>EDITOR</h3>
					{/* this.props.meta
						? this.renderMeta()
						: this.renderAtom()
					*/}

					
				</div>

			</div>
		);
	}

});


export default connect( state => {
	return {
		atomEditData: state.atomEdit,
		loginData: state.login,
		appData: state.app,
		slug: state.router.params.slug,
		query: state.router.location.query,

		meta: state.router.params.meta,
		metaID: state.router.params.metaID,
		inviteStatus: state.user.get('inviteStatus')
	};
})( Radium(AtomEditor) );

styles = {
	tocSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '300px',
		backgroundColor: '#F3F3F4',
		borderRight: '1px solid #E4E4E4',
		fontSize: '0.9em',
	},
	tocHover: {
		width: '2em',
		position: 'absolute',
		top: '0px',
		bottom: '0px',
		paddingTop: '15px',
	},
	tocIcon: {
		position: 'relative',
		width: '10px',
		height: '2px',
		marginBottom: '1px',
		backgroundColor: '#BBBDC0',
		borderRadius: '1px',
	},

	tocPopout: {
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '2em',
	},
	pubSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '0em 2em',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '0em 1em',
		},
	},
	iconLeft: {
		position: 'absolute',
		width: '1.5em',
		height: '100%',
		cursor: 'pointer',
		top: 0,
		left: 0,
		opacity: 0,
		backgroundColor: '#F3F3F4',
		borderRight: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	iconRight: {
		position: 'absolute',
		width: '1.5em',
		height: '100%',
		cursor: 'pointer',
		top: 0,
		right: 0,
		opacity: 0,
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	discussionSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '0em 2%',
		width: '35%',
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	// pubSectionNav: {
	// 	borderBottom: '1px solid #F3F3F4',
	// 	fontSize: '0.85em',
	// 	color: '#808284',
	// 	maxWidth: '1024px',
	// 	margin: '0 auto',
	// },
	// pubNavVersion: {
	// 	display: 'inline-block',
	// 	padding: '10px 0px',
	// },
	// pubNavButtons: {
	// 	float: 'right',
	// },
	// pubNavButton: {
	// 	display: 'inline-block',
	// 	padding: '10px',
	// },
	// pubNavButtonLast: {
	// 	padding: '10px 0px 10px 10px',
	// },
	pubBodyWrapper: {
		maxWidth: '650px',
		margin: '0 auto',
		padding: '0em 3em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			maxWidth: 'auto',
			padding: '0em 0em',
		},
	},
	pubMetaWrapper: {
		maxWidth: '1024px',
		margin: '0 auto',
		padding: '2em 3em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			maxWidth: 'auto',
			padding: '1em 0em',
		},
	},

	container: {
		display: 'table',
		width: '100%',
		tableLayout: 'fixed',
		overflow: 'hidden',
		minHeight: '100vh',
	},

	tocItem: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		paddingRight: '2em',
		paddingTop: '1em',
		paddingBottom: '1em',
		paddingLeft: '2em',
	},

	tocLevels: [
		{paddingLeft: '2em'},
		{paddingLeft: '4em'},
		{paddingLeft: '5em'},
		{paddingLeft: '6em'},
		{paddingLeft: '7em'},
		{paddingLeft: '8em'},
	],
	noBottomMargin: {
		marginBottom: '0px',
	},

};
