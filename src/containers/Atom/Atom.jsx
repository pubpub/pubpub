import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import {push} from 'redux-router';
import { Link } from 'react-router';
import dateFormat from 'dateformat';
import { StickyContainer as UnwrappedStickyContainer, Sticky } from 'react-sticky';
const StickyContainer = Radium(UnwrappedStickyContainer);

import {getAtomData, submitAtomToJournals, saveVersion, updateAtomDetails, publishVersion, addContributor, updateContributor, deleteContributor} from './actions';
// import {follow, unfollow} from 'containers/Login/actions';
// import {createHighlight} from 'containers/MediaLibrary/actions';

import {Discussions, FollowButton} from 'containers';
import {HorizontalNav, License} from 'components';
import AtomContributors from './AtomContributors';
import AtomExportButton from './AtomExportButton';
import AtomCiteButton from './AtomCiteButton';
import AtomVersionsButton from './AtomVersionsButton';
import AtomDetails from './AtomDetails';
import AtomContents from './AtomContents';
import AtomMeta from './AtomMeta';
import AtomJournals from './AtomJournals';
import AtomViewerPane from './AtomViewerPane';
import AtomEditorPane from './AtomEditorPane';
import AtomSaveVersionButton from './AtomSaveVersionButton';

import {safeGetInToJS} from 'utils/safeParse';
import {generateTOC} from 'utils/generateTOC';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};
let interval;

export const Atom = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		loginData: PropTypes.object,
		slug: PropTypes.string,
		query: PropTypes.object, // version: hash
		meta: PropTypes.string,
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			return dispatch(getAtomData(routeParams.slug, routeParams.meta, location.query.version));
		}
	},

	getInitialState() {
		return {
			showRightPanel: true,
			rightPanelMode: 'discussions',
			showSaveVersion: false,

			currentDocMarkdown: '',
		};
	},

	componentWillMount() {
		// If we load into the Editor, set the default rightPanelMode to 'details'
		if (this.props.meta === 'edit')	{
			this.setState({rightPanelMode: 'details'});
		}
	},
	componentWillReceiveProps(nextProps) {
		// If we transition from view to edit, set rightPanel to 'details'
		if (this.props.meta !== 'edit' && nextProps.meta === 'edit') {
			this.setState({rightPanelMode: 'details'});
		}
		// If we transition from edit to view, set rightPanel to 'discussions'
		if (this.props.meta === 'edit' && nextProps.meta !== 'edit') {
			this.setState({rightPanelMode: 'discussions'});
		}

		// If there is a new version, redirect
		const oldVersionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];
		const newVersionsData = safeGetInToJS(nextProps.atomData, ['versionsData']) || [];
		if (newVersionsData.length === oldVersionsData.length + 1) {
			this.props.dispatch(push('/pub/' + this.props.slug));
		}

		// If we create a new document, transition properly
		const oldSlug = safeGetInToJS(this.props.atomData, ['atomData', 'slug']);
		const newSlug = safeGetInToJS(nextProps.atomData, ['atomData', 'slug']);
		if (this.props.meta === nextProps.meta && oldSlug !== newSlug) {
			this.props.dispatch(push('/pub/' + newSlug + '/edit'));
		}
	},

	componentDidMount() {
		// Set an poll to grab TOC and asset data if we're in the document editor
		// A poll is pretty ugly, but it is a bit quicker at the moment than passing a function all the way down into documentEditor.
		// Let's see if this functionality stays useful, and if so we can pass down a function call that will fire everytime document is edited.
		interval = setInterval(()=>{
			if (this.props.meta === 'edit' && safeGetInToJS(this.props.atomData, ['atomData', 'type']) === 'document') {
				if (!this.refs.atomEditorPane) {
					window.clearInterval(interval);
					return;
				}

				const newVersionContent = this.refs.atomEditorPane.refs.editor.getSaveVersionContent();
				if (this.state.currentDocMarkdown !== newVersionContent.markdown) {
					this.setState({currentDocMarkdown: newVersionContent.markdown});
				}
			}
		}, 1000);

	},

	componentWillUnmount() {
		window.clearInterval(interval);
	},

	toggleRightPanel: function() {
		this.setState({showRightPanel: !this.state.showRightPanel});
		setTimeout(()=> {
			// A scroll event is necessary to refresh the Sticky container properly
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

	saveVersionSubmit: function(versionMessage, isPublished) {
		const newVersionContent = this.refs.atomEditorPane.refs.editor.getSaveVersionContent();
		const atomData = this.props.atomData.get('atomData').toJS();
		const newVersion = {
			type: atomData.type,
			message: versionMessage,
			parent: atomData._id,
			content: newVersionContent,
			isPublished: isPublished
		};
		this.props.dispatch(saveVersion(newVersion));
	},

	updateDetails: function(newDetails) {
		const atomID = safeGetInToJS(this.props.atomData, ['atomData', '_id']);
		this.props.dispatch(updateAtomDetails(atomID, newDetails));
	},

	publishVersionHandler: function(versionID) {
		this.props.dispatch(publishVersion(versionID));
	},

	handleAddContributor: function(contributorID) {
		const atomID = safeGetInToJS(this.props.atomData, ['atomData', '_id']);
		this.props.dispatch(addContributor(atomID, contributorID));
	},

	handleUpdateContributor: function(linkID, linkType, linkRoles) {
		this.props.dispatch(updateContributor(linkID, linkType, linkRoles));
	},

	handleDeleteContributor: function(linkID) {
		this.props.dispatch(deleteContributor(linkID));
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

	// handleScroll: function(id) {
	// 	const destination = document.getElementById(id);
	// 	if (!destination) { return undefined; }
	// 	smoothScroll(destination);
	// },

	render: function() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const isEditor = this.props.meta === 'edit';

		// The editor must not be indexed by search engines, so add a noindex.
		// The reader must provide metadata for popular embed tags and proper SEO performance.
		const metaData = isEditor
		? {
			title: 'Editing ' + atomData.title + ' · PubPub',
			meta: [
				{'name': 'robots', 'content': 'noindex'},
				{'name': 'robots', 'content': 'nofollow'},
			]
		}
		: {
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

		const markdown = currentVersionContent.markdown;
		const toc = generateTOC(this.state.currentDocMarkdown || markdown).full;

		const versionQuery = this.props.query && this.props.query.version ? '?version=' + this.props.query.version : '';
		const permissionType = safeGetInToJS(this.props.atomData, ['atomData', 'permissionType']) || '';
		const versionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];

		const isLoading = safeGetInToJS(this.props.atomData, ['loading']);
		const error = safeGetInToJS(this.props.atomData, ['error']);

		const isEmbed = this.props.query && this.props.query.embed;
		const hideRightPanel = this.props.query && this.props.query.hideRightPanel;
		const linkTarget = isEmbed ? '_parent' : '_self';

		const mobileNavButtons = [
			{ type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.Discussions}/>, link: '/pub/' + this.props.slug + '/discussions' },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu}/>, action: undefined },
		];

		if (this.props.meta === 'discussions') {
			mobileNavButtons[0] = { type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.View}/>, link: '/pub/' + this.props.slug };
		}

		/* Nav Items that show above the main content */
		/* These are only shown if the user has edit rights */
		const atomNavItems = [
			{link: '/pub/' + this.props.slug, text: <FormattedMessage {...globalMessages.View}/>, active: !isEditor},

		];


		if (permissionType === 'author' || permissionType === 'editor') {
			atomNavItems.push({link: '/pub/' + this.props.slug + '/edit', text: <FormattedMessage {...globalMessages.Edit}/>, active: isEditor});
		} else {
			atomNavItems.push({link: '/pub/' + this.props.slug + '/edit', text: <FormattedMessage {...globalMessages.SuggestEdits}/>, active: isEditor});
		}

		const rightPanelNavItems = [
			{text: <FormattedMessage {...globalMessages.Details}/>, action: this.setRightPanelMode.bind(this, 'details'), active: this.state.rightPanelMode === 'details'},
			{text: <FormattedMessage {...globalMessages.Contents}/>, action: this.setRightPanelMode.bind(this, 'contents'), active: this.state.rightPanelMode === 'contents'},
			{text: <FormattedMessage {...globalMessages.Discussions}/>, action: this.setRightPanelMode.bind(this, 'discussions'), active: this.state.rightPanelMode === 'discussions'},
			{text: <FormattedMessage {...globalMessages.Contributors}/>, action: this.setRightPanelMode.bind(this, 'contributors'), active: this.state.rightPanelMode === 'contributors'},
			{text: <FormattedMessage {...globalMessages.Journals}/>, action: this.setRightPanelMode.bind(this, 'journals'), active: this.state.rightPanelMode === 'journals'},
			{text: <FormattedMessage {...globalMessages.Meta}/>, action: this.setRightPanelMode.bind(this, 'meta'), active: this.state.rightPanelMode === 'meta'},
		];

		// Remove 'Contents' option if atom is not a 'document' type
		if (safeGetInToJS(this.props.atomData, ['atomData', 'type']) !== 'document') {
			rightPanelNavItems.splice(1, 1);
		}

		// Remove 'Details' option if the user is not the author
		if (permissionType !== 'author') {
			rightPanelNavItems.shift();
		}

		const authorsData = safeGetInToJS(this.props.atomData, ['authorsData']) || [];
		const authorList = atomData.customAuthorString ? [<Link target={linkTarget} to={'/pub/' + this.props.slug + '/contributors'} key={'author-0'}>{atomData.customAuthorString}</Link>] : authorsData.map((item, index)=> {
			return <Link target={linkTarget} to={'/user/' + item.source.username} key={'author-' + index} className={'author'}>{item.source.name}</Link>;
		});

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': { opacity: '0', },
				}} />

				{/* Pub Section */}
				<StickyContainer>
				<div style={[styles.pubSection, !this.state.showRightPanel && styles.pubSectionFull]}>

					{/* Top Nav. Is sticky in the Editor */}
					<div style={styles.atomNavBar}>
						<Sticky style={styles.headerBar} isActive={isEditor}>
							{!isEmbed &&
								<HorizontalNav navItems={atomNavItems} mobileNavButtons={mobileNavButtons}/>
							}
							<div style={styles.headerMenu} id={'headerPlaceholder'}></div>
							<div style={styles.headerStatus} id={'editor-participants'} className={'editor-participants opacity-on-hover'}></div>
						</Sticky>
					</div>

					{/* Toggle Right Panel Button */}
					<div className={'opacity-on-hover'} style={styles.toggleRightPanelButton} onClick={this.toggleRightPanel}>
						<div style={styles.toggleRightPanelLine}></div>
						{this.state.showRightPanel && <div style={styles.toggleRightHide}>
						<FormattedMessage {...globalMessages.Hide}/>
						<br/>
						<FormattedMessage {...globalMessages.Panel}/>
						</div>}
						{!this.state.showRightPanel && <div style={styles.toggleRightShow}>
						<FormattedMessage {...globalMessages.Show}/>
						<br/>
						<FormattedMessage {...globalMessages.Panel}/>
						</div>}
					</div>

					{/* Pub Header and Body */}
					<div className={safeGetInToJS(this.props.atomData, ['atomData', 'type']) === 'document' ? 'atom-reader atom-reader-meta' : 'atom-reader-meta'}>

						{/* Pub Header */}
						<div className={'atom-reader-header'}>
							<h1 className={'atom-header-title'}>{atomData.title}</h1>
							<p className={'atom-header-p'}>{authorList}</p>
							<p className={'atom-header-p'}>{dateFormat(currentVersionDate, 'mmmm dd, yyyy')}</p>


							{!isEditor &&
								<div>
									<AtomVersionsButton versionsData={versionsData} permissionType={permissionType} handlePublishVersion={this.publishVersionHandler} slug={this.props.slug} buttonStyle={styles.headerAction} />
									<AtomExportButton atomData={this.props.atomData} buttonStyle={styles.headerAction} />
									<AtomCiteButton atomData={this.props.atomData} authorsData={authorsData} customAuthorString={atomData.customAuthorString} versionQuery={versionQuery} buttonStyle={styles.headerAction}/>
									<FollowButton id={atomData._id} type={'followsAtom'} isFollowing={atomData.isFollowing} buttonClasses={'light-button'} buttonStyle={styles.headerAction}/>
								</div>
							}

							{isEditor &&
								<div>
									<AtomSaveVersionButton isLoading={isLoading} error={error} handleVersionSave={this.saveVersionSubmit} buttonStyle={styles.headerAction}/>
								</div>
							}

							{/* this.props.versionDate !== this.props.lastUpdated &&
								<Link to={'/pub/' + this.props.slug} style={globalStyles.link}><p className={'atom-header-p'} style={[hideStyle, styles.updateAvailableNote]}>Newer Version Available: {dateFormat(this.props.lastUpdated, 'mmmm dd, yyyy')}</p></Link>
							*/}
						</div>

						{!isEditor &&
							<div>
								<AtomViewerPane atomData={this.props.atomData} />
								{ atomData.isPublished && <License /> }
							</div>
						}

						{isEditor &&
							<AtomEditorPane ref={'atomEditorPane'} atomData={this.props.atomData} loginData={this.props.loginData}/>
						}

					</div>

				</div>
				</StickyContainer>

				{/* Right Panel Section */}
				<StickyContainer style={[styles.rightPanel, (!this.state.showRightPanel || hideRightPanel) && styles.hideRightPanel]}>
					<Sticky stickyStyle={this.state.showRightPanel ? {} : {left: '0px'}}>
						<HorizontalNav navItems={rightPanelNavItems} mobileNavButtons={mobileNavButtons}/>

						<div style={styles.rightPanelContent}>
							{(()=>{
								switch (this.state.rightPanelMode) {
								case 'contributors':
									return (
										<AtomContributors
											atomData={this.props.atomData}
											contributorsData={contributorsData}
											handleAddContributor={this.handleAddContributor}
											handleUpdateContributor={this.handleUpdateContributor}
											handleDeleteContributor={this.handleDeleteContributor}
											isLoading={isLoading}
											error={error}
											permissionType={permissionType}/>
									);
								case 'journals':
									return <AtomJournals atomData={this.props.atomData} handleJournalSubmit={this.handleJournalSubmit}/>;
								case 'meta':
									return <AtomMeta atomData={this.props.atomData}/>;
								case 'details':
									return <AtomDetails atomData={this.props.atomData} updateDetailsHandler={this.updateDetails} isLoading={isLoading} error={error}/>;
								case 'discussions':
									return <StickyContainer><Discussions/></StickyContainer>;
								case 'contents':
									return <AtomContents atomData={this.props.atomData} tocData={toc}/>;

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
})( Radium(Atom) );

styles = {
	// exportType: {
	// 	margin: '.5em 1em',
	// 	cursor: 'pointer',
	// },
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
	saveVersion: {
		width: '100vw',
		height: '100vh',
		position: 'fixed',
		top: 0,
		zIndex: 2,
	},
	saveVersionSplash: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		backgroundColor: 'rgba(0,0,0,0.35)',
	},
	saveVersionContent: {
		padding: '1em',
		maxWidth: '800px',
		margin: '30vh auto 0',
		backgroundColor: '#FFF',
		position: 'relative'
	},
	atomNavBar: {
		width: 'calc(100% + 8em - 1px)',
		left: '-4em',
		position: 'relative',
	},

	pubSectionFull: {
		marginRight: '0vw',
	},
	headerAction: {
		marginRight: '.5em',
		padding: '0em 1em',
		lineHeight: '1.25em',
		fontSize: '0.75em',
		fontFamily: 'Open Sans',
		position: 'relative',
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
		borderLeft: '1px dashed #808284',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	toggleRightPanelLine: {
		width: '1px',
		height: '100%',
		// backgroundColor: '#2C2A2B',
		borderLeft: '1px dashed #808284',
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

	headerBar: {
		position: 'relative',
		backgroundColor: 'white',
		zIndex: 1,
	},
	headerMenu: {
		position: 'absolute',
		right: 0,
		top: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'static',
		},
	},
	headerStatus: {
		position: 'absolute',
		left: 0,
		top: 44,
		opacity: 0.75,
		transition: '.1s linear opacity',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'static',
		},
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	// versionItem: {
	// 	whiteSpace: 'nowrap',
	// 	margin: '.5em 1em',
	// 	borderBottom: '1px solid #bbbdc0',
	// 	padding: '.5em 0em',
	// },
	// versionDate: {
	// 	color: 'inherit',
	// 	textDecoration: 'none',
	// 	fontSize: '1.1em',
	// },


};
