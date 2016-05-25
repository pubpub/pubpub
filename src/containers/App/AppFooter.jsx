import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const AppFooter = React.createClass({
	propTypes: {
		hideFooter: PropTypes.bool
	},

	render: function() {
		return (
			<div className="footer" style={[this.props.hideFooter && {display: 'none'}]}>
				<div style={{display: 'table', margin: '0 auto'}}>
					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}>PubPub</div>

						<Link style={styles.footerItem} to={'/pub/about'}> <FormattedMessage id="footer.about" defaultMessage="About"/> </Link>
						<a style={styles.footerItem} href={'https://github.com/pubpub/pubpub'}> <FormattedMessage id="footer.code" defaultMessage="Code"/> </a>
						<Link style={styles.footerItem} to={'/pub/jobs'}> <FormattedMessage id="footer.jobs" defaultMessage="Jobs"/> </Link>
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}> <FormattedMessage {...globalMessages.Explore} /> </div>

						<Link style={styles.footerItem} to={'/pubs'}> <FormattedMessage {...globalMessages.Pubs} /> </Link>
						<Link style={styles.footerItem} to={'/journals'}> <FormattedMessage {...globalMessages.Journals} /> </Link>
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}> <FormattedMessage {...globalMessages.Contact} /> </div>

						<a style={styles.footerItem} href={'mailto:pubpub@media.mit.edu'}> <FormattedMessage id="footer.Email" defaultMessage="Email"/> </a>
						<a style={styles.footerItem} href={'https://twitter.com/pubpub'}>Twitter</a>
						<a style={styles.footerItem} href={'http://eepurl.com/bLkuVn'}> <FormattedMessage id="footer.MailingList" defaultMessage="Mailing List"/> </a>
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}> <FormattedMessage id="footer.Terms" defaultMessage="Terms"/> </div>
						
						<Link style={styles.footerItem} to={'/pub/tos'}> <FormattedMessage id="footer.TermsOfService" defaultMessage="Terms Of Service"/> </Link>
						<Link style={styles.footerItem} to={'/pub/privacy'}> <FormattedMessage id="footer.PrivacyPolicy" defaultMessage="Privacy Policy"/> </Link>
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
		fontSize: '.9em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		}
	},
	footerColumn: {
		display: 'table-cell',
		width: '1px',
		padding: '0px 4vw',
		fontSize: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '1.2em',
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
	},
	footerItem: {
		display: 'block',
		color: '#333',
		whiteSpace: 'nowrap',
		textDecoration: 'none',
	},
};
