import React, { PropTypes } from 'react';
import Radium from 'radium';
// import { Link as UnwrappedLink } from 'react-router';
// const Link = Radium(UnwrappedLink);
import Link from 'components/Link/Link';

let styles;

export const PreviewPub = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		rightContent: PropTypes.node,
	},

	render() {
		const pub = this.props.pub || {};
		const versions = pub.versions || [];
		const contributors = pub.contributors || [];
		const followers = pub.followers || [];
		const discussions = pub.discussions || [];
		const features = pub.pubFeatures || [];

		let mode = 'Private';
		if (pub.isRestricted) { mode = 'Restricted'; }
		if (pub.isPublished) { mode = 'Published'; }

		return (
			<div style={styles.pubPreviewWrapper}>
				<Link to={'/pub/' + pub.slug} style={[styles.avatarWrapper, { backgroundImage: pub.avatar ? 'url("' + pub.avatar + '")' : '' }]} />
				
				<div style={styles.pubPreviewDetails}>
					<div style={styles.modeIcon}>
						{mode === 'Private' && <span className={'pt-icon-standard pt-icon-lock'} /> }
						{mode === 'Restricted' && <span className={'pt-icon-standard pt-icon-people'} /> }
						{mode === 'Published' && <span className={'pt-icon-standard pt-icon-globe'} /> }
					</div>
					<Link to={'/pub/' + pub.slug} style={styles.title}>{pub.title}</Link>
					<p style={styles.authorsWrapper}>
						{contributors.filter((contributor)=>{
							return contributor.isAuthor === true;
						}).map((contributor, index, array)=> {
							const user = contributor.user || {};
							return <Link style={styles.authorLink} to={'/user/' + user.username} key={'contributor-' + index}>{user.firstName + ' ' + user.lastName}{index !== array.length - 1 ? ', ' : ''}</Link>;
						})}
					</p>

					<p style={styles.authorsWrapper}>{pub.description}</p>

					<div style={styles.previewStats}>

						{!!versions.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-calendar'} style={styles.statItemIcon}/>
								{versions.length} version{versions.length > 1 ? 's' : ''}
							</span>
						}
						{!!followers.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-people'} style={styles.statItemIcon}/>
								{followers.length} follower{followers.length > 1 ? 's' : ''}
							</span>
						}
						{!!discussions.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-comment'} style={styles.statItemIcon}/>
								{discussions.length} discussion{discussions.length > 1 ? 's' : ''}
							</span>
						}
						{!!features.length &&
							<span style={styles.statItem}>
								<span className={'pt-icon-standard pt-icon-applications'} style={styles.statItemIcon}/>
								{features.length} feature{features.length > 1 ? 's' : ''}
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

export default Radium(PreviewPub);

styles = {
	pubPreviewWrapper: {
		display: 'table',
		marginBottom: '1em',
		width: '100%',
		boxShadow: '0 1px 4px rgba(0,0,0,0.05),inset 0 0 0 1px rgba(0,0,0,0.1)',
		borderRadius: '0px 2px 2px 0px',
		position: 'relative',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
		}
	},
	pubPreviewDetails: {
		display: 'table-cell',
		// verticalAlign: 'middle',
		padding: '2em 1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	modeIcon: {
		float: 'right',
		marginLeft: '2em',
	},
	title: {
		fontSize: '1.5em',
		fontWeight: 'bold',
		display: 'inline',
		lineHeight: 1.1,
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'relative',
			bottom: '-1em',
		}
	},
	statItem: {
		fontSize: '1em',
		paddingRight: '3em',
		opacity: 0.75,
		whiteSpace: 'nowrap',
		display: 'inline-block',
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
