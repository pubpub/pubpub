import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {getPub} from '../../actions/pub';
import { Link } from 'react-router';
import {PubLeftBar, PubNav, LoaderDeterminate} from '../../components';
import {PubMetaSource, PubMetaHistory, PubMetaHistoryDiff} from '../../components/PubMetaPanels';
import {globalStyles, pubSizes} from '../../utils/styleConstants';


let styles = {};

const PubMeta = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		slug: PropTypes.string,
		meta: PropTypes.string,
		query: PropTypes.object,
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

	componentWillReceiveProps(nextProps) {
		if (this.props.meta !== nextProps.meta) {
			document.getElementsByClassName('centerBar')[0].scrollTop = 0;
		}
	},

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.2s linear transform'
		};
	},

	render: function() {
		const metaData = {};
		if (this.props.readerData.getIn(['pubData', 'title'])) {
			metaData.title = 'PubPub - ' + this.props.readerData.getIn(['pubData', 'title']);
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}
		
		// const pubData = this.props.readerData.get('pubData').toJS();
		const version = this.props.query.version !== undefined ? this.props.query.version - 1 : this.props.readerData.getIn(['pubData', 'history']).size - 1;
		const versionURL = this.props.query.version !== undefined ? '?version=' + this.props.query.version : '';

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					
					<PubLeftBar 
						slug={this.props.slug} 
						query={this.props.query}
						pubStatus={this.props.readerData.getIn(['pubData', 'status'])}/>

				</div>

				<div className="centerBar" style={[styles.centerBar]}>
					<PubNav 
						height={this.height} 
						status={this.props.readerData.get('status')} 
						slug={this.props.slug} 
						meta={this.props.meta}
						query={this.props.query}/>

					<LoaderDeterminate 
						value={this.props.readerData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[styles.centerContent, styles[this.props.readerData.get('status')]]}>
						<div style={styles.metaTitle}>
							<span style={styles.metaTitleType}>{this.props.meta}:</span> 
							<Link to={'/pub/' + this.props.slug + versionURL} key={'metaTitleLink'} style={styles.metaTitleLink}><span style={styles.metaTitlePub}>{this.props.readerData.getIn(['pubData', 'title'])}</span></Link>
						</div>

						{() => {
							switch (this.props.meta) {
							case 'history':
								return (<PubMetaHistory 
										historyData={this.props.readerData.getIn(['pubData', 'history']).toJS()}
										slug={this.props.slug}/>
									);
							case 'source':
								return (<PubMetaSource 
										historyObject={this.props.readerData.getIn(['pubData', 'history', (version - 1)]).toJS()}/>
									);
							case 'historydiff':
								return (<PubMetaHistoryDiff 
										diffObject={this.props.readerData.getIn(['pubData', 'history', (version - 1), 'diffObject']).toJS()}/>
									);
							
							default:
								return null;
							}
						}()}

					</div>
					

				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		readerData: state.pub, 
		slug: state.router.params.slug,
		meta: state.router.params.meta,
		query: state.router.location.query,
	};
})( Radium(PubMeta) );

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
			marginRight: pubSizes.xSmallPubMeta
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallLeftBarPadding,
			width: 'calc(' + pubSizes.smallLeft + 'px - ' + (2 * pubSizes.smallLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallLeftBarPadding) + 'px)',
			marginRight: pubSizes.smallPubMeta
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumLeftBarPadding,
			width: 'calc(' + pubSizes.mediumLeft + 'px - ' + (2 * pubSizes.mediumLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumLeftBarPadding) + 'px)',
			marginRight: pubSizes.mediumPubMeta
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largeLeftBarPadding,
			width: 'calc(' + pubSizes.largeLeft + 'px - ' + (2 * pubSizes.largeLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largeLeftBarPadding) + 'px)',
			marginRight: pubSizes.largePubMeta
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargeLeftBarPadding,
			width: 'calc(' + pubSizes.xLargeLeft + 'px - ' + (2 * pubSizes.xLargeLeftBarPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xLargeLeftBarPadding) + 'px)',
			marginRight: pubSizes.xLargePubMeta
		},
		
		
	},
	centerContent: {
		transition: '.3s linear opacity .25s',
		padding: 15,
		fontFamily: globalStyles.headerFont,
	},
	metaTitle: {
		fontSize: '35px',
	},
	metaTitleLink: {
		textDecoration: 'none',
		
	},
	metaTitleType: {
		color: '#777',
		paddingRight: 10,
	},
	metaTitlePub: {
		color: '#444',
		':hover': {
			color: '#000',
		}
	},
	centerBar: {
		backgroundColor: 'white',
		width: 'calc(100% - 150px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		position: 'absolute',
		top: '0px',
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
			width: pubSizes.xSmallPubMeta,
			left: pubSizes.xSmallLeft,
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			width: pubSizes.smallPubMeta,
			left: pubSizes.smallLeft,
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			width: pubSizes.mediumPubMeta,
			left: pubSizes.mediumLeft,
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			width: pubSizes.largePubMeta,
			left: pubSizes.largeLeft,
		},
		'@media screen and (min-width: 2000px)': {
			width: pubSizes.xLargePubMeta,
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
		display: 'none',
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
			width: 'calc(100% - ' + pubSizes.xSmallLeft + 'px - ' + pubSizes.xSmallPubMeta + 'px - ' + (2 * pubSizes.xSmallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.xSmallPadding) + 'px)',
		},
		'@media screen and (min-width: 1024px) and (max-width: 1300px)': {
			padding: pubSizes.smallPadding,
			width: 'calc(100% - ' + pubSizes.smallLeft + 'px - ' + pubSizes.smallPubMeta + 'px - ' + (2 * pubSizes.smallPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.smallPadding) + 'px)',
		},
		'@media screen and (min-width: 1301px) and (max-width: 1600px)': {
			padding: pubSizes.mediumPadding,
			width: 'calc(100% - ' + pubSizes.mediumLeft + 'px - ' + pubSizes.mediumPubMeta + 'px - ' + (2 * pubSizes.mediumPadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.mediumPadding) + 'px)',
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largePadding,
			width: 'calc(100% - ' + pubSizes.largeLeft + 'px - ' + pubSizes.largePubMeta + 'px - ' + (2 * pubSizes.largePadding) + 'px)',
			height: 'calc(100vh - ' + globalStyles.headerHeight + ' - ' + (2 * pubSizes.largePadding) + 'px)',
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargePadding,
			width: 'calc(100% - ' + pubSizes.xLargeLeft + 'px - ' + pubSizes.xLargePubMeta + 'px - ' + (2 * pubSizes.xLargePadding) + 'px)',
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
