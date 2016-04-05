import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import {getPub, openPubModal, closePubModal, pubNavOut, pubNavIn, togglePubHighlights} from './actions';
import {getRandomSlug} from 'containers/App/actions';
import {toggleVisibility, follow, unfollow} from 'containers/Login/actions';
import {closeMenu} from 'containers/App/actions';
import {createHighlight} from 'containers/MediaLibrary/actions';

// import {convertImmutableListToObject} from 'utils/parsePlugins';

import {PubBody, LoaderDeterminate} from 'components';

import PubMeta from './PubMeta/PubMeta';
import PubReaderLeftBar from './PubReaderLeftBar';
import PubReaderNav from './PubReaderNav';
import {Discussions} from 'containers';

import {globalStyles, pubSizes} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
import {generateTOC} from 'utils/generateTOC';
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
		};
	},

	componentWillMount() {

		const versionIndex = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;

		const inputMD = this.props.readerData.getIn(['pubData', 'history', versionIndex, 'markdown']) || '';
		// const assets = convertImmutableListToObject( this.props.readerData.getIn(['pubData', 'history', versionIndex, 'assets']) );
		// const references = convertImmutableListToObject(this.props.readerData.getIn(['pubData', 'history', versionIndex, 'references']), true);
		// const selections = [];
		const toc = generateTOC(inputMD).full;

		this.setState({
			inputMD: inputMD,
			// assetsObject: assets,
			// referencesObject: references,
			// selectionsArray: selections,
			TOC: toc,
		});
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
			// const assets = convertImmutableListToObject( nextProps.readerData.getIn(['pubData', 'history', versionIndex, 'assets']) );
			// const references = convertImmutableListToObject(nextProps.readerData.getIn(['pubData', 'history', versionIndex, 'references']), true);
			// const selections = [];
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
				{property: 'og:title', content: pubData.history[versionIndex].title},
				{property: 'og:type', content: 'article'},
				{property: 'og:description', content: pubData.history[versionIndex].abstract},
				{property: 'article:published_time', content: pubData.history[versionIndex].versionDate},
				{property: 'article:modified_time', content: pubData.history[pubData.history.length - 1].versionDate},
				{name: 'twitter:card', content: 'summary_large_image'},
				{name: 'twitter:site', content: '@isPubPub'},
				{name: 'twitter:title', content: pubData.history[versionIndex].title},
				{name: 'twitter:description', content: pubData.history[versionIndex].abstract},
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


		// console.log(this.state.htmlTree);
		// console.log(pubData);
		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': { opacity: '0', }
				}} />

				<div className="reader-left" style={[styles.readerLeft, globalStyles[this.props.readerData.get('status')], pubData.markdown === undefined && {display: 'none'}]}>

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

				</div>

				<div className="reader-content" style={styles.readerContent}>
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
												{/* <p>This was a {pubData.history[versionIndex].status === 'Draft' ? 'Draft' : 'Peer-Review Ready'} version.</p> */}
											</div>
										</Link>
										: null
								}

								{
									!pubData.isPublished
										? <div key={'unpublishNotification'} style={[styles.unpublishedNotification, globalStyles[this.props.readerData.get('status')]]}>
											<FormattedMessage id="pub.unpublishedNotification" defaultMessage="This pub is unpublished, and thus only accessible to collaborators."/>
										</div>
										: null
								}

								<PubBody
									status={this.props.readerData.get('status')}
									isPublished={pubData.isPublished}
									isPage={pubData.isPage}
									markdown={this.state.inputMD}
									addSelectionHandler={this.addSelection}
									styleScoped={pubData.history[versionIndex].styleScoped}
									showPubHighlights={this.props.readerData.get('showPubHighlights')}
									isFeatured={(pubData.featuredInList && pubData.featuredInList.indexOf(this.props.appData.getIn(['journalData', '_id'])) > -1) || this.props.appData.get('baseSubdomain') === null}
									errorView={pubData.pubErrorView}
									minFont={14}
									maxFont={21}/>


								{/* <PubModals
									slug={this.props.slug}
									status={this.props.readerData.get('status')}
									pubStatus={pubData.status}
									openPubModalHandler={this.openPubModal}
									closePubModalHandler={this.closePubModal}
									closeMenuHandler={this.closeMenu}
									activeModal={this.props.readerData.get('activeModal')}
									isFeatured={(pubData.featuredInList && pubData.featuredInList.indexOf(this.props.appData.getIn(['journalData', '_id'])) > -1) || this.props.appData.get('baseSubdomain') === null}

									// TOC Props
									tocData={this.state.TOC}
									// Cite Props
									pubData={pubData.history[versionIndex]}
									journalName={this.props.appData.get('baseSubdomain') ? this.props.appData.getIn(['journalData', 'journalName']) : ''}
									// Status Data
									featuredIn={pubData.featuredIn}
									submittedTo={pubData.submittedTo}
									// Reviews Data
									reviewsData={pubData.reviews}

									// Discussions Data
									toggleHighlightsHandler={this.toggleHighlights}
									showPubHighlights={this.props.readerData.get('showPubHighlights')}/> */}


							</div>

							<div className="rightBar" style={[styles.rightBar, globalStyles[this.props.readerData.get('status')], pubData.markdown === undefined && {display: 'none'}]}>

								<div style={styles.rightHeaderButtonsWrapper}>
									<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/journals'}>
										<div style={[styles.buttonWrapper, !pubData.isAuthor && {opacity: '0', pointerEvents: 'none'}]} key={'topbutton1'}>Submit To Journal</div>
									</Link>
									<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/invite'}>
										<div style={styles.buttonWrapper} key={'topbutton2'}>
											<FormattedMessage id="pub.RequestReview" defaultMessage="Request Review"/>
										</div>
									</Link>
									<Link style={globalStyles.link} to={'/pub/' + this.props.slug + '/discussions'}>
										<div style={styles.buttonWrapper} key={'topbutton3'}>
											<FormattedMessage id="pub.Expand" defaultMessage="Expand"/>
										</div>
									</Link>
									<div style={globalStyles.clearFix}></div>
								</div>

								<Discussions/>
							</div>
							<div style={globalStyles.clearFix}></div>
						</div>

					}
				</div>


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
	container: {

	},
	rightHeaderButtonsWrapper: {

	},
	buttonWrapper: {
		float: 'left',
		width: 'calc((100% / 3) - 4% - 2px)',
		margin: '0px 2%',
		padding: '2px 0px',
		border: '1px solid #444',
		textAlign: 'center',
		fontSize: '12px',
		':active': {
			transform: 'translateY(1px)',
		},
	},
	readerLeft: {
		padding: 10,
		width: 'calc(150px - 20px)',
		position: 'absolute',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},

	readerContent: {
		marginLeft: '150px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginLeft: '0px',
		}
	},
	centerBar: {
		backgroundColor: 'white',
		width: '60%',
		minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ' + 3px)',
		position: 'relative',
		top: '-3px',
		float: 'left',
		boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)',
		zIndex: 2,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			height: 'auto',
			position: 'relative',
			float: 'none',
			zIndex: 'auto',
			top: 0,
		},
	},

	rightBar: {
		float: 'left',
		width: '36%',
		padding: '0px 2%',
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},

	versionNotification: {
		textAlign: 'center',
		backgroundColor: globalStyles.sideBackground,
		padding: '5px 20px',
		margin: 5,
		fontFamily: globalStyles.headerFont,
		color: globalStyles.sideText,
		userSelect: 'none',
		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '20px',
		},

	},

	unpublishedNotification: {
		textAlign: 'center',
		backgroundColor: globalStyles.headerBackground,
		padding: '5px 20px',
		margin: 5,
		fontFamily: globalStyles.headerFont,
		color: globalStyles.headerText,
		userSelect: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '20px',
		},
	},
	versionNotificationLink: {
		textDecoration: 'none',
	},
	mobileOnly: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	}

};
