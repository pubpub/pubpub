import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
// import dateFormat from 'dateformat';
import { FollowButton } from 'containers';
import { Tag } from 'components';

import PubLabelList from './PubLabelList';


let styles;

export const PubNav = React.createClass({
	propTypes: {
		pub: PropTypes.object,
		accountId: PropTypes.number,
		preservedQuery: PropTypes.object,
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
		const followers = pub.followers || [];
		const pubFeatures = pub.pubFeatures || [];
		
		const contextJournal = pubFeatures.reduce((previous, current)=> {
			if (!query.context && current.journalId === pub.defaultContext) { return current.journal; }
			if (current.journal.title === query.context) { return current.journal; }
			return previous;
		}, undefined);

		const displayedFeatures = pubFeatures.filter((feature)=> {
			return feature.isDisplayed && (!contextJournal || feature.journalId !== contextJournal.id);
		});

		const followData = followers.reduce((previous, current)=> {
			if (current.id === this.props.accountId) { return current.FollowsPub; }
			return previous;
		}, undefined);

		const globalLabels = pub.labels.filter((label)=> {
			return !label.userId && !label.journalId && !label.pubId;
		});

		const navItems = [
			{
				icon: 'pt-icon-projects',
				title: 'Content',
				subtitle: '13 cool things',
				to: { pathname: '/pub/' + pub.slug, query: preservedQuery },
				active: meta === '/' || !meta
			},
			{
				icon: 'pt-icon-calendar',
				title: '19 Versions',
				subtitle: '13 cool things',
				to: { pathname: '/pub/' + pub.slug + '/versions', query: preservedQuery },
				active: meta === 'versions'
			},
			{
				icon: 'pt-icon-person',
				title: '4 Contributors',
				subtitle: '13 cool things',
				to: { pathname: '/pub/' + pub.slug + '/contributors', query: preservedQuery },
				active: meta === 'contributors'
			},
			{
				icon: 'pt-icon-manual',
				title: '3 Journals',
				subtitle: '13 cool things',
				to: { pathname: '/pub/' + pub.slug + '/journals', query: preservedQuery },
				active: meta === 'journals'
			},
		];
		console.log(navItems);
		return (
			<div style={styles.container}>

				
					{navItems.map((navItem, index)=> {
						return (
							<Link to={navItem.to} style={styles.navItemWrapper(navItems.length)} key={`navItem-${index}`} className={'light-background-on-hover'}>
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
								</div>
							</Link>
						);
					})}
			</div>
		);

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
		width: '100%',
		maxWidth: '1200px',
		margin: '0 auto',
		padding: '10px 2em 30px',


	},
	navItemWrapper: (count)=> {
		return {
			position: 'relative',
			display: 'inline-block',
			width: `calc(${100 / count}% - 4px)`,
			// paddingRight: '3em',
			// marginRight: '3em',
			padding: '10px 3em',
			margin: '0px 2px',
			cursor: 'pointer',
			textDecoration: 'none',
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
		right: -2,
	},
	navIcon: {
		color: '#5c7080',
	},
	navTitle: {
		paddingBottom: '0.75em',
	},
	navTitleActive: {
		fontWeight: 'bold',
	},
	navSubtitle: {
		color: '#738694'
	},
};
