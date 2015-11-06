import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {getPub} from '../../actions/reader';
import {PubBody} from '../../components';


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

		const metaData = {
			title: 'PubPub - ' + this.props.slug
		};

		const pubData = this.props.readerData.get('pubData').toJS();

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={[styles.leftBar, styles[this.props.readerData.get('status')]]}>
					<h2>Left</h2>
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
					<h2>right</h2>
				</div>
				
			</div>
		);
	}

});

export default connect( state => {
	return {readerData: state.reader, slug: state.router.params.slug};
})( Radium(Reader) );

styles = {
	container: {
		width: '100%',
		height: '100%',
		backgroundColor: '#EAEAEA',
	},
	leftBar: {
		width: 150,
		height: '100%',
		float: 'left',
		transition: '.3s linear opacity .25s',
	},

	centerBar: {
		width: 700,
		height: 'calc(100% + 3px)',
		position: 'relative',
		top: '-3px',
		float: 'left',
		overflow: 'hidden',
		boxShadow: '0px 2px 4px 0px rgba(0,0,0,0.4)',
		zIndex: 10,
	},

	rightBar: {
		width: 'calc(100% - 850px)',
		height: '100%',
		float: 'left',
		transition: '.3s linear opacity .25s',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
};

