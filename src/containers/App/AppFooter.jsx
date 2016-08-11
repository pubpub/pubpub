import React, {PropTypes} from 'react';
import Radium from 'radium';
<<<<<<< Updated upstream
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);
=======
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
						<Link style={styles.footerItem} to={'/about'}> <FormattedMessage id="footer.about" defaultMessage="About"/> </Link>
						<a style={styles.footerItem} href={'https://github.com/pubpub/pubpub'}> <FormattedMessage id="footer.code" defaultMessage="Code"/> </a>
						<a style={styles.footerItem} href={'https://github.com/pubpub/pubpub/issues'}> Feedback </a>
=======
						<Link style={styles.footerItem} to={'/pub/about'}> <FormattedMessage id="footer.about" defaultMessage="About"/> </Link>
						<a style={styles.footerItem} href={'https://github.com/pubpub/pubpub'}> <FormattedMessage id="footer.code" defaultMessage="Code"/> </a>
						<Link style={styles.footerItem} to={'/pub/jobs'}> <FormattedMessage id="footer.jobs" defaultMessage="Jobs"/> </Link>
>>>>>>> Stashed changes
					</div>

					<div style={styles.footerColumn}>
						<div style={styles.footerHeader}> <FormattedMessage {...globalMessages.Explore} /> </div>

						<Link style={styles.footerItem} to={'/pubs'}> <FormattedMessage {...globalMessages.Pubs} /> </Link>
<<<<<<< Updated upstream
						{/* <Link style={styles.footerItem} to={'/reviews'}> Reviews </Link> */}
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
		padding: '3em 0px',
=======
		padding: '40px 0px',
		// fontSize: '.9em',
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
		display: 'block',
		whiteSpace: 'nowrap',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '0.25em 0em',
		}
=======
		...globalStyles.link,
		display: 'block',
		whiteSpace: 'nowrap',
		textDecoration: 'none',
>>>>>>> Stashed changes
	},
};
