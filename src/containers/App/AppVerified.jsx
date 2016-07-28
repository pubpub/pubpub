import React, {PropTypes} from 'react';
import Radium from 'radium';
// import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles;

export const AppVerified = React.createClass({
	propTypes: {
		isNotVerified: PropTypes.bool,
		handleResendEmail: PropTypes.func,
	},

	getInitialState() {
		return {
			emailResent: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		
	},

	resendEmail: function() {
		this.setState({emailResent: true});
		this.props.handleResendEmail();
	},

	render: function() {
		if (!this.props.isNotVerified) { return null; }
		return (
			<div style={styles.container}>
				<div style={styles.content}>
					Account Unverified. 
					{this.state.emailResent
						? <span style={styles.emailResent}>Verification email resent!</span>
						: <span className={'underlineOnHover'} style={styles.emailLink} onClick={this.resendEmail}>Resend verification email</span>
					}
				</div>
			</div>
			
		);
	}
});

export default Radium(AppVerified);

styles = {
	container: {
		position: 'fixed',
		top: 0,
		left: 0,
		right: 0,
		textAlign: 'center',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		fontSize: '0.85em',
		pointerEvents: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			borderTop: '1px solid #58585B',
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
			position: 'static',
		}
	},
	content: {
		display: 'inline-block',
		pointerEvents: 'auto',
		backgroundColor: '#2C2A2B',
		// backgroundColor: '#2c0070',
		color: 'white',
		position: 'relative',
		top: '-2px',
		borderRadius: '2px',
		padding: '2px 1em 0px 1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			top: '0px',
			borderRadius: '0px',
			padding: '0px 1em 0px 1em',
		}
	},
	emailLink: {
		cursor: 'pointer',
		padding: '0em 0em 0em 1em'
	},
	emailResent: {
		padding: '0em 0em 0em 1em'	
	},
};
