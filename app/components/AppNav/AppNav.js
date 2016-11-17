import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link, browserHistory } from 'react-router';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from 'components/Blueprint';
import { globalStyles } from 'utils/globalStyles';

let styles;

export const AppNav = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
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
	},

	render() {
		const user = this.props.accountData.user || {};
		return (
			<nav className="pt-navbar pt-dark">
				<div className="pt-navbar-group pt-align-left">
					<Link to={'/'} className="pt-navbar-heading" style={styles.logo}>PubPub</Link>
					<form onSubmit={this.searchSubmited}>
						<input className="pt-input" placeholder="Search..." type="text" style={styles.searchInput} value={this.state.search} onChange={this.inputUpdate.bind(this, 'search')} />
					</form>
				</div>
				
				{!user.id &&
					<div className="pt-navbar-group pt-align-right">
						<Link to={'/login'} style={styles.menuLink}><button className="pt-button pt-minimal">Login</button></Link>
						<Link to={'/signup'} style={styles.menuLink}><button className="pt-button pt-intent-primary">Signup</button></Link>		
					</div>
				}

				{user.id &&
					<div className="pt-navbar-group pt-align-right">
						<Popover 
							content={<Menu>
								<MenuItem iconName={'application'} text={<Link to={'/pub/create'} style={styles.menuLink}>New Pub</Link>} />
								<MenuItem iconName={'applications'} text={<Link to={'/journal/create'} style={styles.menuLink}>New Journal</Link>} />
							</Menu>}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.BOTTOM_RIGHT}
							transitionDuration={200}
							inheritDarkTheme={false}
						>
							<button className="pt-button pt-minimal pt-icon-add">
								New <span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
							</button>
							
						</Popover>

						<Popover 
							content={<Menu>
								<MenuItem text={<Link to={'/user/' + user.username} style={styles.menuLink}><div>{user.firstName + ' ' + user.lastName}</div><div style={styles.subItemText}>View Profile</div></Link>} />
								<MenuDivider />
								<MenuItem text={<Link to={'/user/' + user.username + '/pubs'} style={styles.menuLink}>Pubs</Link>} />
								<MenuItem text={<Link to={'/user/' + user.username + '/journals'} style={styles.menuLink}>Journals</Link>} />
								<MenuItem text={<Link to={'/user/' + user.username + '/following'} style={styles.menuLink}>Following</Link>} />
								<MenuDivider />
								<MenuItem text={<Link to={'/user/' + user.username + '/settings'} style={styles.menuLink}>Settings</Link>} />
								<MenuItem text={'Logout'} onClick={this.props.logoutHandler} />
							</Menu>}
							interactionKind={PopoverInteractionKind.CLICK}
							position={Position.BOTTOM_RIGHT}
							transitionDuration={200}
							inheritDarkTheme={false}
						>
							<button className="pt-button pt-minimal">
								<img style={styles.userImage} alt={user.firstName + ' ' + user.lastName} src={user.image} />
								<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
							</button>
							
						</Popover>
					</div>
				}
						
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
		backgroundColor: '#394B59',
	},
	menuLink: {
		...globalStyles.link,
		display: 'block',
	},
	subItemText: {
		fontSize: '0.8em',
	},
	userImage: {
		width: '25px',
		padding: '0em',
		display: 'inline-block',
		borderRadius: '2px',
		verticalAlign: 'top',
	},
};
