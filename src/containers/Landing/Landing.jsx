import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
// import {NARROW, getProjects} from '../../actions/editor';

// let styles = {};

const Landing = React.createClass({
	propTypes: {
		landingData: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	render: function() {

		const metaData = {
			title: 'PubPub'
		};


		return (
			<div>

				<DocumentMeta {...metaData} />

				<h2>Landing</h2>
				<Link to={`/subdomain`}> subdomain </Link> | 
				<Link to={`/pub/cat/edit`}> edit </Link> | 
				<Link to={`/explore`}> explore </Link> | 
				<Link to={`/profile/istravis`}> profile </Link> | 
				<Link to={`/pub/cat`}> reader </Link> | 

			</div>
		);
	}

});

export default connect( state => {
	return {landingData: state.landing};
})( Radium(Landing) );

// styles = {
	
// };
