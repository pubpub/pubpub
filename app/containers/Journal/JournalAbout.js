import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const JournalAbout = React.createClass({
	propTypes: {
		journal: PropTypes.object,
	},

	render() {
		const journal = this.props.journal || {};
		const admins = journal.admins || [];

		return (
			<div style={styles.container}>
				<div className="pt-button-group pt-minimal">
					{journal.website &&
						<Link to={journal.website} className="pt-button">{journal.website}</Link>
					}
					{journal.twitter &&
						<Link to={'https://twitter.com/' + journal.twitter} className="pt-button">@{journal.twitter}</Link>
					}
					{journal.facebook &&
						<Link to={'https://facebook.com/' + journal.facebook} className="pt-button">facebook.com/{journal.facebook}</Link>
					}
				</div>

				{journal.longDescription &&
					<div>
						<h3>About</h3>
						<div className="pt-callout">
							<ReactMarkdown source={journal.longDescription} />
						</div>
					</div>
				}
				{journal.reviewDescription &&
					<div>
						<h3>Review Process</h3>
						<div className="pt-callout">
							<ReactMarkdown source={journal.reviewDescription} />
						</div>
					</div>
				}


				<h3><FormattedMessage {...globalMessages.Admins} /></h3>
				{admins.map((admin, index)=> {
					const user = admin.user || {};

					return (
						<div key={'adminId-' + admin.id} style={styles.adminWrapper}>
							<img src={'https://jake.pubpub.org/unsafe/50x50/' + user.image} style={styles.adminImage} alt={user.firstName + ' ' + user.lastName} />
							<div style={styles.detailsWrapper}>
								<div style={styles.adminName}>{user.firstName + ' ' + user.lastName}</div>
							</div>
						</div>
					);
				})}
			</div>
		);
	}
});

export default Radium(JournalAbout);

styles = {
	container: {
		
	},
	buttonLink: {
		textDecoration: 'none',
	},
};
