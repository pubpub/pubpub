import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {getPub, togglePubHighlights, getPubRecommendations} from './actions';
import {toggleVisibility, follow, unfollow} from 'containers/Login/actions';
import {createHighlight} from 'containers/MediaLibrary/actions';

import {PubBody, HorizontalNav} from 'components';

import PubMeta from './PubMeta/PubMeta';
import PubReaderLeftBar from './PubReaderLeftBar';
import PubReaderNav from './PubReaderNav';
import {Discussions} from 'containers';

import {globalStyles} from 'utils/styleConstants';

import {generateTOC} from 'utils/generateTOC';

// import {globalMessages} from 'utils/globalMessages';

import {FormattedMessage} from 'react-intl';

let styles = {};

const PubReader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
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
			return dispatch(getPub(routeParams.slug, getState().app.getIn(['journalData', '_id']), location.query.referrer ));
		}
	},

	getInitialState() {
		return {
			htmlTree: [],
			TOC: [],
			showTOC: false,
			showDiscussions: true,
			lastClicked: undefined,
		};
	},

	componentWillMount() {

		const versionIndex = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;

		const inputMD = this.props.readerData.getIn(['pubData', 'history', versionIndex, 'markdown']) || '';

		const toc = generateTOC(inputMD).full;
		this.setState({
			inputMD: inputMD,
			TOC: toc,
		});
	},

	componentDidMount() {
		this.requestRecommendation();
	},


	componentWillReceiveProps(nextProps) {
		const oldVersionIndex = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
		const versionIndex = nextProps.query.version !== undefined ? nextProps.query.version - 1 : nextProps.readerData.getIn(['pubData', 'history']).size - 1;

		// When a pub is loaded, and we navigate away, then navigate to a new pub - the old pub data is still there during component will mount
		// Thus, we need to also check and render when the markdown has changed.
		const oldMarkdown = this.props.readerData.getIn(['pubData', 'history', oldVersionIndex, 'markdown']);
		const newMarkdown = nextProps.readerData.getIn(['pubData', 'history', versionIndex, 'markdown']);

		if (oldVersionIndex !== versionIndex || this.state.htmlTree.length === 0 || oldMarkdown !== newMarkdown) {
			// console.log('compiling markdown for version ' + versionIndex);
			const inputMD = nextProps.readerData.getIn(['pubData', 'history', versionIndex, 'markdown']) || '';

			const toc = generateTOC(inputMD).full;

			this.setState({
				inputMD: inputMD,
				// assetsObject: assets,
				// referencesObject: references,
				// selectionsArray: selections,
				TOC: toc,
			});
		}

	},

	toggleTOC: function() {
		const showingTOC = this.state.showTOC && !this.state.showDiscussions || this.state.showTOC && this.state.lastCliked === 'toc';
		if (showingTOC) {
			this.setState({
				showTOC: false,
				lastCliked: 'toc'
			});
		} else {
			this.setState({
				showTOC: true,
				lastCliked: 'toc'
			});
		}
	},
	toggleDiscussions: function() {
		const showingDiscussions = this.state.showDiscussions && !this.state.showTOC || this.state.showDiscussions && this.state.lastCliked === 'discussions';
		if (showingDiscussions) {
			this.setState({
				showDiscussions: false,
				lastCliked: 'discussions'
			});
		} else {
			this.setState({
				showDiscussions: true,
				lastCliked: 'discussions'
			});
		}
		
	},

	requestRecommendation() {

		const journalID = this.props.appData.getIn(['journalData', '_id']);
		const pubID = this.props.readerData.getIn(['pubData', '_id']);
		this.props.dispatch(getPubRecommendations(pubID, journalID));
	},

	addSelection: function(newSelection) {
		newSelection.sourcePub = this.props.readerData.getIn(['pubData', '_id']);
		newSelection.sourceVersion = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.readerData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.readerData.getIn(['pubData', 'history']).size;

		const newHighLight = {};
		newHighLight.assetType = 'highlight';
		newHighLight.label = newSelection.text.substring(0, 15);
		newHighLight.assetData = newSelection;

		this.props.dispatch(createHighlight(newHighLight));
	},

	toggleHighlights: function() {
		this.props.dispatch(togglePubHighlights());
	},

	followPubToggle: function() {
		if (!this.props.loginData.get('loggedIn')) {
			return this.props.dispatch(toggleVisibility());
		}

		const analyticsData = {
			type: 'pubs',
			followedID: this.props.readerData.getIn(['pubData', '_id']),
			pubtitle: this.props.readerData.getIn(['pubData', 'title']),
			numFollowers: this.props.readerData.getIn(['pubData', 'followers']) ? this.props.readerData.getIn(['pubData', 'followers']).size : 0,
		};

		const isFollowing = this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.readerData.getIn(['pubData', '_id'])) > -1 : false;
		if (isFollowing) {
			this.props.dispatch( unfollow('pubs', this.props.readerData.getIn(['pubData', '_id']), analyticsData ));
		} else {
			this.props.dispatch( follow('pubs', this.props.readerData.getIn(['pubData', '_id']), analyticsData ));
		}
	},

	render: function() {
		const pubData = this.props.readerData.get('pubData').toJS();
		const versionIndex = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version <= (this.props.readerData.getIn(['pubData', 'history']).size - 1)
			? this.props.query.version - 1
			: this.props.readerData.getIn(['pubData', 'history']).size - 1;

		const metaData = {};
		metaData.meta = [];
		if (pubData.title) {
			metaData.title = pubData.history[versionIndex].title;
			metaData.meta = [
				{property: 'og:title', content: pubData.title || ''},
				{property: 'og:type', content: 'article'},
				{property: 'og:description', content: pubData.abstract || ''},
				{property: 'article:published_time', content: pubData.history[versionIndex].versionDate},
				{property: 'article:modified_time', content: pubData.history[pubData.history.length - 1].versionDate},
				{name: 'twitter:card', content: 'summary_large_image'},
				{name: 'twitter:site', content: '@pubpub'},
				{name: 'twitter:title', content: pubData.title || ''},
				{name: 'twitter:description', content: pubData.abstract || ''},
			];
			
			const srcRegex = /{{image:.*(source=([^\s,]*)).*}}/;
			const match = srcRegex.exec(pubData.history[versionIndex].markdown);
			const refName = match ? match[2] : undefined;

			let leadImage = '';
			// for (let index = pubData.history[versionIndex].assets.length; index--;) {
			// 	if (pubData.history[versionIndex].assets[index].refName === refName) {
			// 		leadImage = pubData.history[versionIndex].assets[index].url_s3;
			// 		break;
			// 	}
			// }

			metaData.meta.push({property: 'og:image', content: leadImage});
			metaData.meta.push({name: 'twitter:image', content: leadImage});

		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}

		const showDiscussions = !this.props.meta && (this.state.showDiscussions && !this.state.showTOC || this.state.showDiscussions && this.state.lastCliked === 'discussions');
		const showTOC = !this.props.meta && (this.state.showTOC && !this.state.showDiscussions || this.state.showTOC && this.state.lastCliked === 'toc');

		const navItems = [
			{link: '/pub/' + this.props.slug, text: 'View', active: true},
			{link: '/pub/' + this.props.slug + '/draft', text: 'Edit'},
			{link: '/pub/' + this.props.slug + '/contributors', text: 'Contributors', rightAlign: true},
			{link: '/pub/' + this.props.slug + '/source', text: 'Versions', rightAlign: true},
			{link: '/pub/' + this.props.slug + '/journals', text: 'Journals', rightAlign: true},
			{link: '/pub/' + this.props.slug + '/analytics', text: 'Analytics', rightAlign: true},
			{link: '/pub/' + this.props.slug + '/cite', text: 'Cite', rightAlign: true},
			{link: '/pub/' + this.props.slug + '/export', text: 'Export', rightAlign: true},
		];

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': { opacity: '0', },
				}} />
				
				{/* Table of Contents Section */}
				<div style={[styles.tocSection, !showTOC && {display: 'none'}]}>
					{this.state.TOC.map((object, index)=>{
						return <a href={'#' + object.id} className={'underlineOnHover'} style={[styles.tocItem, styles.tocLevels[object.level - 1]]}>{object.title}</a>;
					})}
				</div>

				{/* Pub Section */}
				<div style={styles.pubSection}>
					<div className={'opacity-on-hover'} style={styles.iconLeft} onClick={this.toggleTOC}></div>
					<div className={'opacity-on-hover'} style={styles.iconRight} onClick={this.toggleDiscussions}></div>

					<HorizontalNav navItems={navItems} />

					{this.props.meta
						? <div style={styles.pubMetaWrapper}>
							<h1 style={styles.noBottomMargin}>{pubData.title}</h1>
							<PubMeta
								readerData={this.props.readerData}
								loginData={this.props.loginData}
								slug={this.props.slug}
								meta={this.props.meta}
								metaID={this.props.metaID}
								inviteStatus={this.props.inviteStatus}
								query={this.props.query}
								dispatch={this.props.dispatch} />
						</div>
						: <div style={styles.pubBodyWrapper}>
							<PubBody
								markdown={this.state.inputMD}
								isPublished={pubData.isPublished}
								addSelectionHandler={this.addSelection}
								styleScoped={pubData.history[versionIndex].styleScoped}/>
						</div>

					}
					
				</div>

				{/* Discussion Section */}
				<div style={[styles.discussionSection, !showDiscussions && {display: 'none'}]}>
					<Discussions/>	
				</div>

				{/* isFollowing={this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.readerData.getIn(['pubData', '_id'])) > -1 : false} */}
				{/* this.props.query.version && this.props.query.version !== pubData.history.length.toString() */}


			</div>
		);
	}

});


export default connect( state => {
	return {
		readerData: state.pub,
		loginData: state.login,
		appData: state.app,
		slug: state.router.params.slug,
		query: state.router.location.query,

		meta: state.router.params.meta,
		metaID: state.router.params.metaID,
		inviteStatus: state.user.get('inviteStatus')
	};
})( Radium(PubReader) );

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
