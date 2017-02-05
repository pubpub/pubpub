import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);

let styles;

export const PreviewJournal = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		bottomContent: PropTypes.node,
		rightContent: PropTypes.node,
	},

	render() {
		const journal = this.props.journal || {};
		const admins = journal.admins || [];
		const pubFeatures = journal.pubFeatures || [];
		const followers = journal.followers || [];

		return (
			<div style={styles.pubPreviewWrapper}>
				<Link to={'/' + journal.slug} style={[styles.avatarWrapper, { backgroundImage: journal.avatar ? 'url("' + journal.avatar + '")' : '' }]} />
				
				<div style={styles.pubPreviewDetails}>
					<Link to={'/' + journal.slug} style={styles.title}>{journal.title}</Link>

					<p>{journal.description}</p>
					{this.props.bottomContent &&
						<div>
							{this.props.bottomContent}
						</div>
					}

					<div style={styles.previewStats}>

						{!!pubFeatures.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-application'} style={styles.statItemIcon}/>
								{pubFeatures.length} Pub{pubFeatures.length > 1 ? 's' : ''}
							</span>
						}
						{!!admins.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-person'} style={styles.statItemIcon}/>
								{admins.length} admin{admins.length > 1 ? 's' : ''}
							</span>
						}
						{!!followers.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-people'} style={styles.statItemIcon}/>
								{followers.length} follower{followers.length > 1 ? 's' : ''}
							</span>
						}
					</div>
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

export default Radium(PreviewJournal);

styles = {
	pubPreviewWrapper: {
		display: 'table',
		marginBottom: '1em',
		width: '100%',
		boxShadow: '0 1px 4px rgba(0,0,0,0.05),inset 0 0 0 1px rgba(0,0,0,0.1)',
		borderRadius: '0px 2px 2px 0px',
		position: 'relative',
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
		// verticalAlign: 'middle',
		padding: '2em 1em',
	},
	modeIcon: {
		float: 'right',
		marginLeft: '2em',
	},
	title: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		display: 'inline',
		lineHeight: 0.9,
	},
	authorsWrapper: {
		paddingTop: '0.25em',
	},
	authorLink: {
		fontStyle: 'italic',
		opacity: 0.75,
	},
	previewStats: {
		position: 'absolute',
		bottom: '5px',
	},
	statItem: {
		fontSize: '1em',
		paddingRight: '3em',
		opacity: 0.75,
	},
	statItemIcon: {
		opacity: 0.5,
		marginRight: '0.25em',
	},
	rightContent: {
		display: 'table-cell',
		width: '1%',
		whiteSpace: 'nowrap',
	},

};
