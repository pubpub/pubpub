import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {getAtomData, submitAtomToJournals} from './actions';
import {toggleVisibility, follow, unfollow} from 'containers/Login/actions';
import {createHighlight} from 'containers/MediaLibrary/actions';
import {safeGetInToJS} from 'utils/safeParse';
import dateFormat from 'dateformat';

import {HorizontalNav} from 'components';
import AtomReaderAnalytics from './AtomReaderAnalytics';
import AtomReaderCite from './AtomReaderCite';
import AtomReaderContributors from './AtomReaderContributors';
import AtomReaderExport from './AtomReaderExport';
import AtomReaderHeader from './AtomReaderHeader';
import AtomReaderJournals from './AtomReaderJournals';
import AtomReaderVersions from './AtomReaderVersions';
import AtomViewerPane from './AtomViewerPane';
import { StickyContainer as UnwrappedStickyContainer, Sticky } from 'react-sticky';
const StickyContainer = Radium(UnwrappedStickyContainer);

import {Discussions} from 'containers';

import {globalStyles} from 'utils/styleConstants';

import {generateTOC} from 'utils/generateTOC';

// import {globalMessages} from 'utils/globalMessages';

import {FormattedMessage} from 'react-intl';

let styles = {};

export const AtomReader = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		authorsData: PropTypes.object,
		loginData: PropTypes.object,
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
			return dispatch(getAtomData(routeParams.slug, routeParams.meta, location.query.version ));
			// return dispatch(getAtomData(routeParams.slug, location.query.referrer, getState().router.params.meta, location.query.version));
		}
	},

	getInitialState() {
		return {
			TOC: [],
			showTOC: false,
			showDiscussions: true,
			lastClicked: undefined,
		};
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
	handleJournalSubmit: function(journalIDs) {
		const atomID = safeGetInToJS(this.props.atomData, ['atomData', '_id']);
		return this.props.dispatch(submitAtomToJournals(atomID, journalIDs));
	},


	// addSelection: function(newSelection) {
	// 	newSelection.sourcePub = this.props.pubData.getIn(['pubData', '_id']);
	// 	newSelection.sourceVersion = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.pubData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.pubData.getIn(['pubData', 'history']).size;

	// 	const newHighLight = {};
	// 	newHighLight.assetType = 'highlight';
	// 	newHighLight.label = newSelection.text.substring(0, 15);
	// 	newHighLight.assetData = newSelection;

	// 	this.props.dispatch(createHighlight(newHighLight));
	// },


	render: function() {
		// const pubData = this.props.pubData.get('pubData').toJS();
		// const versionIndex = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version <= (this.props.pubData.getIn(['pubData', 'history']).size - 1)
		// 	? this.props.query.version - 1
		// 	: this.props.pubData.getIn(['pubData', 'history']).size - 1;
		const metaData = {};
		const showDiscussions = !this.props.meta && (this.state.showDiscussions && !this.state.showTOC || this.state.showDiscussions && this.state.lastCliked === 'discussions');
		const showTOC = !this.props.meta && (this.state.showTOC && !this.state.showDiscussions || this.state.showTOC && this.state.lastCliked === 'toc');

		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const currentVersionContent = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']) || {};
		const currentVersionDate = safeGetInToJS(this.props.atomData, ['currentVersionData', 'createDate']);
		const toc = generateTOC(currentVersionContent.markdown).full;
		const versionQuery = this.props.query && this.props.query.version ? '?version=' + this.props.query.version : '';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'Discussions', link: '/a/' + this.props.slug + '/discussions' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];
		if (this.props.meta === 'discussions') {
			mobileNavButtons[0] = { type: 'link', mobile: true, text: 'View', link: '/a/' + this.props.slug };
		}

		const navItems = [
			{link: '/a/' + this.props.slug, text: 'View', active: !this.props.meta},
			{link: '/a/' + this.props.slug + '/edit', text: 'Edit'},
			{link: '/a/' + this.props.slug + '/contributors', text: 'Contributors', rightAlign: true, active: this.props.meta === 'contributors'},
			{link: '/a/' + this.props.slug + '/versions', text: 'Versions', rightAlign: true, active: this.props.meta === 'versions'},
			{link: '/a/' + this.props.slug + '/journals', text: 'Journals', rightAlign: true, active: this.props.meta === 'journals'},
			{link: '/a/' + this.props.slug + '/analytics', text: 'Analytics', rightAlign: true, active: this.props.meta === 'analytics'},
			{link: '/a/' + this.props.slug + '/cite' + versionQuery, text: 'Cite', rightAlign: true, active: this.props.meta === 'cite'},
			{link: '/a/' + this.props.slug + '/export' + versionQuery, text: 'Export', rightAlign: true, active: this.props.meta === 'export'},
		];

		// Remove Export option if the atom type is not a doc
		// In the future, we may add export for datasets, images, etc. 
		// But for now that's ill defined
		if (atomData.type !== 'document') { navItems.pop(); }

		const authorsData = safeGetInToJS(this.props.atomData, ['authorsData']) || [];
		const authorList = atomData.customAuthorString ? [<Link to={'/a/' + this.props.slug + '/contributors'}>{atomData.customAuthorString}</Link>] : authorsData.map((item, index)=> {
			return <Link to={'/user/' + item.source.username} key={'author-' + index} className={'author'}>{item.source.name}</Link>;
		});

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': { opacity: '0', },
				}} />

				{/* Table of Contents Section */}
				<StickyContainer style={[styles.tocSection, !showTOC && {display: 'none'}]}>
					<Sticky style={styles.tocContent}>	
						{toc.map((object, index)=>{
							return <a key={'toc-' + index} href={'#' + object.id} className={'underlineOnHover'} style={[styles.tocItem, styles.tocLevels[object.level - 1]]}>{object.title}</a>;
						})}
					</Sticky>
				</StickyContainer>

				{/* Pub Section */}
				<div style={styles.pubSection}>
					<div className={'opacity-on-hover'} style={styles.iconLeft} onClick={this.toggleTOC}></div>
					<div className={'opacity-on-hover'} style={styles.iconRight} onClick={this.toggleDiscussions}></div>

					<HorizontalNav navItems={navItems} mobileNavButtons={mobileNavButtons}/>

					{/* <div style={styles.buttonWrapper}>
						<div className={'button'} style={styles.button} onClick={()=>{}}>Follow</div>
					</div> */}

					<div id={!this.props.meta && safeGetInToJS(this.props.atomData, ['atomData', 'type']) === 'document' && 'atom-reader'} className={'atom-reader-meta'}>

						<AtomReaderHeader
							title={atomData.title}
							authors={authorList}
							versionDate={currentVersionDate}
							lastUpdated={atomData.lastUpdated}
							slug={atomData.slug}
							titleOnly={!!this.props.meta}/>

						{(()=>{
							switch (this.props.meta) {
							case 'contributors':
								return <AtomReaderContributors atomData={this.props.atomData}/>;
							case 'versions':
								return <AtomReaderVersions atomData={this.props.atomData}/>;
							case 'journals':
								return <AtomReaderJournals atomData={this.props.atomData} handleJournalSubmit={this.handleJournalSubmit}/>;
							case 'analytics':
								return <AtomReaderAnalytics atomData={this.props.atomData}/>;
							case 'cite':
								return <AtomReaderCite atomData={this.props.atomData} authorsData={this.props.authorsData} versionQuery={versionQuery}/>;
							case 'export':
								return <AtomReaderExport atomData={this.props.atomData}/>;
							case 'discussions':
								return <Discussions/>;
							default:
								return <AtomViewerPane atomData={this.props.atomData} />;
							}
						})()}
					</div>

					{/* License will go here */}

				</div>

				{/* Discussion Section */}
				<div style={[styles.discussionSection, !showDiscussions && {display: 'none'}]}>
					<Discussions/>
				</div>


			</div>
		);
	}

});


export default connect( state => {
	return {
		atomData: state.atom,
		loginData: state.login,
		slug: state.router.params.slug,
		meta: state.router.params.meta,
		query: state.router.location.query,
	};
})( Radium(AtomReader) );

styles = {
	tocSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '300px',
		backgroundColor: '#F3F3F4',
		borderRight: '1px solid #E4E4E4',
		fontSize: '0.9em',
	},
	tocContent: {
		maxHeight: 'calc(100vh - 7em)',
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '2em 0em 5em 0em',
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
	author: {
		color: 'red',
	},
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
	buttonWrapper: {
		float: 'right',
		position: 'relative',
		top: '8px',
	},
	button: {
		fontSize: '.85em',
		padding: '.25em 1.5em',
	},

};
