import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { Link } from 'react-router';
import {getPub, openPubModal, closePubModal} from '../../actions/pub';
import {closeMenu} from '../../actions/nav';

import {PubBody, PubModals, PubNav, LoaderDeterminate, PubDiscussions, PubStatus, PubReviews, PubLeftBar} from '../../components';
import {globalStyles, pubSizes} from '../../utils/styleConstants';

import marked from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
marked.setExtensions(markdownExtensions);

let styles = {};

const PubReader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
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
				return dispatch(getPub(routeParams.slug));
			}
			return ()=>{};
		}
	},

	getInitialState() {
		return {
			htmlTree: [],
			TOC: [],
		};
	},

	componentWillMount() {
		const version = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;

		const inputMD = this.props.readerData.getIn(['pubData', 'history', version, 'markdown']) || '';
		const mdOutput = marked(inputMD, Object.values({} || {}));
		this.setState({
			htmlTree: mdOutput.tree,
			TOC: mdOutput.travisTOCFull,
		});
	},

	componentWillReceiveProps(nextProps) {
		const oldVersion = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
		const version = nextProps.query.version !== undefined ? nextProps.query.version - 1 : nextProps.readerData.getIn(['pubData', 'history']).size - 1;

		// if (this.props.readerData.getIn(['pubData', 'history', oldVersion, 'markdown']) !== nextProps.readerData.getIn(['pubData', 'history', version, 'markdown'])) {
		if (oldVersion !== version) {
			// console.log('compiling markdown for version ' + version);
			const mdOutput = marked(nextProps.readerData.getIn(['pubData', 'history', version, 'markdown']), Object.values({} || {}));
			this.setState({
				htmlTree: mdOutput.tree,
				TOC: mdOutput.travisTOCFull,
			});	
		}
		
	},

	componentWillUnmount() {
		this.closePubModal();
	},

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.2s linear transform'
		};
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

	render: function() {
		const metaData = {};
		if (this.props.readerData.getIn(['pubData', 'title'])) {
			metaData.title = 'PubPub - ' + this.props.readerData.getIn(['pubData', 'title']);
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}
		
		const pubData = this.props.readerData.get('pubData').toJS();
		const version = this.props.query.version !== undefined && this.props.query.version > 0 && this.props.query.version < (this.props.readerData.getIn(['pubData', 'history']).size - 1)
			? this.props.query.version - 1 
			: this.props.readerData.getIn(['pubData', 'history']).size - 1;

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					
					<PubLeftBar 
						slug={this.props.slug} 
						query={this.props.query}
						pubStatus={pubData.status}/>

				</div>

				<div className="centerBar" style={[styles.centerBar, this.props.query.mode !== undefined && styles.centerBarModalActive]}>

					<PubNav 
						height={this.height} 
						openPubModalHandler={this.openPubModal} 
						status={this.props.readerData.get('status')} 
						slug={this.props.slug} 
						isAuthor={pubData.isAuthor}
						pubStatus={pubData.status}/>

					<LoaderDeterminate 
						value={this.props.readerData.get('status') === 'loading' ? 0 : 100}/>

					{
						this.props.query.version && this.props.query.version !== pubData.history.length.toString()
							? <Link to={'/pub/' + this.props.slug} style={styles.versionNotificationLink}>
								<div key={'versionNotification'} style={styles.versionNotification}>
									<p>Reading Version {this.props.query.version}. Click to read the most recent version ({pubData.history.length}).</p>
									<p>This was a {pubData.history[version].status === 'Draft' ? 'Draft' : 'Peer-Review Ready'} version.</p>
								</div>
							</Link>
							: null
					}

					<PubBody
						status={this.props.readerData.get('status')}
						title={pubData.history[version].title} 
						abstract={pubData.history[version].abstract} 
						htmlTree={this.state.htmlTree}
						authors={pubData.history[version].authors}/>

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
						// Status Data
						featuredIn={pubData.featuredIn}
						submittedTo={pubData.submittedTo}
						// Reviews Data
						reviewsData={pubData.reviews}
						// Discussions Data
						discussionsData={pubData.discussions}
						expertsData={pubData.experts} />

				</div>

				<div className="rightBar" style={[styles.rightBar, styles[this.props.readerData.get('status')]]}>
					<PubStatus 
						slug={this.props.slug}
						pubStatus={pubData.status}
						featuredIn={pubData.featuredIn}
						submittedTo={pubData.submittedTo}/>
					<PubReviews 
						slug={this.props.slug}
						reviewsData={pubData.reviews} />
					<PubDiscussions 
						slug={this.props.slug}
						discussionsData={pubData.discussions}
						expertsData={pubData.experts}/>
				</div>
				
			</div>
		);
	}

});

export default connect( state => {
	return {
		readerData: state.pub, 
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		padding: 5,
		width: 'calc(150px - 10px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 10px)',
		marginRight: 650,
		float: 'left',
		transition: '.3s linear opacity .25s',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: 'Lato',
		color: globalStyles.sideText,
		// Mobile
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		padding: 5,
		width: 'calc(100% - 800px - 10px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 10px)',
		float: 'left',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: 'Lato',
		transition: '.3s linear opacity .25s',
		// Mobile
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			fontSize: '20px',
		},

	},
	versionNotificationLink: {
		textDecoration: 'none',
	}
};
