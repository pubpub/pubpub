import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
// import {NARROW, getProjects} from '../../actions/editor';

let styles = {};

const Explore = React.createClass({
	propTypes: {
		exploreData: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	render: function() {

		const metaData = {
			title: 'PubPub - Explore'
		};


		return (
			<div>

				<DocumentMeta {...metaData} />

				<h2>Explore</h2>

			</div>
		);
	}

});

export default connect( state => {
	return {editorData: state.editor};
})( Radium(Explore) );

styles = {
	
};
