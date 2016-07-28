import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';

import {checkEmailVerification} from './actions';
// import {globalStyles} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const EmailVerification = React.createClass({
	propTypes: {
		verificationData: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		fetchData: function(getState, dispatch, location, routeParams) {
			if (routeParams.hash) {
				return dispatch(checkEmailVerification(routeParams.hash));
			}
			return ()=>{};
		}
	},

	render: function() {

		const metaData = {
			title: 'PubPub | Email Verification',
		};
		const isValidated = this.props.verificationData && this.props.verificationData.get('emailVerified');

		return (

			<div className={'section'} style={styles.container}>

				<Helmet {...metaData} />

				{isValidated &&
					<h1>Email Verification Successful!</h1>
				}

				{!isValidated &&
					<h1>Email Verification Unsuccessful</h1>		
				}

			</div>
		);
	}

});

export default connect( state => {
	return {
		verificationData: state.emailVerification,
	};
})( Radium(EmailVerification) );

styles = {
	container: {
		textAlign: 'center',
	}
};
