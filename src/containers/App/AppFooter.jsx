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
			<div className="footer darkest-bg lighter-color" style={[styles.footer, this.props.hideFooter && {display: 'none'}]}>
				<div style={{display: 'table', margin: '0 auto'}}>
					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}>PubPub</div>

						<Link style={styles.footerItem} to={'/about'}> <FormattedMessage id="footer.about" defaultMessage="About"/> </Link>
						<a style={styles.footerItem} href={'https://github.com/pubpub/pubpub'}> <FormattedMessage id="footer.code" defaultMessage="Code"/> </a>
						<a style={styles.footerItem} href={'https://github.com/pubpub/pubpub/issues'}> Feedback </a>
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}> <FormattedMessage {...globalMessages.Explore} /> </div>

						<Link style={styles.footerItem} to={'/pubs'}> <FormattedMessage {...globalMessages.Pubs} /> </Link>
						<Link style={styles.footerItem} to={'/reviews'}> Reviews </Link>
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
		padding: '3em 0px',
	},
	footerColumn: {
		display: 'table-cell',
		width: '1px',
		padding: '0px 4vw',
		fontSize: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'inline-block',
			verticalAlign: 'top',
			padding: '25px',
			width: 'auto',
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
		whiteSpace: 'nowrap',
	},
};
