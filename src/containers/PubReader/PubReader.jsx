import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {getPub} from '../../actions/reader';
import {updateDelta} from '../../actions/nav';
import {PubBody, PubModals, PubNav, LoaderDeterminate, PubDiscussions, PubStatus, PubReviews, PubLeftBar} from '../../components';
import {globalStyles} from '../../utils/styleConstants';
import { pushState, go } from 'redux-router';


import markLib from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
markLib.setExtensions(markdownExtensions);

let styles = {};

const PubReader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		slug: PropTypes.string,
		query: PropTypes.object,
		delta: PropTypes.number,
		routeKey: PropTypes.string,
		// query : {
			// modal: tableOfContents | history | source | cite | status | discussions 
			// historyDiff: integer
			// version: integer
		// }
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
			if (getState().reader.getIn(['pubData', 'slug']) !== routeParams.slug) {
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
		// console.log('version is ' + version);

		const inputMD = this.props.readerData.getIn(['pubData', 'history', version, 'markdown']) || '';
		const mdOutput = markLib(inputMD, Object.values({} || {}));
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
			const mdOutput = markLib(nextProps.readerData.getIn(['pubData', 'history', version, 'markdown']), Object.values({} || {}));
			this.setState({
				htmlTree: mdOutput.tree,
				TOC: mdOutput.travisTOCFull,
			});	
		}
		
	},

	// componentWillUnmount() {
	// 	window.scrollTo(0, 0);
	// },

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.2s linear transform'
		};
	},

	goBack: function(backCount) {
		if (this.props.delta + backCount < 0) {
			// If there is no history with which to go back, clear the query params
			this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {}));
		} else {
			this.props.dispatch(updateDelta(backCount + 1)); // Keep track of nav.delta so we can handle cases where the page was directly navigated to.
			this.props.dispatch(go(backCount)); 
		}
			
			
	},

	setQuery: function(queryObject) {
		this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {...this.props.query, ...queryObject}));
	},

	clearVersion: function() {
		this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {}));
	},

	render: function() {
		const metaData = {};
		if (this.props.readerData.getIn(['pubData', 'title'])) {
			metaData.title = 'PubPub - ' + this.props.readerData.getIn(['pubData', 'title']);
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}
		
		const pubData = this.props.readerData.get('pubData').toJS();
		const version = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					
					<PubLeftBar />

				</div>

				<div className="centerBar" style={[styles.centerBar, this.props.query.mode !== undefined && styles.centerBarModalActive]}>

					<PubNav 
						height={this.height} 
						setQueryHandler={this.setQuery} 
						status={this.props.readerData.get('status')} 
						slug={this.props.slug} 
						isAuthor={pubData.isAuthor}/>

					<LoaderDeterminate 
						value={this.props.readerData.get('status') === 'loading' ? 0 : 100}/>

					{
						this.props.query.version 
							? <div key={'versionNotification'} style={styles.versionNotification} onClick={this.clearVersion}>Reading Version {this.props.query.version}. Click to read the most recent version ({pubData.history.length}).</div>
							: null
					}

					<PubBody
						status={this.props.readerData.get('status')}
						title={pubData.history[version].title} 
						abstract={pubData.history[version].abstract} 
						htmlTree={this.state.htmlTree}
						authors={pubData.history[version].authors}/>

					<PubModals 
						status={this.props.readerData.get('status')} 
						setQueryHandler={this.setQuery}
						goBackHandler={this.goBack}
						query={this.props.query}

						// TOC Props
						tocData={this.state.TOC}
						// Source Props
						historyObject={pubData.history[version]}
						// History Props
						historyData={pubData.history} />

				</div>

				<div className="rightBar" style={[styles.rightBar, styles[this.props.readerData.get('status')]]}>
					{/* 
							Needs to be isMobile and isShow for the mobile styles to be applied, otherwise, keep the styles we got now, which show on desktop and hide otherwise.
							This will need to be done for the rightBar wrapper, and for the pub body modal wrapper
						    position: fixed;
						    top: 0;
						    width: 90vw;
						    height: 100vh;
						    background-color: red;
						    z-index: 9;
						    left: 10vw;
						    capture the invisible left section to close both the menu and the activesetting of the current component
					*/}

					<PubStatus />
					<PubReviews />
					<PubDiscussions />
				</div>
				
			</div>
		);
	}

});

export default connect( state => {
	return {
		readerData: state.reader, 
		slug: state.router.params.slug,
		query: state.router.location.query,
		delta: state.nav.get('delta'),
		routeKey: state.router.location.key,

	};
})( Radium(PubReader) );

const pubSizes = {
	mobileLeft: null,
	mobilePub: '100%',
	mobileRight: null,
	mobileMinContainer: null,
	mobileMaxContainer: '767px',

	xSmallLeft: 0,
	xSmallPub: 600,
	xSmallRight: 'calc(100% -  600px)',
	xSmallPadding: 5,
	xSmallMinContainer: 768,
	xSmallMaxContainer: 1023,

	smallLeft: 150,
	smallPub: 650,
	smallRight: 'calc(100% -  800px)',
	smallPadding: 10,
	smallMinContainer: 1024,
	smallMaxContainer: 1300,

	mediumLeft: 150,
	mediumPub: 750,
	mediumRight: 'calc(100% -  900px)',
	mediumPadding: 15,
	mediumMinContainer: 1301,
	mediumMaxContainer: 1600,

	largeLeft: 200,
	largePub: 950,
	largeRight: 'calc(100% -  1150px)',
	largePadding: 20,
	largeMinContainer: 1601,
	largeMaxContainer: 2000,

	xLargeLeft: 200,
	xLargePub: 1250,
	xLargeRight: 'calc(100% -  1450px)',
	xLargePadding: 25,
	xLargeMinContainer: 2001,
	xLargeMaxContainer: 2600,

};

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
			padding: 0,
			width: 'calc(' + pubSizes.xSmallLeft + 'px - ' + (2 * pubSizes.xSmallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xSmallPadding) + 'px)',
			marginRight: pubSizes.xSmallPub
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallPadding,
			width: 'calc(' + pubSizes.smallLeft + 'px - ' + (2 * pubSizes.smallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallPadding) + 'px)',
			marginRight: pubSizes.smallPub
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumPadding,
			width: 'calc(' + pubSizes.mediumLeft + 'px - ' + (2 * pubSizes.mediumPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumPadding) + 'px)',
			marginRight: pubSizes.mediumPub
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largePadding,
			width: 'calc(' + pubSizes.largeLeft + 'px - ' + (2 * pubSizes.largePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largePadding) + 'px)',
			marginRight: pubSizes.largePub
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargePadding,
			width: 'calc(' + pubSizes.xLargeLeft + 'px - ' + (2 * pubSizes.xLargePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xLargePadding) + 'px)',
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
		padding: 20,
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
};
