import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles;

export const PreviewDiscussion = React.createClass({
	propTypes: {
		discussion: PropTypes.object,
		parent: PropTypes.object,
		rightContent: PropTypes.node,
	},

	render() {
		const discussion = this.props.discussion || {};
		const parent = this.props.parent || {};
		return (
			<div style={styles.pubPreviewWrapper}>
				<Link to={'/pub/' + parent.slug + '?discussionId=' + discussion.id} style={[styles.pubPreviewImageWrapper, { backgroundImage: parent.avatar ? 'url("' + parent.avatar + '")' : '' }]} />
				
				<div style={styles.pubPreviewDetails}>
					<Link to={'/pub/' + parent.slug + '?discussionId=' + discussion.id}>Discussion on <b>{parent.title}</b></Link>
					<p>{discussion.description}</p>
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

export default Radium(PreviewDiscussion);

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
