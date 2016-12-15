import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);
import Radium from 'radium';
import Helmet from 'react-helmet';

import { NavContentWrapper } from 'components';

import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';

import { getUserData } from './actions';

let styles;

export const User = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		userData: PropTypes.object,
		params: PropTypes.object,
		dispatch: PropTypes.func,
	},

	// statics: {
	// 	readyOnActions: function(dispatch, params) {
	// 		return Promise.all([
	// 			dispatch(getUserData(params.username))
	// 		]);
	// 	}
	// },
	componentWillMount() {
		// window.prerenderReady = false;
		// Need to check here so that getUser doesn't make a fetch twice
		const user = this.props.userData.user || {};
		const params = this.props.params || {};
		if (this.props.userData.user !== null && user.username !== params.username) {
			this.props.dispatch(getUserData(this.props.params.username));
		}

		
	},

	// getInitialState() {
	// 	return {
			
	// 	};
	// },

	
	render() {
		const username = this.props.params.username;
		const user = this.props.userData.user || {};
		const name = user.firstName || user.lastName ? user.firstName + ' ' + user.lastName : this.props.params.username;
		const ownProfile = username === this.props.accountData.user.username;

		const metaData = {
			title: name + ' · PubPub',
			meta: [
				{ property: 'og:title', content: name },
				{ property: 'og:type', content: 'article' },
				{ property: 'og:description', content: user.bio },
				{ property: 'og:url', content: 'https://www.pubpub.org/user/' + username },
				{ property: 'og:image', content: user.image },
				{ property: 'og:image:url', content: user.image },
				{ property: 'og:image:width', content: '500' },
				{ name: 'twitter:card', content: 'summary' },
				{ name: 'twitter:site', content: '@pubpub' },
				{ name: 'twitter:title', content: name },
				{ name: 'twitter:description', content: user.bio || name },
				{ name: 'twitter:image', content: user.image },
				{ name: 'twitter:image:alt', content: 'Image of ' + name }
			]
		};

		let mode = this.props.params.mode;
		if (!ownProfile && (mode === 'profile' || mode === 'notifications' || mode === 'account' || mode === 'tokens')) {
			mode = 'notFound';
		}

		const mobileNavButtons = [
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Follow} />, action: this.followUserToggle },
			{ type: 'button', mobile: true, text: <FormattedMessage {...globalMessages.Menu} />, action: undefined },
		];

		const ownProfileItems = ownProfile
		? [
			{ type: 'spacer' },
			{ type: 'title', text: <FormattedMessage {...globalMessages.Settings} /> },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Profile} />, link: '/user/' + username + '/profile', active: mode === 'profile' },
			// { type: 'link', text: 'Account', link: '/user/' + username + '/account', active: mode === 'account'},
			{ type: 'link', text: <FormattedMessage {...globalMessages.Notifications} />, link: '/user/' + username + '/notifications', active: mode === 'notifications' },
			// { type: 'link', text: 'Access Token', link: '/user/' + username + '/tokens', active: mode === 'tokens' },

		]
		: [];
		const navItems = [
			{ type: 'link', text: <FormattedMessage {...globalMessages.Pubs} />, link: '/user/' + username, active: mode === undefined },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Journals} />, link: '/user/' + username + '/journals', active: mode === 'journals' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Following} />, link: '/user/' + username + '/following', active: mode === 'following' },
			{ type: 'link', text: <FormattedMessage {...globalMessages.Followers} />, link: '/user/' + username + '/followers', active: mode === 'followers' },
			...ownProfileItems,
		];

		const links = [
			{ key: 'publicEmail', href: 'mailto:' + user.publicEmail, text: <span>{user.publicEmail}</span> },
			{ key: 'website', href: user.website, text: <span>{user.website}</span> },
			{ key: 'twitter', href: 'https://twitter.com/' + user.twitter, text: <span>@{user.twitter}</span> },
			{ key: 'github', href: 'https://github.com/' + user.github, text: <span>github.com/{user.github}</span> },
			{ key: 'orcid', href: 'https://orcid.org/' + user.orcid, text: <span>orcid.com/{user.orcid}</span> },
			{ key: 'googleScholar', href: 'https://scholar.google.com/citations?user=' + user.googleScholar, text: <span>Google Scholar</span> },
		];

		if (!user.username) {
			return <div>Loading</div>;
		}

		// window.prerenderReady = true;
		return (
			<div style={styles.container}>
				<Helmet {...metaData} />
				
				<div style={styles.headerWrapper}>
					<div style={styles.headerImageWrapper}>
						<img alt={user.username} style={styles.userImage} src={'https://jake.pubpub.org/unsafe/150x150/' + user.image} />
					</div>
					<div style={styles.headerTextWrapper}>

						<h1 style={styles.showOnMobile}>{name}</h1> {/* Duplicate header for cleaner Follow button rendering */}

						{/*!ownProfile &&
							<FollowButton id={user._id} type={'followsUser'} isFollowing={user.isFollowing} buttonStyle={styles.followButtonStyle}/>
						*/}

						<h1 style={styles.hideOnMobile}>{name}</h1> {/* Duplicate header for cleaner Follow button rendering */}
						<p>{user.bio}</p>

						{links.filter((link)=> {
							return !!user[link.key];
						}).map((link, index)=> {
							return <a key={'link-' + index} className={'underlineOnHover'} style={[styles.link, index === 0 && styles.firstLink]} href={link.href}>{link.text}</a>;
						})}
					</div>


				</div>

				<NavContentWrapper navItems={navItems} mobileNavButtons={mobileNavButtons}>
					{(() => {
						switch (mode) {
						
						case 'journals': 
							return (
								<div>
									{user.journals.map((journal, index)=> {
										return (
											<div key={'journal-' + index} style={styles.pubPreviewWrapper}>
												<Link to={'/' + journal.slug} style={[styles.pubPreviewImageWrapper, { backgroundImage: journal.icon ? 'url("' + journal.icon + '")' : '' }]} />
												<div style={styles.pubPreviewDetails}>
													<Link to={'/' + journal.slug}><h4>{journal.name}</h4></Link>
													<p>{journal.shortDescription}</p>
												</div>
												
											</div>
										);
									})}
								</div>
							);
						case 'notFound':
							return null;

						default:
							return (
								<div>
									<div>{this.props.params.mode}</div>
									{user.pubs.filter((pub)=> {
										return !pub.replyRootPubId;
									}).map((pub, index)=> {
										return (
											<div key={'pub-' + index} style={styles.pubPreviewWrapper}>
												<Link to={'/pub/' + pub.slug} style={[styles.pubPreviewImageWrapper, { backgroundImage: pub.previewImage ? 'url("' + pub.previewImage + '")' : '' }]} />
												<div style={styles.pubPreviewDetails}>
													<Link to={'/pub/' + pub.slug}><h4>{pub.title}</h4></Link>
													<p>{pub.description}</p>
												</div>
											</div>
										);
									})}
								</div>
							);
						}
					})()}
				</NavContentWrapper>

				
			</div>
		);
	}
});

function mapStateToProps(state) {
	return {
		userData: state.user.toJS(),
		accountData: state.account.toJS(),
	};
}

export default connect(mapStateToProps)(Radium(User));

styles = {
	container: {
		padding: '2em 1em',
		maxWidth: '1024px',
		margin: '0 auto',
	},
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
	headerWrapper: {
		paddingBottom: '2em',
	},
	headerImageWrapper: {
		textAlign: 'center',
		display: 'table-cell',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		}
	},
	userImage: {
		borderRadius: '2px',
	},
	headerTextWrapper: {
		padding: '0em 1em',
		display: 'table-cell',
		verticalAlign: 'top',
		width: '100%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			textAlign: 'center',
			padding: '0em',
		}
	},
	link: {
		paddingLeft: '1em',
		marginLeft: '1em',
		borderLeft: '1px solid #BBBDC0',
		textDecoration: 'none',
		color: 'inherit',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			paddingLeft: 'auto',
			marginLeft: 'auto',
			borderLeft: '0px solid #BBBDC0',
		},
	},
	firstLink: {
		borderLeft: '0px solid #BBBDC0',
		paddingLeft: '0em',
		marginLeft: '0em',
	},
	hide: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	showOnMobile: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	hideOnMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	
};
