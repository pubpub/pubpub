import React, {PropTypes} from 'react';
import {pushState} from 'redux-router';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {login} from './actions';
import {Link} from 'react-router';
import {Loader} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const SignUpDetails = React.createClass({
	propTypes: {
		submitHandler: PropTypes.func,
		errorMessage: PropTypes.string,
		isLoading: PropTypes.bool,
	},

	signUpSubmit: function(evt) {
		evt.preventDefault();
	},

	render: function() {
		const metaData = {
			title: 'PubPub | Add Details',
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.errorMessage;

		return (
			<div className={'signup-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1>Welcome!</h1>
				<p style={styles.subHeader}>Validate your identity to be part of the community and to be rewarded for your contributions!</p>
				<div>Add your image</div>
				<p>Personal website</p>
				<p>bio</p>
				<p>Verify with Twitter ORCID FB</p>
				
			</div>
		);
	}

});

export default Radium(SignUpDetails);

styles = {
	subHeader: {  
		margin: '-20px 0px 20px 0px',
		fontSize: '0.9em',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	registerLink: {
		...globalStyles.link,
		display: 'block',
		margin: '3em 0em'
	}
};
