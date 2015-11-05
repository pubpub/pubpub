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
		fetchData: function(getState, dispatch, location, routeParams) {
			return dispatch(getPub(routeParams.slug));
		}
	},

	loader: function() {
		return {
			transform: 'translateX(' + (-100 + this.props.readerData.get('loading')) + '%)',
			transition: '.5s linear transform'
		};
	},

	render: function() {

		const metaData = {
			title: 'PubPub - ' + this.props.slug
		};

		const pubData = this.props.readerData.get('pubData').toJS();

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div className="leftBar" style={styles.leftBar}>Left</div>
				<div className="centerBar" style={styles.centerBar}>
					<hr style={this.loader()}/>
					<PubBody 
						title = {pubData.title} 
						abstract = {pubData.abstract} 
						markdown = {pubData.markdown}
						authors = {pubData.authors}/>

				</div>
				<div className="rightBar" style={styles.rightBar}>right</div>		
				
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
		backgroundColor: 'grey',
		overflow: 'hidden',
	},

	leftBar: {
		width: 150,
		height: '100%',
		float: 'left',
	},

	centerBar: {
		width: 700,
		height: '100%',
		float: 'left',
		overflow: 'hidden',
	},

	rightBar: {
		width: 'calc(100% - 850px)',
		height: '100%',
		float: 'left',
	},
};

