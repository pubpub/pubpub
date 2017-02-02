import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { Link } from 'react-router';
import dateFormat from 'dateformat';


let styles;

export const PubNav = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		accountId: PropTypes.number,
		preservedQuery: PropTypes.object,
		currentVersion: PropTypes.object,
		useLightText: PropTypes.bool,
		meta: PropTypes.string,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	render: function() {
		const pub = this.props.pub || {};
		const query = this.props.query;
		const pathname = this.props.pathname;
		const preservedQuery = this.props.preservedQuery;
		const meta = this.props.meta;

		const contributors = pub.contributors || [];
		const pubFeatures = pub.pubFeatures || [];
		const versions = pub.versions || [];

		const currentVersion = this.props.currentVersion || {};
		const currentFiles = currentVersion.files || [];

		const navItems = [
			{
				icon: 'pt-icon-projects',
				title: 'Content',
				subtitle: `${currentFiles.length} files`,
				to: { pathname: '/pub/' + pub.slug, query: preservedQuery },
				active: meta === '/' || !meta
			},
			{
				icon: 'pt-icon-calendar',
				title: `${versions.length} Version${versions.length === 1 ? '' : 's'}`,
				subtitle: `Current: ${dateFormat(currentVersion.createdAt, 'mmm dd, yyyy')}`,
				to: { pathname: '/pub/' + pub.slug + '/versions', query: preservedQuery },
				active: meta === 'versions',
				hidden: !currentVersion.files,
			},
			{
				icon: 'pt-icon-person',
				title: `${contributors.length} Contributor${contributors.length === 1 ? '' : 's'}`,
				subtitle: `${contributors.length} authors`,
				to: { pathname: '/pub/' + pub.slug + '/contributors', query: preservedQuery },
				active: meta === 'contributors'
			},
			{
				icon: 'pt-icon-manual',
				title: `${pubFeatures.length} Journal${pubFeatures.length === 1 ? '' : 's'}`,
				subtitle: `${pubFeatures.length} featuring`,
				to: { pathname: '/pub/' + pub.slug + '/journals', query: preservedQuery },
				active: meta === 'journals',
				hidden: !currentVersion.files,
			},
			{
				icon: 'pt-icon-cog',
				title: 'Settings',
				subtitle: `${pubFeatures.length} featuring`,
				to: { pathname: '/pub/' + pub.slug + '/settings', query: preservedQuery },
				active: meta === 'settings',
				hidden: !pub.isAuthor && !pub.canEdit,
			},
		];
		return (
			<div style={styles.container} className={'button-wrapper button-nav'}>
				<Style rules={{
					'.button-nav .pt-button-group.pt-minimal .pt-button::after': { margin: '7px 5px' },
				}} />
			
				<div style={styles.content} className={'pt-button-group pt-minimal pt-fill'}>
				
					{navItems.filter((navItem)=> {
						return !navItem.hidden;
					}).map((navItem, index)=> {
						return (
							<Link to={navItem.to} className={'pt-button ' + navItem.icon} style={styles.navItemWrapper(navItems.length, navItem.active)} key={`navItem-${index}`}>
								{navItem.title}
								{navItem.active &&
									<div style={styles.bottomBorder(this.props.useLightText)} />
								}
							</Link>
						);
					})}
				</div>
			</div>
		);

		/*<Link to={navItem.to} style={styles.navItemWrapper(navItems.length, navItem.active)} key={`navItem-${index}`} className={'light-background-on-hover'}>
			<div style={styles.navItem}>
				{index !== (navItems.length - 1) &&
					<div style={styles.navSeparator} />
				}
				<div style={[styles.navTitle, navItem.active && styles.navTitleActive]}>
					<span style={styles.navIcon} className={'pt-icon-standard ' + navItem.icon} /> {navItem.title}
				</div>
				<div style={styles.navSubtitle}>
					{navItem.subtitle}
				</div>
				<div style={styles.navSeparatorRight} />
			</div>
		</Link>*/

		// return (
		// 	<div style={styles.container}>
		// 		<div style={styles.nav}>
		// 			<Link to={{ pathname: '/pub/' + pub.slug, query: preservedQuery }}><div style={[styles.navItem, (!meta || meta === 'files') && styles.navItemActive]} className={'bottomShadowOnHover'}>Content</div></Link>
		// 			{!!versions.length && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/versions', query: preservedQuery }}><div style={[styles.navItem, meta === 'versions' && styles.navItemActive]} className={'bottomShadowOnHover'}>Versions ({versions.length})</div></Link> }
		// 			<Link to={{ pathname: '/pub/' + this.props.params.slug + '/contributors', query: preservedQuery }}><div style={[styles.navItem, meta === 'contributors' && styles.navItemActive]} className={'bottomShadowOnHover'}>Contributors ({contributors.length})</div></Link>
		// 			{!!versions.length && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/journals', query: preservedQuery }}><div style={[styles.navItem, meta === 'journals' && styles.navItemActive]} className={'bottomShadowOnHover'}>Journals {pubFeatures.length ? '(' + pubFeatures.length + ')' : ''}</div></Link> }
		// 			{pub.canEdit && <Link to={{ pathname: '/pub/' + this.props.params.slug + '/settings', query: preservedQuery }}><div style={[styles.navItem, meta === 'settings' && styles.navItemActive]} className={'bottomShadowOnHover'}>Settings</div></Link>}
		// 		</div>
				
		// 	</div>
		// );
	}
});

export default Radium(PubNav);

styles = {
	container: {
		// borderBottom: '1px solid #f3f3f4',
		// padding: '10px 0em',
		// marginBottom: '40px',
	},
	content: {
		width: '100%',
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '0em 2em',
	},
	navItemWrapper: (count, isActive)=> {
		return {
			// position: 'relative',
			// display: 'inline-block',
			// width: `calc(${100 / count}% - 4px)`,
			// paddingRight: '3em',
			// marginRight: '3em',
			// padding: '10px 2em',
			// margin: '0px 2px',
			// cursor: 'pointer',
			// textDecoration: 'none',
			// backgroundColor: isActive ? 'rgba(167, 182, 194, 0.18)' : '',
			fontWeight: 200,
			position: 'relative',
			padding: '5px 0px',
			// top: 1, // To get active line to overlap the bottom border
			// border: 0,
			// borderRadius: '0px !important',
			// boxShadow: isActive ? 'inset 0px -3px 0px -1px rgb(92, 112, 128)' : '',
		};
	},
	bottomBorder: (useLightText)=> {
		return {
			position: 'absolute',
			bottom: -1,
			left: 0,
			width: '100%',
			height: '2px',
			backgroundColor: useLightText ? '#BFCCD6' : 'rgb(92, 112, 128)',
		};
	},
	navItem: {
		// padding: '0em 20%',
	},
	navSeparator: {
		position: 'absolute',
		width: '1px',
		top: '15%',
		bottom: '15%',
		backgroundColor: 'rgba(16, 22, 26, 0.15)',
		left: -2,
	},
	navSeparatorRight: {
		position: 'absolute',
		width: '1px',
		top: '15%',
		bottom: '15%',
		backgroundColor: 'rgba(16, 22, 26, 0.15)',
		right: -2,
	},
	navIcon: {
		color: '#5c7080',
	},
	navTitle: {
		textAlign: 'center',
		fontWeight: '200',
	},
	// navTitleActive: {
	// 	fontWeight: 'bold',
	// },
	navSubtitle: {
		paddingTop: '0.5em',
		color: '#738694',
		display: 'none',
	},
};
