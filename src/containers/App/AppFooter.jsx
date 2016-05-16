import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

const AppFooter = React.createClass({
	propTypes: {
		hideFooter: PropTypes.bool
	},

	render: function() {
		return (
			<div className="footer" style={[this.props.hideFooter && {display: 'none'}]}>
				<div style={{display: 'table', margin: '0 auto'}}>
					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}>PubPub</div>
						<Link style={globalStyles.link} to={'/pub/about'}><div style={styles.footerItem}>About</div></Link>
						<a style={globalStyles.link} href={'https://github.com/pubpub/pubpub'}><div style={styles.footerItem}>Code</div></a>
						<Link style={globalStyles.link} to={'/pub/jobs'}><div style={styles.footerItem}>Jobs</div></Link>

					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}>Explore</div>
						<Link style={globalStyles.link} to={'/pubs'}><div style={styles.footerItem}>Pubs</div></Link>
						<Link style={globalStyles.link} to={'/journals'}><div style={styles.footerItem}>Journals</div></Link>
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}>Contact</div>
						<a style={globalStyles.link} href={'mailto:pubpub@media.mit.edu'}><div style={styles.footerItem}>Email</div></a>
						<a style={globalStyles.link} href={'https://twitter.com/pubpub'}><div style={styles.footerItem}>Twitter</div></a>
						<a style={globalStyles.link} href={'http://eepurl.com/bLkuVn'}><div style={styles.footerItem}>Mailing List</div></a>
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}>Terms</div>
						<Link style={globalStyles.link} to={'/pub/tos'}><div style={styles.footerItem}>Terms of Service</div></Link>
						<Link style={globalStyles.link} to={'/pub/privacy'}><div style={styles.footerItem}>Privacy Policy</div></Link>
					</div>
				</div>

			</div>
		);
	}
});

export default Radium(AppFooter);

styles = {
	footer: {
		width: '95%',
		margin: '40px auto 0px auto',
		borderTop: '1px solid #CCC',
		padding: '40px 0px',
		fontFamily: globalStyles.headerFont,
		fontSize: '.9em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	footerColumn: {
		display: 'table-cell',
		width: '1px',
		padding: '0px 4vw',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 20px)',
			float: 'left',
			marginBottom: '25px',
			padding: '0px 10px',
		},
	},
	footerHeader: {
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
		paddingBottom: '2px',
		marginBottom: '8px',
		borderBottom: '1px solid #ccc',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// marginTop: '3em'
			// float: 'left',
			fontSize: '1.7em',
		},
	},
	footerItem: {
		color: '#333',
		whiteSpace: 'nowrap',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '1.5em',
			padding: '15px',
		}

	},
};
