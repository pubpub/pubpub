import React from 'react';
import Radium from 'radium';
// import { Link } from 'react-router';
// import {globalStyles} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles;

export const AppMessage = React.createClass({
	onGotIt: function() {
		window.localStorage.migrationMsg = true;
		this.forceUpdate();
	},

	render: function() {
		if (typeof window === 'undefined' || typeof window.localStorage === 'undefined' || window.localStorage.migrationMsg === 'true') {
			return null;
		}
		return (
			<div style={styles.container}>
				<div style={styles.content}>
					<div>We've made some <a style={styles.emailLink} href={'https://github.com/pubpub/pubpub/blob/master/CHANGELOG.md'} target={'_blank'}>big changes</a> to PubPub!</div>
					<div>See something you like? Or a bug perhaps? <a style={styles.emailLink} href="mailto:pubpub@media.mit.edu" target="_top">Please let us know!</a></div>
					<div onClick={this.onGotIt} className={'button'} style={styles.button}>Got it!</div>
				</div>
			</div>

		);
	}
});

export default Radium(AppMessage);

styles = {
	button: {
		display: 'block',
		width: '3em',
		margin: '.5em auto 0em',
		':hover': {
			// textDecoration: 'underline',
			borderColor: '#808284',
		},
	},
	container: {
		position: 'fixed',
		zIndex: 4,
		top: 0,
		left: 0,
		right: 0,
		textAlign: 'center',
		fontSize: '0.95em',
		pointerEvents: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			borderTop: '1px solid #58585B',
			position: 'static',
			padding: '0em 0em',
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
		padding: '0.5em 1em 0.5em 1em',
		fontSize: '0.80em',
		boxShadow: '0px 1px 5px 1px rgba(0, 0, 0, 0.2)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			top: '0px',
			borderRadius: '0px',
			padding: '0px 1em 0px 1em',
		}
	},
	emailLink: {
		cursor: 'pointer',
		color: 'white',
		textDecoration: 'underline',
	},
};
