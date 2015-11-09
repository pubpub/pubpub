import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {getPub} from '../../actions/reader';
import {PubBody} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const Reader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
		slug: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routeParams) {
			return dispatch(getPub(routeParams.slug));
		}
	},

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.2s linear transform'
		};
	},

	pubNavClick: function(optionClicked) {
		console.log(optionClicked);
	},

	render: function() {
		const metaData = {};
		if (this.props.readerData.getIn(['pubData', 'title'])) {
			metaData.title = 'PubPub - ' + this.props.readerData.getIn(['pubData', 'title']);
		} else {
			metaData.title = 'PubPub - ' + this.props.slug;
		}
		
		const pubData = this.props.readerData.get('pubData').toJS();

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					<h2>Left</h2><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Table</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Nest</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Calc</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Nest</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Calc</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
				</div>

				<div className="centerBar" style={styles.centerBar}>
					<PubBody
						status = {this.props.readerData.get('status')}
						navClickFunction = {this.pubNavClick}
						title = {pubData.title} 
						abstract = {pubData.abstract} 
						markdown = {pubData.markdown}
						authors = {pubData.authors}/>

				</div>

				<div className="rightBar" style={[styles.rightBar, styles[this.props.readerData.get('status')]]}>
					<h2>Right</h2><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Table</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Nest</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Calc</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Nest</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
					<hr/>
					<h3>Calc</h3><ul><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li><li>Content</li></ul>
				</div>
				
			</div>
		);
	}

});

export default connect( state => {
	return {readerData: state.reader, slug: state.router.params.slug};
})( Radium(Reader) );

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
	smallMaxContainer: 1200,

	mediumLeft: 200,
	mediumPub: 850,
	mediumRight: 'calc(100% -  1050px)',
	mediumPadding: 15,
	mediumMinContainer: 1201,
	mediumMaxContainer: 1600,

	largeLeft: 250,
	largePub: 1050,
	largeRight: 'calc(100% -  1300px)',
	largePadding: 20,
	largeMinContainer: 1601,
	largeMaxContainer: 2000,

	xLargeLeft: 300,
	xLargePub: 1250,
	xLargeRight: 'calc(100% -  1550px)',
	xLargePadding: 25,
	xLargeMinContainer: 2001,
	xLargeMaxContainer: 2400,

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
		'@media screen and (min-width: 1024px) and (max-width: 1200px)': {
			// backgroundColor: 'orange',
		},
		'@media screen and (min-width: 1201px) and (max-width: 1600px)': {
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
		// Mobile
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			padding: 0,
			width: 'calc(' + pubSizes.xSmallLeft + 'px - ' + (2 * pubSizes.xSmallPadding) + 'px)',
			marginRight: pubSizes.xSmallPub
		},
		'@media screen and (min-width: 1024px) and (max-width: 1200px)': {
			padding: pubSizes.smallPadding,
			width: 'calc(' + pubSizes.smallLeft + 'px - ' + (2 * pubSizes.smallPadding) + 'px)',
			marginRight: pubSizes.smallPub
		},
		'@media screen and (min-width: 1201px) and (max-width: 1600px)': {
			padding: pubSizes.mediumPadding,
			width: 'calc(' + pubSizes.mediumLeft + 'px - ' + (2 * pubSizes.mediumPadding) + 'px)',
			marginRight: pubSizes.mediumPub
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largePadding,
			width: 'calc(' + pubSizes.largeLeft + 'px - ' + (2 * pubSizes.largePadding) + 'px)',
			marginRight: pubSizes.largePub
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargePadding,
			width: 'calc(' + pubSizes.xLargeLeft + 'px - ' + (2 * pubSizes.xLargePadding) + 'px)',
			marginRight: pubSizes.xLargePub
		},
		
		
	},

	centerBar: {
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
			zIndex: 0,
			top: 0,
			left: 0,
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			width: pubSizes.xSmallPub,
			left: pubSizes.xSmallLeft,
		},
		'@media screen and (min-width: 1024px) and (max-width: 1200px)': {
			width: pubSizes.smallPub,
			left: pubSizes.smallLeft,
		},
		'@media screen and (min-width: 1201px) and (max-width: 1600px)': {
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

	rightBar: {
		padding: 5,
		width: 'calc(100% - 800px - 10px)',
		height: 'calc(100vh - ' + globalStyles.headerHeight + ' - 10px)',
		float: 'left',
		overflow: 'hidden',
		overflowY: 'scroll',
		transition: '.3s linear opacity .25s',
		// Mobile
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
		// Desktop Sizes
		'@media screen and (min-width: 768px) and (max-width: 1023px)': {
			padding: pubSizes.xSmallPadding,
			width: 'calc(100% - ' + pubSizes.xSmallLeft + 'px - ' + pubSizes.xSmallPub + 'px - ' + (2 * pubSizes.xSmallPadding) + 'px)',
		},
		'@media screen and (min-width: 1024px) and (max-width: 1200px)': {
			padding: pubSizes.smallPadding,
			width: 'calc(100% - ' + pubSizes.smallLeft + 'px - ' + pubSizes.smallPub + 'px - ' + (2 * pubSizes.smallPadding) + 'px)',
		},
		'@media screen and (min-width: 1201px) and (max-width: 1600px)': {
			padding: pubSizes.mediumPadding,
			width: 'calc(100% - ' + pubSizes.mediumLeft + 'px - ' + pubSizes.mediumPub + 'px - ' + (2 * pubSizes.mediumPadding) + 'px)',
		},
		'@media screen and (min-width: 1600px) and (max-width: 2000px)': {
			padding: pubSizes.largePadding,
			width: 'calc(100% - ' + pubSizes.largeLeft + 'px - ' + pubSizes.largePub + 'px - ' + (2 * pubSizes.largePadding) + 'px)',
		},
		'@media screen and (min-width: 2000px)': {
			padding: pubSizes.xLargePadding,
			width: 'calc(100% - ' + pubSizes.xLargeLeft + 'px - ' + pubSizes.xLargePub + 'px - ' + (2 * pubSizes.xLargePadding) + 'px)',
		},
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
};

