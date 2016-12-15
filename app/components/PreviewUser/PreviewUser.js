import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles;

export const PreviewUser = React.createClass({
	propTypes: {
		user: PropTypes.object,
		hideBio: PropTypes.bool,
		rightContent: PropTypes.node,
	},

	render() {
		const user = this.props.user || {};
		return (
			<div style={styles.pubPreviewWrapper}>
				<Link to={'/user/' + user.username} style={[styles.pubPreviewImageWrapper, { backgroundImage: user.image ? 'url("https://jake.pubpub.org/unsafe/150x150/' +  user.image + '")' : '' }]} />
				
				<div style={styles.pubPreviewDetails}>
					<Link to={'/user/' + user.username}><h5 style={styles.name}>{user.firstName + ' ' + user.lastName}</h5></Link>
					{!this.props.hideBio &&
						<p style={styles.bio}>{user.bio}</p>
					}
				</div>

				{!!this.props.rightContent &&
					<div style={styles.rightContent}>
						{this.props.rightContent}
					</div>
				}
			</div>
		);
	}

});

export default Radium(PreviewUser);

styles = {
	pubPreviewWrapper: {
		display: 'table',
		marginBottom: '1em',
		width: '100%',
		boxShadow: '0 1px 4px rgba(0,0,0,0.05),inset 0 0 0 1px rgba(0,0,0,0.1)',
		borderRadius: '0px 2px 2px 0px',
	},
	pubPreviewImageWrapper: {
		display: 'table-cell',
		verticalAlign: 'middle',
		boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
		width: '75px',
		height: '75px',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		borderRadius: '2px 0px 0px 2px',
		boxSizing: 'border-box',
	},
	pubPreviewDetails: {
		display: 'table-cell',
		verticalAlign: 'middle',
		padding: '.5em',
	},
	pubPreviewTitle: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		marginBottom: '1em',
	},
	name: {
		marginBottom: '0em',
	},
	bio: {
		margin: '.5em 0em 0em',
		fontSize: '0.85em',
	},
	rightContent: {
		display: 'table-cell',
		width: '1%',
	},
};
