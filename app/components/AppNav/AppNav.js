import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from 'components/Blueprint';

let styles;

export const AppNav = React.createClass({
	propTypes: {
		accountData: PropTypes.object,
		logoutHandler: PropTypes.func,
	},

	searchSubmited: function(evt) {
		evt.preventDefault();
		console.log(evt.target.value);
	},

	render() {
		const account = this.props.accountData.user || {};
		// return (
		// 	<div style={styles.container}>
		// 		<Link to="/" style={styles.link}>
		// 			PubPub
		// 		</Link>

		// 		<div style={styles.name}>{user.name}</div>
				
		// 	</div>
		// );

		return (
			<nav className="pt-navbar pt-dark">
				<div className="pt-navbar-group pt-align-left">
					<Link to={'/'} className="pt-navbar-heading" style={styles.link}>PubPub</Link>
					<form onSubmit={this.searchSubmited}>
						<input className="pt-input" placeholder="Search..." type="text" style={styles.searchInput} />
					</form>
				</div>
				
				{!account.id &&
					<div className="pt-navbar-group pt-align-right">
						<Link to={'/login'} style={styles.testLink}><button className="pt-button pt-minimal">Login</button></Link>
						<Link to={'/signup'} style={styles.testLink}><button className="pt-button pt-intent-primary">Signup</button></Link>		
					</div>
				}

				{account.id &&
					<div className="pt-navbar-group pt-align-right">
						<button className="pt-button pt-minimal pt-icon-user" />
						<button className="pt-button pt-minimal pt-icon-notifications" />
						<Popover 
							content={<Menu>
								<MenuItem
									text={ account.firstName + ' ' + account.lastName } />
								<MenuItem
									iconName="new-object"
									text={<Link to={'/'} style={styles.testLink}>A Link</Link>} />
								<MenuItem
									iconName="cog"
									text="Settings" />
								<MenuDivider />
								<MenuItem text={'Logout'} onClick={this.props.logoutHandler} />
							</Menu>}
							interactionKind={PopoverInteractionKind.CLICK}
							popoverClassName={'apt-popover-content-sizing'}
							position={Position.BOTTOM_RIGHT}
							inheritDarkTheme={false}
							useSmartPositioning={true} >
							<button className="pt-button pt-minimal pt-icon-cog" />
						</Popover>
					</div>
				}
					
				
					
					
			</nav>
		);
	}

});

export default Radium(AppNav);

styles = {
	container: {
		backgroundColor: '#232425',
		color: 'white',
		lineHeight: '50px',
		height: '50px',
		padding: '0em 1em',
		position: 'relative',
	},
	searchInput: {
		backgroundColor: '#394B59',
	},
	link: {
		textDecoration: 'none',
		fontFamily: 'Yrsa',
		fontSize: '1.5em',
		color: 'inherit',
		display: 'block',
	},
	testLink: {
		textDecoration: 'none',
		color: 'inherit',
		display: 'block',
	},
	name: {
		textAlign: 'right',
		color: '#FFF',
		position: 'absolute',
		right: '1em',
		top: 0,
		height: '50px',
		lineHeight: '55px',
		fontWeight: 'light',
	},
};
