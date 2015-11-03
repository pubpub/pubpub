import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
// import {NARROW, getProjects} from '../../actions/editor';

// let styles = {};

const Reader = React.createClass({
	propTypes: {
		readerData: PropTypes.object,
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

				<h2>Reader</h2>

			</div>
		);
	}

});

export default connect( state => {
	return {readerData: state.reader};
})( Radium(Reader) );

// styles = {
	
// };
