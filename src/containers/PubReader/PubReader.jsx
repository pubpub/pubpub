import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import {getPub, openPubModal, closePubModal, pubNavOut, pubNavIn, togglePubHighlights, getPubRecommendations} from './actions';
import {getRandomSlug} from 'containers/App/actions';
import {toggleVisibility, follow, unfollow} from 'containers/Login/actions';
import {closeMenu} from 'containers/App/actions';
import {createHighlight} from 'containers/MediaLibrary/actions';
import {NavContentWrapper} from 'components';

import {PubBody, LoaderDeterminate} from 'components';

import PubMeta from './PubMeta/PubMeta';
import PubReaderLeftBar from './PubReaderLeftBar';
import PubReaderNav from './PubReaderNav';
import {Discussions} from 'containers';

import {globalStyles, pubSizes} from 'utils/styleConstants';

import {generateTOC} from 'utils/generateTOC';

// import {globalMessages} from 'utils/globalMessages';
import {createJournalURL} from 'utils/journalHelpers';

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

	mixins: [PureRenderMixin],

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			if (getState().pub.getIn(['pubData', 'slug']) !== routeParams.slug) {
				return dispatch(getPub(routeParams.slug, getState().app.getIn(['journalData', '_id']), location.query.referrer ));
			}
			return dispatch(pubNavIn());
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

	componentWillUnmount() {
		this.closePubModal();
		this.props.dispatch(pubNavOut());
	},

	openPubModal: function(modal) {
		return ()=> {
			this.props.dispatch(openPubModal(modal));
		};
	},

	closePubModal: function() {
		this.props.dispatch(closePubModal());
	},

	closeMenu: function() {
		this.props.dispatch(closeMenu());
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

	readRandomPub: function() {
		const analyticsData = {
			location: 'pub/' + this.props.slug,
			journalID: this.props.appData.getIn(['journalData', '_id']),
			journalName: this.props.appData.getIn(['journalData', 'journalName']),
		};
		this.props.dispatch(getRandomSlug(this.props.appData.getIn(['journalData', '_id']), analyticsData));
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


		const pubURL = createJournalURL({
			customDomain: this.props.appData.getIn(['journalData', 'customDomain']),
			subDomain: this.props.appData.getIn(['journalData', 'subdomain']),
			slug: this.props.slug,
		});


		const tocStyles = {
			contents: {
				position: 'relative',
				overflow: 'visible',
			},
			item: {
				display: 'block',
				textDecoration: 'none',
				color: 'inherit',
				paddingRight: '2em',
				paddingTop: '1em',
				paddingBottom: '1em',
				paddingLeft: '2em',
			},

			levels: [
				{paddingLeft: '2em'},
				{paddingLeft: '4em'},
				{paddingLeft: '5em'},
				{paddingLeft: '6em'},
				{paddingLeft: '7em'},
				{paddingLeft: '8em'},
			],
			tocBlock: {
				position: 'absolute',
				top: '1em',
				left: '0',
				maxWidth: '600px',
				boxShadow: '0px 0px 5px #ccc',
				backgroundColor: 'white',
				border: '1px solid #bbbdc0',
				padding: '1.5em',
				fontSize: '1.1em',
				borderRadius: '1px',
			}
		};



		const toc = generateTOC(pubData.markdown).full;
		const contents = (
			<div className={'showChildOnHover'}>
				Contents
				<div className={'hoverChild'} style={tocStyles.tocBlock}>
					{toc.map((object, index)=>{
						return <a href={'#' + object.id} className={'underlineOnHover'} style={[tocStyles.item, tocStyles.levels[object.level - 1]]}>{object.title}</a>
					})}
				</div>
				
			</div>
		);

		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: 'Follow', action: ()=>{} },
			{ type: 'button', mobile: true, text: 'Menu', action: undefined },
		];

		const navItems = [
			{ type: 'link', text: 'Read', link: '/pub/' + this.props.slug },
			{ type: 'link', text: 'Discussions', link: '/pub/' + this.props.slug + '/discussions' },
			{ type: 'link', text: 'Journals', link: '/pub/' + this.props.slug + '/journals' },
			{ type: 'link', text: 'History', link: '/pub/' + this.props.slug + '/history' },
			{ type: 'link', text: 'Source', link: '/pub/' + this.props.slug + '/source' },
			{ type: 'spacer' },
			{ type: 'button', text: contents, style: tocStyles.contents, className: '', action: ()=>{} },

		];

		// console.log(this.state.htmlTree);
		// console.log(pubData);

		const readMode = false; // True sets the discussions to hide and tuck away
		const hideDiscussions = !!this.props.meta || readMode;

		const customContentNavStyles = {
			contentSectionStyle: {
				display: 'table',
				tableLayout: 'fixed',
				width: 'calc(100% - 4em)',
				'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
					width: 'calc(100% - 2em)',
				},
			},
			contentNavStyle: {
				width: '125px',
			},
			contentBodyStyle: {
				paddingLeft: '5%',
				paddingRight: '5%',
				'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
					paddingLeft: '0%',
					paddingRight: '0%',
				},
			},
		};
		const icon = (
			<div>
				<div style={[styles.tocIcon]}></div>
				<div style={[styles.tocIcon]}></div>
				<div style={[styles.tocIcon]}></div>
				<div style={[styles.tocIcon]}></div>	
			</div>
			
		);

		const hideTableCell = {display: 'none'};
		const showDiscussions = this.state.showDiscussions && !this.state.showTOC || this.state.showDiscussions && this.state.lastCliked === 'discussions';
		const showTOC = this.state.showTOC && !this.state.showDiscussions || this.state.showTOC && this.state.lastCliked === 'toc';

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': { opacity: '0', },
					'.section': {maxWidth: '800px'},
					// '.headerBlock': {display: 'none'},
					// '#pub-body h1:nth-child(2), #pub-body h2:nth-child(2), #pub-body h3:nth-child(2), #pub-body h4:nth-child(2), #pub-body h5:nth-child(2), #pub-body h6:nth-child(2), #pub-body p:nth-child(2), #pub-body ul:nth-child(2), #pub-body ol:nth-child(2), #pub-body div:nth-child(2)': {
					// 	/* This makes the content (assuming there is no headerBlock displayed) flush with the top of the div */
					// 	marginTop: '0em',
					// },
					// mediaQueries: {
					// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
					// 		'#pub-body h1:nth-child(2), #pub-body h2:nth-child(2), #pub-body h3:nth-child(2), #pub-body h4:nth-child(2), #pub-body h5:nth-child(2), #pub-body h6:nth-child(2), #pub-body p:nth-child(2), #pub-body ul:nth-child(2), #pub-body ol:nth-child(2), #pub-body div:nth-child(2)': {
					// 			marginTop: 'inherit',
					// 		},
					// 	}
					// },
					'.contents li': {

					},

				}} />

				{/* <div style={[styles.readWrapper, hideDiscussions && styles.readerWrapperAnimate]}>
					<div className={'section'} style={styles.readerHeader}>
						<h1 className={'title-font'} style={styles.header}>{pubData.title}</h1>
						<p style={styles.subHeader}>Travis Rich, Dan Canova, Mitch McDuffy, Jane Austin</p>
						<p style={styles.subHeader}>First published: Nov 16, 2016  |  Most recent version: Nov 28, 2016</p>
						<div style={styles.headerBorder}></div>
					</div>
					<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons} hideRightBorder={true} {...customContentNavStyles}>
						<PubBody
							markdown={this.state.inputMD}
							isPublished={pubData.isPublished}
							addSelectionHandler={this.addSelection}
							styleScoped={pubData.history[versionIndex].styleScoped}/>
					</NavContentWrapper>
				</div>

				<div style={[styles.discussionWrapper, hideDiscussions && styles.discussionWrapperHidden]}>
					<Discussions/>	
				</div> */}
				
				

				<div style={[styles.tocSection, !showTOC && hideTableCell]}>

					{toc.map((object, index)=>{
						return <a href={'#' + object.id} className={'underlineOnHover'} style={[tocStyles.item, tocStyles.levels[object.level - 1]]}>{object.title}</a>
					})}
					
				</div>
				<div style={styles.pubSection}>
					<div className={'lighter-bg-hover'} style={styles.iconLeft} onClick={this.toggleTOC}></div>
					<div className={'lighter-bg-hover'} style={styles.iconRight} onClick={this.toggleDiscussions}></div>
					<div className={'pubSectionNav'} style={styles.pubSectionNav}>
						<div className={'pubNavDate'}  style={styles.pubNavVersion}>Version 29: Nov 12, 2015</div>

						<div className={'pubNavButtons'} style={styles.pubNavButtons}>
							<div className={'underlineOnHover'} style={styles.pubNavButton}>Contributors</div>
							<div className={'underlineOnHover'} style={styles.pubNavButton}>Journals</div>
							<div className={'underlineOnHover'} style={styles.pubNavButton}>Analytics</div>
							<div className={'underlineOnHover'} style={[styles.pubNavButton, styles.pubNavButtonLast]}>Source</div>

						</div>
						
					</div>

					<div style={styles.pubBodyWrapper}>
						<PubBody
							markdown={this.state.inputMD}
							isPublished={pubData.isPublished}
							addSelectionHandler={this.addSelection}
							styleScoped={pubData.history[versionIndex].styleScoped}/>
					</div>
					
				</div>
				<div style={[styles.discussionSection, !showDiscussions && hideTableCell]}>
					<Discussions/>	
				</div>


		

				{/* <div className="reader-left" style={[styles.readerLeft, globalStyles[this.props.readerData.get('status')], pubData.markdown === undefined && {display: 'none'}]}>

					<PubReaderLeftBar
						slug={this.props.slug}
						query={this.props.query}
						meta={this.props.meta}
						pubStatus={pubData.status}
						readRandomPubHandler={this.readRandomPub}
						randomSlug={this.props.appData.getIn(['journalData', 'randomSlug'])}
						journalCount={pubData.featuredInList ? pubData.featuredInList.length : 0}
						historyCount={pubData.history ? pubData.history.length : 0}
						analyticsCount={pubData.views ? pubData.views : 0}
						citationsCount={pubData.citations ? pubData.citations.length : 0}
						newsCount={pubData.news ? pubData.news.length : 0}
						isFollowing={this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.readerData.getIn(['pubData', '_id'])) > -1 : false}
						handleFollow={this.followPubToggle}
						isAuthor={pubData.isAuthor}/>

				</div>*/}

				{/* <div className="reader-content" style={styles.readerContent}>
					{this.props.meta
						? <PubMeta
							readerData={this.props.readerData}
							loginData={this.props.loginData}
							slug={this.props.slug}
							meta={this.props.meta}
							metaID={this.props.metaID}
							inviteStatus={this.props.inviteStatus}
							query={this.props.query}
							dispatch={this.props.dispatch} />
						: <div>
							<div className="centerBar pubScrollContainer" style={[styles.centerBar]}>

								<div style={styles.mobileOnly}>
									<PubReaderNav
										height={this.height}
										openPubModalHandler={this.openPubModal}
										status={pubData.history[0].markdown ? this.props.readerData.get('status') : 'loading'}
										slug={this.props.slug}
										isAuthor={pubData.isAuthor}
										pubStatus={pubData.status}
										isFollowing={this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.readerData.getIn(['pubData', '_id'])) > -1 : false}
										handleFollow={this.followPubToggle}/>

										<LoaderDeterminate value={this.props.readerData.get('status') === 'loading' ? 0 : 100}/>
								</div>


								{
									this.props.query.version && this.props.query.version !== pubData.history.length.toString()
										? <Link to={'/pub/' + this.props.slug} style={globalStyles.link}>
											<div key={'versionNotification'} style={[styles.versionNotification, globalStyles[this.props.readerData.get('status')]]}>
												<p>Reading Version {this.props.query.version}. Click to read the most recent version ({pubData.history.length}).</p>
											</div>
										</Link>
										: null
								}

								{
									!pubData.isPublished
										? <div className="publishedMsg" key={'unpublishNotification'} style={[styles.unpublishedNotification, globalStyles[this.props.readerData.get('status')]]}>
											<FormattedMessage id="pub.unpublishedNotification" defaultMessage="This pub is unpublished, and thus only accessible to collaborators."/>
										</div>
										: null
								}

								<PubBody
									status={this.props.readerData.get('status')}
									isPublished={pubData.isPublished}
									isPage={pubData.isPage}
									markdown={this.state.inputMD}
									pubURL={pubURL}
									addSelectionHandler={this.addSelection}
									styleScoped={pubData.history[versionIndex].styleScoped}
									showPubHighlights={this.props.readerData.get('showPubHighlights')}
									isFeatured={(pubData.featuredInList && pubData.featuredInList.indexOf(this.props.appData.getIn(['journalData', '_id'])) > -1) || this.props.appData.get('baseSubdomain') === null || !pubData.isPublished}
									errorView={pubData.pubErrorView}
									minFont={14}
									maxFont={21}/>

							</div>

							<div className="rightBar" style={[styles.rightBar]}>

								<Discussions/>

							</div>
						</div>

					}
				</div> */}


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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	discussionSection: {
		display: 'table-cell',
		verticalAlign: 'top',
		padding: '0em 2%',
		width: '40%',
		backgroundColor: '#F3F3F4',
		borderLeft: '1px solid #E4E4E4',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	pubSectionNav: {
		borderBottom: '1px solid #F3F3F4',
		fontSize: '0.85em',
		color: '#808284',
		maxWidth: '1024px',
		margin: '0 auto',
	},
	pubNavVersion: {
		display: 'inline-block',
		padding: '10px 0px',
	},
	pubNavButtons: {
		float: 'right',
	},
	pubNavButton: {
		display: 'inline-block',
		padding: '10px',
	},
	pubNavButtonLast: {
		padding: '10px 0px 10px 10px',
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

	container: {
		display: 'table',
		width: '100%',
		tableLayout: 'fixed',
		overflow: 'hidden',
	},
	// readerHeader: {
	// 	// Use 
	// 	paddingBottom: '0em',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		paddingBottom: '2em'
	// 	},
	// },
	// headerBorder: {
	// 	width: '100%',
	// 	height: '1px',
	// 	backgroundColor: '#F3F3F4',
	// 	margin: '1.5em auto',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'none',
	// 	},
	// },
	// readWrapper: {
	// 	display: 'table-cell',
	// 	verticalAlign: 'top',
	// 	transition: '.35s ease-in transform',
	// },
	// // bodyWrapper: {
	// // 	display: 'table-cell',
	// // 	// maxWidth: '700px',
	// // 	width: '60%',
	// // 	verticalAlign: 'top',
	// // 	padding: '0% 2.5%',
	// // },
	// discussionWrapper: {
	// 	backgroundColor: '#F3F3F4',
	// 	display: 'table-cell',
	// 	width: '30%',
	// 	padding: '3em 2%',
	// 	verticalAlign: 'top',
	// 	// boxShadow: 'inset 1px 0px 8px -4px black',
	// 	borderLeft: '1px solid #E4E4E4',
	// 	transition: '.35s ease-in transform',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'none',
	// 	},
	// },
	// discussionWrapperHidden: {
	// 	transform: 'translate3d(100%,0,0)',
	// },
	// readerWrapperAnimate: {
	// 	transform: 'translate3d(21%,0,0)',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		transform: 'translate3d(0%,0,0)',
	// 		transition: '.0s ease-in transform',
	// 	},
	// },

	// borderWrapper: {
	// 	padding: '0% 6.25% 1em 6.25%', // 6.25 = 2.5/.4 because this section is 40% of the whole thing, so has to divide by .4 to match teh 2.5% in bodyWrapper
	// 	borderLeft: '1px solid #BBBDC0',
	// },
	// header: {
	// 	marginBottom: '.25em',
	// },
	// subHeader: {
	// 	margin: '0em',
	// },
	// rightHeaderButtonsWrapper: {
	// 	margin: '10px 0px',
	// },
	// buttonWrapper: {
	// 	float: 'left',
	// 	width: 'calc((100% / 2) - 4% - 2px)',
	// 	margin: '0px 2%',
	// 	padding: '2px 0px',
	// 	border: '1px solid #444',
	// 	borderRadius: '2px',
	// 	textAlign: 'center',
	// 	fontSize: '12px',
	// 	':active': {
	// 		transform: 'translateY(1px)',
	// 	},
	// },
	// readerLeft: {
	// 	padding: '10px 15px',
	// 	width: 'calc(150px - 20px)',
	// 	position: 'absolute',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'none',
	// 	},
	// },

	// readerContent: {
	// 	marginLeft: '150px',
	// 	position: 'relative',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		marginLeft: '0px',
	// 	}
	// },
	// centerBar: {
	// 	overflow: 'hidden',
	// 	backgroundColor: 'white',
	// 	width: '60%',
	// 	minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ' + 3px)',
	// 	position: 'relative',
	// 	top: '-3px',
	// 	float: 'left',
	// 	boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)',
	// 	zIndex: 2,
	// 	// Mobile
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		width: '100%',
	// 		height: 'auto',
	// 		position: 'relative',
	// 		float: 'none',
	// 		zIndex: 'auto',
	// 		top: 0,
	// 	},
	// },

	// rightBar: {
	// 	float: 'left',
	// 	width: '36%',
	// 	padding: '0px 2%',
	// 	position: 'relative',
	// 	// To make discussions only as long as the pub:
	// 	// position: 'absolute',
	// 	// right: 0,
	// 	// height: '100%',
	// 	// overflow: 'hidden',

	// 	// Mobile
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'none',
	// 	}
	// },

	// versionNotification: {
	// 	textAlign: 'center',
	// 	backgroundColor: globalStyles.sideBackground,
	// 	padding: '5px 20px',
	// 	margin: 5,
	// 	fontFamily: globalStyles.headerFont,
	// 	color: globalStyles.sideText,
	// 	userSelect: 'none',
	// 	':hover': {
	// 		color: globalStyles.sideHover,
	// 		cursor: 'pointer',
	// 	},
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		fontSize: '20px',
	// 	},

	// },

	// unpublishedNotification: {
	// 	textAlign: 'center',
	// 	backgroundColor: globalStyles.headerBackground,
	// 	padding: '5px 20px',
	// 	margin: 5,
	// 	fontFamily: globalStyles.headerFont,
	// 	color: globalStyles.headerText,
	// 	userSelect: 'none',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		fontSize: '20px',
	// 	},
	// },
	// versionNotificationLink: {
	// 	textDecoration: 'none',
	// },
	// mobileOnly: {
	// 	display: 'none',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'block',
	// 	},
	// }

};
