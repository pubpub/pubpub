import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import Helmet from 'react-helmet';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import {getPub, openPubModal, closePubModal, addSelection, pubNavOut, pubNavIn, togglePubHighlights} from '../../actions/pub';
import {getRandomSlug} from '../../actions/journal';
import {toggleVisibility, follow, unfollow} from '../../actions/login';
import {closeMenu} from '../../actions/nav';

import {convertImmutableListToObject} from '../../utils/parsePlugins';

import {PubBody, PubModals, PubNav, LoaderDeterminate, PubLeftBar} from '../../components';
import {Discussions} from '../';

import {globalStyles, pubSizes} from '../../utils/styleConstants';
import {rightBarStyles} from './rightBarStyles';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

// import marked from '../../markdown/markdown';
// import markdownExtensions from '../../components/EditorPlugins';
// marked.setExtensions(markdownExtensions);

let styles = {};

const PubReader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		loginData: PropTypes.object,
		journalData: PropTypes.object,
		slug: PropTypes.string,
		query: PropTypes.object, // version: integer
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			query: {},
		};
	},

	mixins: [PureRenderMixin],

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			if (getState().pub.getIn(['pubData', 'slug']) !== routeParams.slug) {
				return dispatch(getPub(routeParams.slug, getState().journal.getIn(['journalData', '_id']), location.query.referrer ));
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
		const assets = convertImmutableListToObject( this.props.readerData.getIn(['pubData', 'history', versionIndex, 'assets']) );
		const references = convertImmutableListToObject(this.props.readerData.getIn(['pubData', 'history', versionIndex, 'references']), true);
		const selections = [];
		// const mdOutput = marked(inputMD, {assets, references, selections});
		// console.log(inputMD);
		this.setState({
			// htmlTree: mdOutput.tree,
			// TOC: mdOutput.travisTOCFull,
			inputMD: inputMD,
			assets: assets, 
			references: references,
			selections: selections,
			TOC: [],
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
			const assets = convertImmutableListToObject( nextProps.readerData.getIn(['pubData', 'history', versionIndex, 'assets']) );
			const references = convertImmutableListToObject(nextProps.readerData.getIn(['pubData', 'history', versionIndex, 'references']), true);
			const selections = [];
			// const mdOutput = marked(inputMD, {assets, references, selections});
			this.setState({
				// htmlTree: mdOutput.tree,
				// TOC: mdOutput.travisTOCFull,
				inputMD: inputMD,
				assets: assets, 
				references: references,
				selections: selections,
				TOC: [],
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
		newSelection.pub = this.props.readerData.getIn(['pubData', '_id']);
		newSelection.version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.readerData.getIn(['pubData', 'history']).size - 1) ? this.props.query.version : this.props.readerData.getIn(['pubData', 'history']).size;
		this.props.dispatch(addSelection(newSelection));
	},

	toggleHighlights: function() {
		this.props.dispatch(togglePubHighlights());
	},

	readRandomPub: function() {
		const analyticsData = {
			location: 'pub/' + this.props.slug,
			journalID: this.props.journalData.getIn(['journalData', '_id']),
			journalName: this.props.journalData.getIn(['journalData', 'journalName']),
		};
		this.props.dispatch(getRandomSlug(this.props.journalData.getIn(['journalData', '_id']), analyticsData));
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
				{property: 'article:published_time', content: pubData.history[versionIndex].publishDate},
				{property: 'article:modified_time', content: pubData.history[pubData.history.length - 1].publishDate},
				{name: 'twitter:card', content: 'summary_large_image'},
				{name: 'twitter:site', content: '@isPubPub'},
				{name: 'twitter:title', content: pubData.history[versionIndex].title},
				{name: 'twitter:description', content: pubData.history[versionIndex].abstract},
			];

			const srcRegex = /{{image:.*(source=([^\s,]*)).*}}/;
			const match = srcRegex.exec(pubData.history[versionIndex].markdown);
			const refName = match ? match[2] : undefined;
			
			let leadImage = undefined;
			for (let index = pubData.history[versionIndex].assets.length; index--;) {
				if (pubData.history[versionIndex].assets[index].refName === refName) {
					leadImage = pubData.history[versionIndex].assets[index].url_s3;
					break;
				}
			}

			if (leadImage) {
				metaData.meta.push({property: 'og:image', content: leadImage});
				metaData.meta.push({name: 'twitter:image', content: leadImage});
			}
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}

		
		// console.log(this.state.htmlTree);
		// console.log(pubData);
		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<Style rules={{
					'.pagebreak': {
						opacity: '0',
					}
				}} />

				<div className="leftBar" style={[styles.leftBar, globalStyles[this.props.readerData.get('status')], pubData.markdown === undefined && {display: 'none'}]}>

					<PubLeftBar
						slug={this.props.slug}
						query={this.props.query}
						pubStatus={pubData.status}
						readRandomPubHandler={this.readRandomPub}
						randomSlug={this.props.journalData.getIn(['journalData', 'randomSlug'])}
						journalCount={pubData.featuredInList ? pubData.featuredInList.length : 0}
						historyCount={pubData.history ? pubData.history.length : 0}
						analyticsCount={pubData.views ? pubData.views : 0}
						citationsCount={pubData.citations ? pubData.citations.length : 0}
						newsCount={pubData.news ? pubData.news.length : 0} />

				</div>

				<div className="centerBar" style={[styles.centerBar, this.props.readerData.get('activeModal') !== undefined && styles.centerBarModalActive]}>

					<PubNav
						height={this.height}
						openPubModalHandler={this.openPubModal}
						status={pubData.history[0].markdown ? this.props.readerData.get('status') : 'loading'}
						slug={this.props.slug}
						isAuthor={pubData.isAuthor}
						pubStatus={pubData.status}
						isFollowing={this.props.loginData.getIn(['userData', 'following', 'pubs']) ? this.props.loginData.getIn(['userData', 'following', 'pubs']).indexOf(this.props.readerData.getIn(['pubData', '_id'])) > -1 : false}
						handleFollow={this.followPubToggle}/>

					<LoaderDeterminate
						value={this.props.readerData.get('status') === 'loading' ? 0 : 100}/>

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

					<PubBody
						status={this.props.readerData.get('status')}
						title={pubData.history[versionIndex].title}
						abstract={pubData.history[versionIndex].abstract}
						authorsNote={pubData.history[versionIndex].authorsNote}
						minFont={15}
						// htmlTree={this.state.htmlTree}
						markdown={this.state.inputMD}
						assets={this.state.assets}
						references={this.state.references}
						selections={this.state.selections}

						authors={pubData.history[versionIndex].authors}
						addSelectionHandler={this.addSelection}
						style={pubData.history[versionIndex].style}
						showPubHighlights={this.props.readerData.get('showPubHighlights')}
						isFeatured={(pubData.featuredInList && pubData.featuredInList.indexOf(this.props.journalData.getIn(['journalData', '_id'])) > -1) || this.props.journalData.get('baseSubdomain') === null}
						errorView={pubData.pubErrorView}

						references={this.props.readerData.getIn(['pubData', 'history', versionIndex, 'references']) !== undefined ? this.props.readerData.getIn(['pubData', 'history', versionIndex, 'references']).toJS() : []}
						firstPublishedDate={this.props.readerData.getIn(['pubData', 'history', 0, 'publishDate'])}
						lastPublishedDate={this.props.readerData.getIn(['pubData', 'history', this.props.readerData.getIn(['pubData', 'history']).size - 1, 'publishDate'])} />

					<PubModals
						slug={this.props.slug}
						status={this.props.readerData.get('status')}
						pubStatus={pubData.status}
						openPubModalHandler={this.openPubModal}
						closePubModalHandler={this.closePubModal}
						closeMenuHandler={this.closeMenu}
						activeModal={this.props.readerData.get('activeModal')}

						// TOC Props
						tocData={this.state.TOC}
						// Cite Props
						pubData={pubData.history[versionIndex]}
						journalName={this.props.journalData.get('baseSubdomain') ? this.props.journalData.getIn(['journalData', 'journalName']) : ''}
						// Status Data
						featuredIn={pubData.featuredIn}
						submittedTo={pubData.submittedTo}
						// Reviews Data
						reviewsData={pubData.reviews} 
						
						// Discussions Data						
						toggleHighlightsHandler={this.toggleHighlights}
						showPubHighlights={this.props.readerData.get('showPubHighlights')}/> 
						

				</div>

				<div className="rightBar" style={[styles.rightBar, globalStyles[this.props.readerData.get('status')], pubData.markdown === undefined && {display: 'none'}]}>

					<div style={rightBarStyles.sectionHeader}><FormattedMessage {...globalMessages.discussion}/></div>
					<div style={rightBarStyles.sectionSubHeader}>
						<div>
							<Link to={'/pub/' + this.props.slug + '/invite'} style={globalStyles.link}><span key={'discussionButton2'} style={rightBarStyles.sectionSubHeaderSpan}>
								<FormattedMessage {...globalMessages.inviteReviewers}/>
							</span></Link>
							<span style={styles.optionSeparator}>|</span>
							<span style={styles.option} key={'discussions-highlight-toggle'} onClick={this.toggleHighlights}>
								<FormattedMessage {...globalMessages.turnHighlights}/>
								{' '}
								{this.props.readerData.get('showPubHighlights')
									? <FormattedMessage {...globalMessages.off}/> 
									: <FormattedMessage {...globalMessages.on}/> }
								</span>
						</div>
					</div>

					<Discussions editorCommentMode={false} />
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		readerData: state.pub,
		loginData: state.login,
		journalData: state.journal,
		slug: state.router.params.slug,
		query: state.router.location.query,
	};
})( Radium(PubReader) );

styles = {
	container: {
		width: '100%',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		backgroundColor: globalStyles.sideBackground,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			maxWidth: '100%',
			height: 'auto'
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			// backgroundColor: 'red',
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			// backgroundColor: 'orange',
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			// backgroundColor: 'yellow',
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			// backgroundColor: 'green',
		},
		'@media screen and (min-width: 2000px)': {
			// backgroundColor: 'blue',
		},

	},
	leftBar: {
		padding: 10,
		width: 'calc(150px - 20px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 20px)',
		marginRight: 650,
		float: 'left',
		transition: '.3s linear opacity .25s',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: 'Lato',
		color: globalStyles.sideText,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			padding: pubSizes.xSmallLeftBarPadding,
			width: 'calc(' + pubSizes.xSmallLeft + 'px - ' + (2 * pubSizes.xSmallLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xSmallLeftBarPadding) + 'px)',
			marginRight: pubSizes.xSmallPub
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallLeftBarPadding,
			width: 'calc(' + pubSizes.smallLeft + 'px - ' + (2 * pubSizes.smallLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallLeftBarPadding) + 'px)',
			marginRight: pubSizes.smallPub
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumLeftBarPadding,
			width: 'calc(' + pubSizes.mediumLeft + 'px - ' + (2 * pubSizes.mediumLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumLeftBarPadding) + 'px)',
			marginRight: pubSizes.mediumPub
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largeLeftBarPadding,
			width: 'calc(' + pubSizes.largeLeft + 'px - ' + (2 * pubSizes.largeLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largeLeftBarPadding) + 'px)',
			marginRight: pubSizes.largePub
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargeLeftBarPadding,
			width: 'calc(' + pubSizes.xLargeLeft + 'px - ' + (2 * pubSizes.xLargeLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xLargeLeftBarPadding) + 'px)',
			marginRight: pubSizes.xLargePub
		},


	},

	centerBar: {
		backgroundColor: 'white',
		width: 650,
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' + 3px)',
		position: 'absolute',
		top: '-3px',
		left: 150,
		float: 'left',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)',
		zIndex: 10,
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			// height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
			height: 'auto',
			position: 'relative',
			overflow: 'hidden',
			float: 'none',
			zIndex: 'auto',
			top: 0,
			left: 0,
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			width: pubSizes.xSmallPub,
			left: pubSizes.xSmallLeft,
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			width: pubSizes.smallPub,
			left: pubSizes.smallLeft,
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			width: pubSizes.mediumPub,
			left: pubSizes.mediumLeft,
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			width: pubSizes.largePub,
			left: pubSizes.largeLeft,
		},
		'@media screen and (min-width: 2000px)': {
			width: pubSizes.xLargePub,
			left: pubSizes.xLargeLeft,
		},
	},
	centerBarModalActive: {
		pointerEvents: 'none',
		overflowY: 'hidden',
	},

	rightBar: {
		padding: 10,
		width: 'calc(100% - 800px - 20px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 20px)',
		float: 'left',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: 'Lato',
		transition: '.3s linear opacity .25s',
		// Mobile
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			padding: pubSizes.xSmallPadding,
			width: 'calc(100% - ' + pubSizes.xSmallLeft + 'px - ' + pubSizes.xSmallPub + 'px - ' + (2 * pubSizes.xSmallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xSmallPadding) + 'px)',
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallPadding,
			width: 'calc(100% - ' + pubSizes.smallLeft + 'px - ' + pubSizes.smallPub + 'px - ' + (2 * pubSizes.smallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallPadding) + 'px)',
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumPadding,
			width: 'calc(100% - ' + pubSizes.mediumLeft + 'px - ' + pubSizes.mediumPub + 'px - ' + (2 * pubSizes.mediumPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumPadding) + 'px)',
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largePadding,
			width: 'calc(100% - ' + pubSizes.largeLeft + 'px - ' + pubSizes.largePub + 'px - ' + (2 * pubSizes.largePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largePadding) + 'px)',
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargePadding,
			width: 'calc(100% - ' + pubSizes.xLargeLeft + 'px - ' + pubSizes.xLargePub + 'px - ' + (2 * pubSizes.xLargePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xLargePadding) + 'px)',
		},
	},
	loading: {
		opacity: 0,
	},
	loaded: {
		opacity: 1
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
	versionNotificationLink: {
		textDecoration: 'none',
	},
	option: {
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: '#000',
		}
	},
	optionSeparator: {
		padding: '0px 6px',
	},
};
