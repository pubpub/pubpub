import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';


let styles = {};

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
			<div style={styles.container}>

				<DocumentMeta {...metaData} />
				<div style={styles.top}>
					<h2 style={styles.text}>Landing</h2>
					<Link style={styles.text}to={`/subdomain`}> subdomain </Link> | 
					<Link style={styles.text}to={`/pub/cat/edit`}> edit </Link> | 
					<Link style={styles.text}to={`/explore`}> explore </Link> | 
					<Link style={styles.text}to={`/profile/istravis`}> profile </Link> | 
					<Link style={styles.text}to={`/pub/cat`}> reader </Link> | 
				</div>
				<div style={styles.lower}>
					<h3 style={styles.textDark}>Here is some more content!</h3>
				</div>
				

			</div>
		);
	}

});

export default connect( state => {
	return {landingData: state.landing};
})( Radium(Landing) );

styles = {
	container: {
		height: '100%',
		overflow: 'hidden',
		overflowY: 'scroll'
	},
	top: {
		backgroundColor: globalStyles.headerBackground,
		overflow: 'hidden',
		height: 400
	},
	text: {
		color: globalStyles.headerText,
		textDecoration: 'none',
	},
	textDark: {
		color: globalStyles.headerBackground,
	},
	lower: {
		overflow: 'hidden',
		height: 300,
		backgroundColor: globalStyles.sideBackground
	}


};
