import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {PreviewCard} from 'components';

import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const JrnlProfileAbout = React.createClass({
	propTypes: {
		jrnlData: PropTypes.object,
	},

	

	render: function() {
		const jrnlData = safeGetInToJS(this.props.jrnlData, ['jrnlData']) || {};

		return (
			<div>
				<a className={'underlineOnHover'} style={styles.link} href={jrnlData.website}>{jrnlData.website}</a>
				<a className={'underlineOnHover'} style={styles.link} href={'https://twitter.com/' + jrnlData.twitter}>@{jrnlData.twitter}</a>
				<a className={'underlineOnHover'} style={[styles.link, styles.lastLink]} href={'https://facebook.com/' + jrnlData.facebook}>facebook.com/{jrnlData.facebook}</a>
				
				<h3>About</h3>
				{jrnlData.about}


				<h3>Admins</h3>

				
			</div>
		);
	}
});

export default Radium(JrnlProfileAbout);

styles = {
	link: {
		paddingRight: '1em',
		marginRight: '1em',
		borderRight: '1px solid #BBBDC0',
		textDecoration: 'none',
		color: 'inherit',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingRight: 'auto',
			marginRight: 'auto',
			borderRight: '0px solid #BBBDC0',
		},
	},
	lastLink: {
		borderRight: '0px solid #BBBDC0',
	},
};
