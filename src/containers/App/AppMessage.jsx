import React, {PropTypes} from 'react';
import Radium from 'radium';
// import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles;

export const AppMessage = React.createClass({
  onGotIt: function() {
    window.localStorage["migrationMsg"] = true;
    this.forceUpdate();
  },

	render: function() {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined" || window.localStorage["migrationMsg"] === "true") {
      return null;
    }
		return (
			<div style={styles.container}>
				<div style={styles.content}>
					<div>We've made some big changes to PubPub!
          There might be bugs or things that don't make sense, email us if you run into any:
            <a style={styles.emailLink} href="mailto:pubpub@media.mit.edu" target="_top">pubpub@media.mit.edu</a>
            <div onClick={this.onGotIt} className={'button'} style={styles.button}>Got it!</div>
          </div>
				</div>
			</div>

		);
	}
});

export default Radium(AppMessage);

styles = {
  button: {
    height: '1.25em',
    verticalAlign: 'middle',
    lineHeight: '1.25em',
    margin: '0px 1em',
    ':hover': {
      textDecoration: 'underline',
    },
  },
	container: {
		position: 'fixed',
		zIndex: 4,
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
    fontSize: '0.80em',
    height: '4.5em',
    lineHeight: '4.5em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			top: '0px',
			borderRadius: '0px',
			padding: '0px 1em 0px 1em',
      height: 'auto',
      lineHeight: '3em',
		}
	},
	emailLink: {
		cursor: 'pointer',
		padding: '0em 0em 0em 1em',
    color: 'white',
	},
};
