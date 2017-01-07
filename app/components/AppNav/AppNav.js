import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link, browserHistory } from 'react-router';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';
import { globalStyles } from 'utils/globalStyles';

let styles;

export const AppNav = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		pubData: PropTypes.object,
		journalData: PropTypes.object,
		location: PropTypes.object,
		params: PropTypes.object,
		logoutHandler: PropTypes.func,
	},

	getInitialState() {
		return {
			search: '',
		};
	},

	inputUpdate: function(key, evt) {
		const value = evt.target.value || '';
		this.setState({ [key]: value });
	},

	searchSubmited: function(evt) {
		evt.preventDefault();
		browserHistory.push('/search?q=' + this.state.search);
		this.setState({ search: '' });
	},

	render() {
		const user = this.props.accountData.user || {};
		const pub = this.props.pubData.pub || {};
		const journal = this.props.journalData.journal || {};
		const location = this.props.location || {};
		const redirectURL = location.pathname.indexOf('/signup') !== 0 && location.pathname.indexOf('/reset') !== 0 && location.pathname !== '/' ? location.pathname : undefined;
		const query = location.query || {};
		const params = this.props.params || {};
		const isPub = location.pathname.indexOf('/pub') === 0;
		const isJournal = !isPub && params.slug;
		const pubFeatures = isPub ? pub.pubFeatures || [] : [];
		const contextJournal = pubFeatures.reduce((previous, current)=> {
			if (!query.context && current.journalId === pub.defaultContext) { return current.journal; }
			if (current.journal.name === query.context) { return current.journal; }
			return previous;
		}, undefined);

		const headerJournal = isJournal ? journal : contextJournal;

		const isLight = headerJournal && headerJournal.headerColor === '#ffffff'; // This is a bad hack. Calculate whether text should be light or dark, and then set
		const navClass = isLight ? 'pt-navbar' : 'pt-navbar pt-dark'; 
		const navStyle = headerJournal ? { backgroundColor: headerJournal.headerColor } : {};


		return (
			<nav className={navClass} style={navStyle}>
				<div className="pt-navbar-group pt-align-left">
					<Link to={'/'} className="pt-navbar-heading" style={styles.logo}>
						{/* PubPub */}
						{/*<img src={'http://i.imgur.com/eQMn3ya.png'} style={styles.journalLogo} />*/}
						{/*<img src={'https://i.imgur.com/Z3xWDMT.png'} style={styles.journalLogo} />*/}
						{/*<img src={'http://i.imgur.com/QpKGIVn.png'} style={styles.journalLogo} />*/}
						{/*<img src={'http://i.imgur.com/0AgfSdL.png'} style={styles.journalLogo} />*/}
						
						{isLight &&
							<img src={'http://i.imgur.com/8mTuvQc.png'} style={styles.journalLogo} />
						}
						{!isLight &&
							<img src={'https://i.imgur.com/Z3xWDMT.png'} style={styles.journalLogo} />
						}
						
					</Link>
					{headerJournal &&
						<div style={styles.journalLogoWrapper}>
							<div style={[styles.journalLogoDivider, isLight && styles.journalLogoDividerDark]} />
							<Link to={'/' + headerJournal.slug}>
								<img src={headerJournal.logo} style={styles.journalLogo} />
							</Link>
						</div>
					}
					<form onSubmit={this.searchSubmited}>
						<input className="pt-input" placeholder="Search..." type="text" style={styles.searchInput} value={this.state.search} onChange={this.inputUpdate.bind(this, 'search')} />
					</form>
				</div>
				
				{!user.id &&
					<div className="pt-navbar-group pt-align-right">
						<Link to={{ pathname: '/login', query: { redirect: redirectURL } }} style={styles.menuLink}><button className="pt-button pt-minimal">Login</button></Link>
						<Link to={'/signup'} style={styles.menuLink}><button className="pt-button pt-intent-primary">Signup</button></Link>		
					</div>
				}

				{user.id &&
					<div className="pt-navbar-group pt-align-right">
						<Popover 
							content={<Menu>
								<li><Link to={'/pubs/create'} className="pt-menu-item pt-popover-dismiss pt-icon-application">
									New Pub
								</Link></li>
								<li><Link to={'/journals/create'} className="pt-menu-item pt-popover-dismiss pt-icon-applications">
									New Journal
								</Link></li>
							</Menu>}
							position={Position.BOTTOM_RIGHT}
							inheritDarkTheme={false}
						>
							<button className="pt-button pt-minimal pt-icon-add">
								New <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
							</button>
							
						</Popover>

						<Popover 
							content={<Menu>
								<li><Link to={'/user/' + user.username} className="pt-menu-item pt-popover-dismiss"><div>{user.firstName + ' ' + user.lastName}</div><div style={styles.subItemText}>View Profile</div></Link></li>
								<MenuDivider />
								<li><Link to={'/user/' + user.username + '/pubs'} className="pt-menu-item pt-popover-dismiss">Your Pubs</Link></li>
								<li><Link to={'/user/' + user.username + '/journals'} className="pt-menu-item pt-popover-dismiss">Your Journals</Link></li>
								<li><Link to={'/user/' + user.username + '/following'} className="pt-menu-item pt-popover-dismiss">Your Follows</Link></li>
								<MenuDivider />
								<li><Link to={'/user/' + user.username + '/profile'} className="pt-menu-item pt-popover-dismiss">Settings</Link></li>
								<MenuItem text={'Logout'} onClick={this.props.logoutHandler} />
							</Menu>}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.BOTTOM_RIGHT}
							transitionDuration={200}
							inheritDarkTheme={false}
						>
							<button className="pt-button pt-minimal">
								<img style={styles.userImage} alt={user.firstName + ' ' + user.lastName} src={'https://jake.pubpub.org/unsafe/50x50/' + user.image} />
								<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
							</button>
							
						</Popover>
					</div>
				}
				{/* <div className={'clearfix'} />
				<div className={'pt-button-group pt-minimal'}>
					<Link className={'pt-button'}>Fall 2016</Link>
					<Link className={'pt-button'}>Optimized Phyics</Link>
					<Link className={'pt-button'}>Community Discussion</Link>
				</div>	*/}
			</nav>
		);
	}

});

export default Radium(AppNav);

styles = {
	logo: {
		textDecoration: 'none',
		fontFamily: 'Yrsa',
		fontSize: '1.5em',
		color: 'inherit',
		display: 'block',
	},
	searchInput: {
		// backgroundColor: '#394B59',
	},
	menuLink: {
		...globalStyles.link,
		display: 'block',
	},
	subItemText: {
		fontSize: '0.8em',
	},
	userImage: {
		width: '24px',
		padding: '0em',
		borderRadius: '2px',
		verticalAlign: 'middle',
	},
	journalLogoWrapper: {
		padding: '0em 15px',
		margin: '.25em 0em',
		position: 'relative',
	},
	journalLogoDivider: {
		position: 'absolute',
		left: '0',
		top: '10px',
		height: '30px',
		width: '1px',
		backgroundColor: 'rgba(255,255,255,0.25)',
	},
	journalLogoDividerDark: {
		backgroundColor: 'rgba(0,0,0,0.25)',	
	},
	journalLogo: {
		height: '100%',
		padding: '10px 0px',
	},
};
