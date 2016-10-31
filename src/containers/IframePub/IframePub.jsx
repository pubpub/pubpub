import dateFormat from 'dateformat';
import Helmet from 'react-helmet';
import Radium, {Style} from 'radium';
import React, { PropTypes } from 'react';
import {HorizontalNav, License, SelectionPopup} from 'components';
import {Discussions, FollowButton} from 'containers';
import {createReplyDocument} from 'containers/Discussions/actions';
import {FormattedMessage} from 'react-intl';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { StickyContainer as UnwrappedStickyContainer, Sticky } from 'react-sticky';
import {push} from 'redux-router';
import {generateTOC} from 'utils/generateTOC';
import {globalMessages} from 'utils/globalMessages';
import {safeGetInToJS} from 'utils/safeParse';
import {globalStyles} from 'utils/styleConstants';

import AtomAnalytics from 'containers/Atom/AtomAnalytics';
import AtomCiteButton from 'containers/Atom/AtomCiteButton';
import AtomContents from 'containers/Atom/AtomContents';
import AtomContributors from 'containers/Atom/AtomContributors';
import AtomDetails from 'containers/Atom/AtomDetails';
import AtomEditorPane from 'containers/Atom/AtomEditorPane';
import AtomExportButton from 'containers/Atom/AtomExportButton';
import AtomFollowers from 'containers/Atom/AtomFollowers';
import AtomHeaderDetail from 'containers/Atom/AtomHeaderDetail';
import AtomHeaderDetailsMulti from 'containers/Atom/AtomHeaderDetailsMulti';
import AtomJournals from 'containers/Atom/AtomJournals';
import AtomSaveVersionButton from 'containers/Atom/AtomSaveVersionButton';
import AtomVersions from 'containers/Atom/AtomVersions';
import AtomViewerPane from 'containers/Atom/AtomViewerPane';
import {getAtomData, submitAtomToJournals, saveVersion, updateAtomDetails, publishVersion, addContributor, updateContributor, deleteContributor} from 'containers/Atom/actions';

const StickyContainer = Radium(UnwrappedStickyContainer);

// import {createHighlight} from 'containers/MediaLibrary/actions';




let styles = {};
let interval;

export const IframePub = React.createClass({
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
			this.setState({
				showRightPanel: false,
				rightPanelMode: 'contents'
			});
		}

		if (this.props.meta === 'discussions')	{
			this.setState({
				showRightPanel: false,
				rightPanelMode: 'contents'
			});
		}
	},
	componentWillReceiveProps(nextProps) {
		// If we transition from view to edit, set rightPanel to 'details'
		if (this.props.meta !== 'edit' && nextProps.meta === 'edit') {
			this.setState({
				showRightPanel: false,
				rightPanelMode: 'contents',
			});
		}
		// If we transition from edit to view, set rightPanel to 'discussions'
		if (this.props.meta === 'edit' && nextProps.meta !== 'edit') {
			this.setState({
				showRightPanel: true,
				rightPanelMode: 'discussions'
			});
		}

		if (this.props.meta === 'discussions' && nextProps.meta !== 'discussions') {
			this.setState({
				showRightPanel: false,
				rightPanelMode: 'discussions'
			});
		}

		// If there is a new version, redirect
		// if (!error){
		const oldVersionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];
		const newVersionsData = safeGetInToJS(nextProps.atomData, ['versionsData']) || [];
		if (newVersionsData.length === oldVersionsData.length + 1) {
			this.props.dispatch(push('/pub/' + this.props.slug));
		}

		// If we create a new document, transition properly
		const oldSlug = safeGetInToJS(this.props.atomData, ['atomData', 'slug']);
		const newSlug = safeGetInToJS(nextProps.atomData, ['atomData', 'slug']);
		// if (newSlug !== undefined && this.props.meta === nextProps.meta && oldSlug !== newSlug) {
		// 	this.props.dispatch(push('/pub/' + newSlug + '/edit'));
		// }
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

	addSelection: function(versionContent, highlightObject) {

		highlightObject.sourcePub = safeGetInToJS(this.props.atomData, ['atomData', '_id']);
		highlightObject.sourceVersion = safeGetInToJS(this.props.atomData, ['currentVersionData', '_id']);
		// console.log(versionContent, highlightObject);
		const atomType = 'document';
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || [];
		const discussionsData = safeGetInToJS(this.props.atomData, ['discussionsData']) || [];
		const rootReply = discussionsData.length ? discussionsData[0].linkData.metadata.rootReply : atomData._id;
		const replyToID = atomData._id;
		this.props.dispatch(createReplyDocument(atomType, versionContent, 'Reply', replyToID, rootReply, highlightObject));
	},

	mobileToggleDiscussions: function() {
		this.setState({
			showRightPanel: (this.state.rightPanelMode !== 'discussions' || !this.state.showRightPanel),
			rightPanelMode: 'discussions'
		});
	},

	mobileToggleContents: function() {
		this.setState({
			showRightPanel: (this.state.rightPanelMode !== 'contents' || !this.state.showRightPanel),
			rightPanelMode: 'contents'
		});
	},

	render: function() {
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const isEditor = this.props.meta === 'edit';
		const isDiscussions = this.props.meta === 'discussions';

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
		const featuredData = safeGetInToJS(this.props.atomData, ['featuredData']) || [];
		const followersData = safeGetInToJS(this.props.atomData, ['followersData']) || [];
		const replyParentData = safeGetInToJS(this.props.atomData, ['replyParentData']) || {};
		const versionsData = safeGetInToJS(this.props.atomData, ['versionsData']) || [];

		const currentVersionContent = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content']) || {};
		const currentVersionDate = safeGetInToJS(this.props.atomData, ['currentVersionData', 'createDate']);


		const markdown = currentVersionContent.markdown;
		const toc = generateTOC(this.state.currentDocMarkdown || markdown).full;

		const versionQuery = this.props.query && this.props.query.version ? '?version=' + this.props.query.version : '';
		const permissionType = safeGetInToJS(this.props.atomData, ['atomData', 'permissionType']) || '';


		const isLoading = safeGetInToJS(this.props.atomData, ['loading']);
		const error = safeGetInToJS(this.props.atomData, ['error', 'message']);

		const showTitle = this.props.query && this.props.query.title === 'true' || !this.props.query.title;

		const hideRightPanel = this.props.query && this.props.query.hideRightPanel;
		const linkTarget = '_parent';

		const mobileNavButtons = [
			// (isEditor) ? null : { type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Contents}/>, action: this.mobileToggleContents },
			null,
			// { type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Discussions}/>, action: this.mobileToggleDiscussions },
			{ type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.Discussions}/>, link: '/pub/' + this.props.slug + '/discussions'},
		// 	{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu}/>, action: undefined },
		];

		if (this.props.meta === 'discussions') {
			mobileNavButtons[1] = { type: 'link', mobile: true, text: <FormattedMessage {...globalMessages.View}/>, link: '/pub/' + this.props.slug };
		}

		/* Nav Items that show above the main content */
		/* These are only shown if the user has edit rights */
		const atomNavItems = [
			{link: '/pub/' + this.props.slug, text: <FormattedMessage {...globalMessages.View}/>, active: !isEditor},
			{link: '/pub/' + this.props.slug + '/edit', text: <FormattedMessage {...globalMessages.Edit}/>, active: isEditor}
		];

		// if (permissionType === 'author' || permissionType === 'editor') {
		// 	atomNavItems.push({link: '/pub/' + this.props.slug + '/edit', text: <FormattedMessage {...globalMessages.Edit}/>, active: isEditor});
		// } else {
		// 	atomNavItems.push({link: '/pub/' + this.props.slug + '/edit', text: <FormattedMessage {...globalMessages.SuggestEdits}/>, active: isEditor});
		// }

		const rightPanelNavItems = [
			{text: <FormattedMessage {...globalMessages.Contents}/>, action: this.setRightPanelMode.bind(this, 'contents'), active: this.state.rightPanelMode === 'contents'},
			{text: <FormattedMessage {...globalMessages.Discussions}/>, action: this.setRightPanelMode.bind(this, 'discussions'), active: this.state.rightPanelMode === 'discussions'},
		];

		// Remove 'Contents' option if atom is not a 'document' type
		if (safeGetInToJS(this.props.atomData, ['atomData', 'type']) !== 'document') {
			rightPanelNavItems.splice(0, 1);
		}

		const authorsData = safeGetInToJS(this.props.atomData, ['authorsData']) || [];
		const authorList = atomData.customAuthorString ? [<Link target={linkTarget} style={globalStyles.link} to={'/pub/' + this.props.slug + '/contributors'} key={'author-0'}>{atomData.customAuthorString} </Link>] : authorsData.map((item, index)=> {
			return <Link target={linkTarget} style={globalStyles.link} to={'/user/' + item.source.username} key={'author-' + index} className={'author underlineOnHover'}>{item.source.name} </Link>;
		});

		let newestVersionDate = currentVersionDate;
		for (let index = 0; index < versionsData.length; index++) {
			if (newestVersionDate < versionsData[index].createDate) {
				newestVersionDate = versionsData[index].createDate;
			}
		}

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{'.pagebreak': { opacity: '0', } }} />

				{/* Pub Section */}
				<StickyContainer style={[styles.pubSection, !this.state.showRightPanel && styles.pubSectionFull, !this.state.showRightPanel && isEditor && styles.pubSectionFullEditor]}>
					{/* Top Nav. Is sticky in the Editor */}
					{/* -------------------------------- */}
					<div style={styles.atomNavBar}>
						<Sticky style={styles.headerBar} isActive={isEditor}>
							<div style={styles.headerMenu} id={'headerPlaceholder'}></div>
							<div style={[styles.headerStatus, !this.state.showRightPanel && styles.headerFull]} id={'editor-participants'} className={'editor-participants opacity-on-hover'}></div>
						</Sticky>
					</div>
					{/* -------------------------------- */}


					{/* Toggle Right Panel Button */}
					{/* ------------------------- */}
					<div className={'opacity-on-hover'} style={[styles.toggleRightPanelButton, isDiscussions && {display: 'none'}]} onClick={this.toggleRightPanel}>
						<div style={styles.toggleRightPanelLine}></div>
						{this.state.showRightPanel &&
							<div style={styles.toggleRightHide}>
								<FormattedMessage {...globalMessages.Hide}/><br/><FormattedMessage {...globalMessages.Panel}/>
							</div>
						}
						{!this.state.showRightPanel &&
							<div style={styles.toggleRightShow}>
								<FormattedMessage {...globalMessages.Show}/><br/><FormattedMessage {...globalMessages.Panel}/>
							</div>
						}
					</div>
					{/* ------------------------- */}

					{/* Atom Header and Body */}
					{/* -------------------- */}
					<div style={[styles.atomWrapper, !this.state.showRightPanel && styles.atomWrapperFull, !this.state.showRightPanel && isEditor && styles.atomWrapperFullEditor]}>
						{ error &&
							<div style={styles.errorMsg}>{error}</div>
						}

						{/* Atom Header */}
						{ !error &&

							<div style={styles.atomHeader}>
								{/* Atom Title */}
								{/* ---------- */}
								<AtomHeaderDetail
									label={(showTitle) ? <span style={styles.headerTitle}>{atomData.title}</span> : null}
									defaultMessage={null}
									editMessage={<FormattedMessage id={'iframePub.EditMetadata'} defaultMessage={'Edit Metadata'} />}
									activeMessage={<FormattedMessage id={'iframePub.HideMetadata'} defaultMessage={'Hide Metadata'} />}
									child={
										<AtomDetails
											atomData={this.props.atomData}
											updateDetailsHandler={this.updateDetails}
											isLoading={isLoading}
											error={error}/>
									}
									canEdit={permissionType === 'author' || permissionType === 'editor'}
									style={styles.headerWrapper}/>

								{/* Reply Parent Link */}
								{/* ----------------- */}
								{replyParentData.destination &&
									<Link to={'/pub/' + replyParentData.destination.slug} style={styles.replyParentLink} className={'underlineOnHover'}>Reply To: {replyParentData.destination.title}</Link>
								}

								{/* Atom Contributors */}
								{/* ----------------- */}
								<AtomHeaderDetail
									label={authorList}
									defaultMessage={<FormattedMessage id="iframePub.NContributors" defaultMessage={`{contributorCount, number} {contributorCount, plural, one {Contributor} other {Contributors} }`} values={{contributorCount: contributorsData.length}} />}
									editMessage={<FormattedMessage id={'iframePub.EditContributors'} defaultMessage={'Edit Contributors'} />}
									activeMessage={<FormattedMessage id={'iframePub.HideContributors'} defaultMessage={'Hide Contributors'} />}
									child={
										<AtomContributors
											atomData={this.props.atomData}
											contributorsData={contributorsData}
											handleAddContributor={this.handleAddContributor}
											handleUpdateContributor={this.handleUpdateContributor}
											handleDeleteContributor={this.handleDeleteContributor}
											isLoading={isLoading}
											error={error}
											permissionType={permissionType}/>
									}
									canEdit={permissionType === 'author' || permissionType === 'editor'} />

								{/* Atom Date and Versions */}
								{/* ---------------------- */}
								<AtomHeaderDetail
									label={dateFormat(currentVersionDate, 'mmmm dd, yyyy')}
									defaultMessage={<FormattedMessage id="iframePub.NVersions" defaultMessage={`{versionCount, number} {versionCount, plural, one {Version} other {Versions} }`} values={{versionCount: versionsData.length}} />}
									editMessage={<FormattedMessage id={'iframePub.ManageVersions'} defaultMessage={'Manage Versions'} />}
									activeMessage={<FormattedMessage id={'iframePub.HideVersions'} defaultMessage={'Hide Versions'} />}
									child={
										<AtomVersions
											versionsData={versionsData}
											permissionType={permissionType}
											handlePublishVersion={this.publishVersionHandler}
											slug={this.props.slug}
											buttonStyle={styles.headerAction} />
									}
									canEdit={permissionType === 'author' || permissionType === 'editor'} />

								{/* Atom Journals */}
								{/* ------------- */}
								<div style={[styles.journalSection, (featuredData.length || permissionType === 'author' || permissionType === 'editor') && {display: 'block'}]}>
									<AtomHeaderDetail
										label={featuredData.length
											? featuredData.map((featured)=> {
												const journal = featured.source;
												return (<Link key={'journal-tab-' + journal.slug} to={'/' + journal.slug} className={'darkest-bg-hover'} style={{textDecoration: 'none', backgroundColor: journal.headerColor, marginRight: '.5em', fontSize: '0.85em', display: 'inline-block'}}>
													<span style={{backgroundColor: 'rgba(0,0,0,0.15)', color: '#FFF', padding: '0em .5em'}}>{journal.journalName}</span>
												</Link>);
											})
											: <FormattedMessage id={'iframePub.NotFeaturedInJournals'} defaultMessage={'Not Featured in any Journals'} />
										}
										defaultMessage={null}
										editMessage={<FormattedMessage id={'iframePub.ManageJournals'} defaultMessage={'Manage Journals'} />}
										activeMessage={<FormattedMessage id={'iframePub.HideJournals'} defaultMessage={'Hide Journals'} />}
										child={
											<AtomJournals
												atomData={this.props.atomData}
												handleJournalSubmit={this.handleJournalSubmit}/>
										}
										canEdit={permissionType === 'author' || permissionType === 'editor'} />
								</div>

								{isEditor &&
									<div style={{margin: '1.5em 0em 0.5em'}}>
										<AtomSaveVersionButton isLoading={isLoading} error={error} handleVersionSave={this.saveVersionSubmit} buttonStyle={styles.headerAction}/>
									</div>
								}

								{!isEditor &&
									<div style={{margin: '1.5em 0em 0.5em'}}>
										{/* <AtomVersionsButton versionsData={versionsData} permissionType={permissionType} handlePublishVersion={this.publishVersionHandler} slug={this.props.slug} buttonStyle={styles.headerAction} /> */}
										<AtomExportButton atomData={this.props.atomData} buttonStyle={styles.headerAction} />
										<AtomCiteButton atomData={this.props.atomData} authorsData={authorsData} customAuthorString={atomData.customAuthorString} versionQuery={versionQuery} buttonStyle={styles.headerAction}/>
										<FollowButton id={atomData._id} type={'followsAtom'} isFollowing={atomData.isFollowing} buttonClasses={'light-button'} buttonStyle={{...styles.headerAction, ...styles.headerActionPlainPadding}}/>
										<AtomHeaderDetailsMulti
											labels={[
												<FormattedMessage id="iframePub.NFollowers" defaultMessage={`{followerCount, number} {followerCount, plural, one {Follower} other {Followers} }`} values={{followerCount: followersData.length}} />,
												// <FormattedMessage {...globalMessages.Analytics} />
											]}
											activeMessages={[
												<FormattedMessage id={'iframePub.HideFollowers'} defaultMessage={'Hide Followers'} />,
												<FormattedMessage id={'iframePub.HideAnalytics'} defaultMessage={'Hide Analytics'} />
											]}
											views={[
												<AtomFollowers atomData={this.props.atomData} />,
												<AtomAnalytics atomData={this.props.atomData}/>
											]}
											canEdit={permissionType === 'author' || permissionType === 'editor'} />


									</div>
								}

								{!isEditor && (newestVersionDate !== currentVersionDate) &&
									<Link to={'/pub/' + this.props.slug}>
										<div style={styles.notNewestVersion}>
											<FormattedMessage
													id="iframePub.NewerVersionCreated"
													defaultMessage={`Newer version created on {newerData}.`}
													values={{newerData: dateFormat(newestVersionDate, 'mmmm dd, yyyy')}} />
										</div>
									</Link>
								}

							</div>
						}

						{isEditor &&
							<AtomEditorPane ref={'atomEditorPane'} atomData={this.props.atomData} loginData={this.props.loginData}/>
						}

						{isDiscussions &&
							<Discussions/>
						}

						{!isEditor && !error && !isDiscussions &&
							<div id="atom-viewer">
								<AtomViewerPane atomData={this.props.atomData} />
								{ atomData.isPublished && <License /> }
							</div>
						}

						{!isEditor && !error && !isDiscussions && atomData.type === 'document' &&
							<SelectionPopup addSelectionHandler={this.addSelection} />
						}

					</div>
					{/* -------------------- */}
				</StickyContainer>

				{/* ------------------- */}


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
})( Radium(IframePub) );

styles = {
	atomWrapper: {
		maxWidth: '650px',
		margin: '0em auto',
		backgroundColor: 'white',
		position: 'relative',
	},
	atomWrapperFull: {
		padding: '0em 2em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0em',
		},
	},
	atomWrapperFullEditor: {
		boxShadow: '0px 0px 2px #808284',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			boxShadow: '0px 0px 0px #808284',
		},
	},
	atomHeader: {
		borderBottom: '1px solid #F3F3F4',
		marginBottom: '1em',
		paddingBottom: '1em',
	},
	headerWrapper: {
		paddingTop: '2em',
		paddingBottom: '1em',
	},
	headerTitle: {
		fontSize: '2.5em',
		// marginTop: '.75em',
		// marginBottom: '.5em',
		color: '#222',
		letterSpacing: '-2px',
		lineHeight: '1em',
		// display: 'inline-block',
		fontWeight: 'bold',
	},
	journalSection: {
		marginTop: '1em',
		display: 'none',
	},

	pubSection: {
		verticalAlign: 'top',
		padding: '0em 4em 2em',
		position: 'relative',
		backgroundColor: 'white',
		transition: '.1s linear backgroundColor',
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
	pubSectionFullEditor: {
		backgroundColor: '#F3F3F4',
	},
	headerAction: {
		marginRight: '.5em',
		padding: '0em 1.5em 0em 1em',
		lineHeight: '1.25em',
		fontSize: '0.85em',
		fontFamily: 'Open Sans',
		position: 'relative',
	},
	headerActionPlainPadding: {
		padding: '0em 1em',
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
			// display: 'block',
			// width: '100vw',
			display: 'none'
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '3em 2em 1em',
		},
	},

	container: {
		width: '100%',
		overflow: 'hidden',
		// minHeight: '100vh',
		position: 'relative',
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
	errorMsg: {
		padding: '10px'
	},
	headerStatus: {
		position: 'absolute',
		left: 'calc(32.5vw - 300px)',
		top: '10px',
		opacity: 0.75,
		display: 'none',
		transition: '.1s linear opacity',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'absolute',
			left: '100px',
			top: '20px',
			display: 'block'
		},
	},
	headerFull: {
		display: 'block',
		left: 'calc(50vw - 300px)',
	},
	notNewestVersion: {
		backgroundColor: '#363736',
		color: '#F3F3F4',
		textAlign: 'center',
		borderRadius: '1px',
		// fontSize: '0.7em',
		fontFamily: '"Open Sans", Helvetica Neue, Arial, sans-serif',
		marginTop: '10px',
		display: 'inline-block',
		padding: '0em .5em',
	},
	replyParentLink: {
		paddingBottom: '1em',
		fontSize: '.85em',
		color: '#808284',
		textDecoration: 'none',
		display: 'block',
	},

};
