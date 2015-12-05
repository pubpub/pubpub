import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {getPub} from '../../actions/reader';
// import {updateDelta} from '../../actions/nav';
import {PubLeftBar} from '../../components';
import {globalStyles} from '../../utils/styleConstants';
// import { pushState, go } from 'redux-router';


// import markLib from '../../modules/markdown/markdown';
// import markdownExtensions from '../../components/EditorPlugins';
// markLib.setExtensions(markdownExtensions);

let styles = {};

const PubMeta = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		slug: PropTypes.string,
		meta: PropTypes.string,
		// query: PropTypes.object,
		// delta: PropTypes.number,
		// routeKey: PropTypes.string,
		// query : {
			// modal: tableOfContents | history | source | cite | status | discussions 
			// historyDiff: integer
			// version: integer
		// }
		dispatch: PropTypes.func
	},

	getDefaultProps: function() {
		return {
			// query: {},
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

	// getInitialState() {
	// 	return {
	// 		htmlTree: [],
	// 		TOC: [],
	// 	};
	// },

	// componentWillMount() {
	// 	const version = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
	// 	// console.log('version is ' + version);

	// 	const inputMD = this.props.readerData.getIn(['pubData', 'history', version, 'markdown']) || '';
	// 	const mdOutput = markLib(inputMD, Object.values({} || {}));
	// 	this.setState({
	// 		htmlTree: mdOutput.tree,
	// 		TOC: mdOutput.travisTOCFull,
	// 	});
	// },

	// componentWillReceiveProps(nextProps) {
	// 	const oldVersion = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
	// 	const version = nextProps.query.version !== undefined ? nextProps.query.version - 1 : nextProps.readerData.getIn(['pubData', 'history']).size - 1;

	// 	// if (this.props.readerData.getIn(['pubData', 'history', oldVersion, 'markdown']) !== nextProps.readerData.getIn(['pubData', 'history', version, 'markdown'])) {
	// 	if (oldVersion !== version) {
	// 		// console.log('compiling markdown for version ' + version);
	// 		const mdOutput = markLib(nextProps.readerData.getIn(['pubData', 'history', version, 'markdown']), Object.values({} || {}));
	// 		this.setState({
	// 			htmlTree: mdOutput.tree,
	// 			TOC: mdOutput.travisTOCFull,
	// 		});	
	// 	}
		
	// },

	// componentWillUnmount() {
	// 	window.scrollTo(0, 0);
	// },

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.2s linear transform'
		};
	},

	// goBack: function(backCount) {
	// 	if (this.props.delta + backCount < 0) {
	// 		// If there is no history with which to go back, clear the query params
	// 		this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {}));
	// 	} else {
	// 		this.props.dispatch(updateDelta(backCount + 1)); // Keep track of nav.delta so we can handle cases where the page was directly navigated to.
	// 		this.props.dispatch(go(backCount)); 
	// 	}
			
			
	// },

	// setQuery: function(queryObject) {
	// 	this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {...this.props.query, ...queryObject}));
	// },

	// clearVersion: function() {
	// 	this.props.dispatch(pushState(null, '/pub/' + this.props.slug, {}));
	// },

	render: function() {
		const metaData = {};
		if (this.props.readerData.getIn(['pubData', 'title'])) {
			metaData.title = 'PubPub - ' + this.props.readerData.getIn(['pubData', 'title']);
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}
		
		// const pubData = this.props.readerData.get('pubData').toJS();
		// const version = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					
					<PubLeftBar />

				</div>

				<div className="centerBar" style={[styles.centerBar]}>

					<h1>Center!</h1>

				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		readerData: state.reader, 
		slug: state.router.params.slug,
		meta: state.router.params.meta,
	};
})( Radium(PubMeta) );

const pubSizes = {
	mobileLeft: null,
	mobilePub: '100%',
	mobileRight: null,
	mobileMinContainer: null,
	mobileMaxContainer: '767px',

	xSmallLeft: 0,
	xSmallPub: '100%',
	xSmallRight: '0px',
	xSmallPadding: 5,
	xSmallMinContainer: 768,
	xSmallMaxContainer: 1023,

	smallLeft: 150,
	smallPub: 'calc(100% - 150px)',
	smallRight: '0px',
	smallPadding: 10,
	smallMinContainer: 1024,
	smallMaxContainer: 1300,

	mediumLeft: 150,
	mediumPub: 'calc(100% - 150px)',
	mediumRight: '0px',
	mediumPadding: 15,
	mediumMinContainer: 1301,
	mediumMaxContainer: 1600,

	largeLeft: 200,
	largePub: 'calc(100% - 200px)',
	largeRight: '0px',
	largePadding: 20,
	largeMinContainer: 1601,
	largeMaxContainer: 2000,

	xLargeLeft: 200,
	xLargePub: 'calc(100% - 200px)',
	xLargeRight: '0px',
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
		width: 'calc(100% - 150px)',
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
