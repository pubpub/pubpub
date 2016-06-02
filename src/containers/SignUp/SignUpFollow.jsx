import React, {PropTypes} from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {login} from './actions';
import {Link} from 'react-router';
import {Loader} from 'components';


import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const SignUpFollow = React.createClass({
	propTypes: {
		signUpSubmitHandler: PropTypes.func,
		errorMessage: PropTypes.string,
		isLoading: PropTypes.bool,
	},

	signUpSubmit: function(evt) {
		evt.preventDefault();
	},

	render: function() {
		const metaData = {
			title: 'PubPub | Follow',
		};
		const isLoading = this.props.isLoading;
		const errorMessage = this.props.errorMessage;

		return (
			<div className={'signup-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1><FormattedMessage {...globalMessages.SignUp}/></h1>
				<p style={styles.subHeader}>Follow people and journals to stay up to date with the communities you care about.</p>
				<p>Follow 5 or more to continue</p>
				
				
			</div>
		);
	}

});

export default Radium(SignUpFollow);

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
