import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles;

export const PreviewPub = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		rightContent: PropTypes.node,
	},

	render() {
		const pub = this.props.pub || {};
		return (
			<div style={styles.pubPreviewWrapper}>
				<Link to={'/pub/' + pub.slug} style={[styles.avatarWrapper, { backgroundImage: pub.avatar ? 'url("' + pub.avatar + '")' : '' }]} />
				
				<div style={styles.pubPreviewDetails}>
					<Link to={'/pub/' + pub.slug}><h4>{pub.title}</h4></Link>
					<p>{pub.description}</p>
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

export default Radium(PreviewPub);

styles = {
	pubPreviewWrapper: {
		display: 'table',
		marginBottom: '1em',
		width: '100%',
		boxShadow: '0 1px 4px rgba(0,0,0,0.05),inset 0 0 0 1px rgba(0,0,0,0.1)',
		borderRadius: '0px 2px 2px 0px',
	},
	avatarWrapper: {
		display: 'table-cell',
		verticalAlign: 'middle',
		boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
		width: '125px',
		height: '125px',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center center',
		borderRadius: '2px 0px 0px 2px',
		boxSizing: 'border-box',
	},
	pubPreviewDetails: {
		display: 'table-cell',
		verticalAlign: 'middle',
		padding: '1em',
	},
	pubPreviewTitle: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		marginBottom: '1em',
	},
	rightContent: {
		display: 'table-cell',
		width: '1%',
	},
};
