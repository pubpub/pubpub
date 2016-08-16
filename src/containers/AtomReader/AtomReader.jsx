import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import {getAtomData, submitAtomToJournals} from './actions';
// import {follow, unfollow} from 'containers/Login/actions';
// import {createHighlight} from 'containers/MediaLibrary/actions';
import {safeGetInToJS} from 'utils/safeParse';
// import dateFormat from 'dateformat';

import {HorizontalNav, License} from 'components';
import AtomReaderAnalytics from './AtomReaderAnalytics';
import AtomReaderCite from './AtomReaderCite';
import AtomReaderContributors from './AtomReaderContributors';
import AtomReaderExport from './AtomReaderExport';
import AtomReaderHeader from './AtomReaderHeader';
import AtomReaderJournals from './AtomReaderJournals';
import AtomReaderVersions from './AtomReaderVersions';
import AtomReaderFollowers from './AtomReaderFollowers';

import AtomViewerPane from './AtomViewerPane';
import { StickyContainer as UnwrappedStickyContainer, Sticky } from 'react-sticky';
const StickyContainer = Radium(UnwrappedStickyContainer);
import smoothScroll from 'smoothscroll';

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
			showRightPanel: true,
			rightPanelMode: 'discussions',
		};
	},

	toggleRightPanel: function() {
		this.setState({showRightPanel: !this.state.showRightPanel});
		setTimeout(()=> {
			window.scrollBy(0, 1);
			window.scrollBy(0, -1);
		}, 250);
	},

	setRightPanelMode: function(mode) {
		this.setState({rightPanelMode: mode});
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

	handleScroll: function(id) {
		const destination = document.getElementById(id);
		if (!destination) { return undefined; }
		smoothScroll(destination);
	},

	render: function() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};

		const metaData = {
			title: atomData.title + ' · PubPub',
			meta: [
				{property: 'og:title', content: atomData.title},
				{property: 'og:type', content: 'article'},
				{property: 'og:description', content: atomData.description},
				{property: 'og:url', content: 'https://www.pubpub.org/pub/' + atomData.slug},
				{property: 'og:image', content: atomData.previewImage},
				{property: 'og:image:url', content: atomData.previewImage},
				{property: 'og:image:width', content: '500'},
				{property: 'article:published_time', content: atomData.lastUpdated || atomData.createDate},
				{property: 'article:modified_time', content: atomData.lastUpdated},
				{name: 'twitter:card', content: 'summary'},
				{name: 'twitter:site', content: '@pubpub'},
				{name: 'twitter:title', content: atomData.title},
				{name: 'twitter:description', content: atomData.description || atomData.title},
				{name: 'twitter:image', content: atomData.previewImage},
				{name: 'twitter:image:alt', content: 'Preview image for ' + atomData.title}
			]
		};
		
		const contributorsData = safeGetInToJS(this.props.atomData, ['contributorsData']) || [];
		const currentVersionContent = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']) || {};
		const currentVersionDate = safeGetInToJS(this.props.atomData, ['currentVersionData', 'createDate']);
		const toc = generateTOC(currentVersionContent.markdown).full;
		const versionQuery = this.props.query && this.props.query.version ? '?version=' + this.props.query.version : '';
		const permissionType = safeGetInToJS(this.props.atomData, ['atomData', 'permissionType']) || [];

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: 'Discussions', link: '/pub/' + this.props.slug + '/discussions' },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		if (this.props.meta === 'discussions') {
			mobileNavButtons[0] = { type: 'link', mobile: true, text: 'View', link: '/pub/' + this.props.slug };
		}

		/* Nav Items that show above the main content */
		/* These are only shown if the user has edit rights */
		const atomNavItems = [
			{link: '/pub/' + this.props.slug, text: 'View', active: true},
			{link: '/pub/' + this.props.slug + '/edit', text: 'Edit'}
		];

		const showAtomNav = (permissionType === 'author' || permissionType === 'editor');

		const rightPanelNavItems = [
			{text: 'Contents', action: this.setRightPanelMode.bind(this, 'contents'), active: this.state.rightPanelMode === 'contents'},
			{text: 'Discussions', action: this.setRightPanelMode.bind(this, 'discussions'), active: this.state.rightPanelMode === 'discussions'},
			{text: 'Contributors', action: this.setRightPanelMode.bind(this, 'contributors'), active: this.state.rightPanelMode === 'contributors'},
			{text: 'Versions', action: this.setRightPanelMode.bind(this, 'versions'), active: this.state.rightPanelMode === 'versions'},
			{text: 'Journals', action: this.setRightPanelMode.bind(this, 'journals'), active: this.state.rightPanelMode === 'journals'},
			{text: 'Analytics', action: this.setRightPanelMode.bind(this, 'analytics'), active: this.state.rightPanelMode === 'analytics'},
			{text: 'Cite', action: this.setRightPanelMode.bind(this, 'cite'), active: this.state.rightPanelMode === 'cite'},
			{text: 'Followers', action: this.setRightPanelMode.bind(this, 'followers'), active: this.state.rightPanelMode === 'followers'},
			{text: 'Export', action: this.setRightPanelMode.bind(this, 'export'), active: this.state.rightPanelMode === 'export'},

			// {link: '/pub/' + this.props.slug, text: 'Contents', active: !this.props.meta},
			// {link: '/pub/' + this.props.slug + '/contributors', text: 'Contributors', active: this.props.meta === 'contributors'},
			// {link: '/pub/' + this.props.slug + '/versions', text: 'Versions', active: this.props.meta === 'versions'},
			// {link: '/pub/' + this.props.slug + '/journals', text: 'Journals', active: this.props.meta === 'journals'},
			// {link: '/pub/' + this.props.slug + '/analytics', text: 'Analytics', active: this.props.meta === 'analytics'},
			// {link: '/pub/' + this.props.slug + '/cite' + versionQuery, text: 'Cite', active: this.props.meta === 'cite'},
			// {link: '/pub/' + this.props.slug + '/followers', text: 'Followers', active: this.props.meta === 'followers'},
			// {link: '/pub/' + this.props.slug + '/export' + versionQuery, text: 'Export', active: this.props.meta === 'export'},
		];

		// Remove Export option if the atom type is not a doc
		// In the future, we may add export for datasets, images, etc.
		// But for now that's ill defined
		if (atomData.type !== 'document') { rightPanelNavItems.pop(); }

		const authorsData = safeGetInToJS(this.props.atomData, ['authorsData']) || [];
		const authorList = atomData.customAuthorString ? [<Link to={'/pub/' + this.props.slug + '/contributors'} key={'author-0'}>{atomData.customAuthorString}</Link>] : authorsData.map((item, index)=> {
			return <Link to={'/user/' + item.source.username} key={'author-' + index} className={'author'}>{item.source.name}</Link>;
		});

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': { opacity: '0', },
				}} />

				{/* Pub Section */}
				<div style={[styles.pubSection, !this.state.showRightPanel && styles.pubSectionFull]}>

						{/* <div className={'darker-color-hover'} onClick={this.toggleRightPanel} style={[styles.toggleRightPanelButton, !this.state.showRightPanel && styles.toggleRightPanelWide]}>
							<span style={[styles.toggleRightPanelText, !this.state.showRightPanel && styles.toggleRightPanelTextWide]}>...</span>
						</div> */}

					{!!showAtomNav && 
						<div style={styles.atomNavBar}>
							<HorizontalNav navItems={atomNavItems} mobileNavButtons={mobileNavButtons}/>
						</div>
					}

					{/* Toggle Right Panel Button */}
					<div className={'opacity-on-hover'} style={styles.toggleRightPanelButton} onClick={this.toggleRightPanel}>
						<div style={styles.toggleRightPanelLine}></div>
						{this.state.showRightPanel &&
							<div style={styles.toggleRightHide}>Hide<br/>Panel</div>
						}
						{!this.state.showRightPanel &&
							<div style={styles.toggleRightShow}>Show<br/>Panel</div>
						}
					</div>
					
					<div className={!this.props.meta && safeGetInToJS(this.props.atomData, ['atomData', 'type']) === 'document' ? 'atom-reader atom-reader-meta' : 'atom-reader-meta'}>
						<AtomReaderHeader
							title={atomData.title}
							authors={authorList}
							versionDate={currentVersionDate}
							lastUpdated={atomData.lastUpdated}
							slug={atomData.slug}
							titleOnly={!!this.props.meta}
							atomID={atomData._id}
							isFollowing={atomData.isFollowing} />
						
						<AtomViewerPane atomData={this.props.atomData} />
						
						{atomData.isPublished &&
							<License />
						}

						
					</div>

				</div>

				{/* Right Panel Section */}
				<StickyContainer style={[styles.rightPanel, !this.state.showRightPanel && styles.hideRightPanel]}>
					<Sticky stickyStyle={this.state.showRightPanel ? {} : {left: '0px'}}>
						{/* <div className={'darker-color-hover'} onClick={this.toggleRightPanel} style={styles.toggleRightPanelButton}>
							<span style={styles.toggleRightPanelText}>...</span>
						</div> */}
						<HorizontalNav navItems={rightPanelNavItems} mobileNavButtons={mobileNavButtons}/>
						
						<div style={styles.rightPanelContent}>
							{(()=>{
								switch (this.state.rightPanelMode) {
								case 'contributors':
									return <AtomReaderContributors atomData={this.props.atomData} contributorsData={contributorsData}/>;
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
									return <StickyContainer><Discussions/></StickyContainer>;
								case 'followers':
									return <AtomReaderFollowers atomData={this.props.atomData}/>;
								case 'contents':
									return toc.map((object, index)=>{
										return <div key={'toc-' + index} className={'underlineOnHover'} style={[styles.tocItem, styles.tocLevels[object.level - 1]]} onClick={this.handleScroll.bind(this, object.id)}>{object.title}</div>;
									});
								default:
									return <Discussions/>;
								}
							})()}
						</div>
						
					</Sticky>
				</StickyContainer>


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
	
	pubSection: {
		verticalAlign: 'top',
		padding: '0em 4em',
		position: 'relative',
		marginRight: '35vw',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '0em 1em',
			marginRight: '0vw',
		},
	},
	atomNavBar: {
		width: 'calc(100% + 8em - 1px)',
		left: '-4em',
		position: 'relative',
	},
	pubSectionFull: {
		marginRight: '0vw',
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
	rightPanel: {
		verticalAlign: 'top',
		padding: '0em 0em',
		width: '35vw',
		height: '100%',
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		position: 'absolute',
		right: 0,
		top: 0,
		transition: '.15s ease-in-out transform',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	toggleRightPanelButton: {
		position: 'absolute',
		height: '100%',
		width: '4em',
		right: '-1em',
		top: '39px',
		cursor: 'pointer',
		opacity: 0,
		transition: '.2s linear opacity .1s',
		zIndex: 1,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	toggleRightPanelLine: {
		width: '1px',
		height: '100%',
		backgroundColor: '#2C2A2B',
		margin: '0em 1em 0em auto',
		
	},
	toggleRightHide: {
		position: 'fixed',
		top: '50%',
		right: 'calc(35vw + 5px)',
		textAlign: 'right',
	},
	toggleRightShow: {
		position: 'fixed',
		top: '50%',
		right: 'calc(0vw + 5px)',
		textAlign: 'right',
	},

	hideRightPanel: {
		transform: 'translate3d(100%, 0, 0)'
	},

	rightPanelContent: {
		height: 'calc(100vh - 40px)',
		width: 'calc(100% - 4em)',
		overflow: 'hidden',
		overflowY: 'scroll',
		padding: '0em 2em 1em',
	},
	
	// pubBodyWrapper: {
	// 	maxWidth: '650px',
	// 	margin: '0 auto',
	// 	padding: '0em 3em',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		maxWidth: 'auto',
	// 		padding: '0em 0em',
	// 	},
	// },
	// pubMetaWrapper: {
	// 	maxWidth: '1024px',
	// 	margin: '0 auto',
	// 	padding: '2em 3em',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		maxWidth: 'auto',
	// 		padding: '1em 0em',
	// 	},
	// },

	container: {
		width: '100%',
		overflow: 'hidden',
		minHeight: '100vh',
		position: 'relative',
	},

	
	// noBottomMargin: {
	// 	marginBottom: '0px',
	// },
	// buttonWrapper: {
	// 	float: 'right',
	// 	position: 'relative',
	// 	top: '8px',
	// },
	button: {
		fontSize: '.85em',
		padding: '.25em 1.5em',
	},
	tocItem: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		paddingRight: '2em',
		paddingTop: '1em',
		paddingBottom: '1em',
		paddingLeft: '2em',
		cursor: 'pointer',
	},

	tocLevels: [
		{paddingLeft: '2em'},
		{paddingLeft: '4em'},
		{paddingLeft: '5em'},
		{paddingLeft: '6em'},
		{paddingLeft: '7em'},
		{paddingLeft: '8em'},
	],

};
