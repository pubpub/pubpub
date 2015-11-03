import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
// import {NARROW, getProjects} from '../../actions/editor';

let styles = {};

const Profile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	render: function() {

		const metaData = {
			title: 'PubPub - Read'
		};


		return (
			<div>

				<DocumentMeta {...metaData} />

				<h2>Profile</h2>

			</div>
		);
	}

});

export default connect( state => {
	return {editorData: state.editor};
})( Radium(Profile) );

styles = {
	
};
