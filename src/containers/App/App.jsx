import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {Login} from '../index';
import {connect} from 'react-redux';
import {toggleVisibility, restoreLogin} from '../../actions/login';

let styles = {};

const App = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		children: PropTypes.object.isRequired,
		pushState: PropTypes.func,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch) {
			// This fires every single time the route changes.
			// I think this is because App.jsx technically re-renders. 
			// We should set some variable like 'attemptedRestoreLogin'
			// it seemed to be working, but because of the css server/client mismatch,
			// I think we lose the server-side login. Once we fix the css issue, attempt to fix this.
			return dispatch(restoreLogin());
		}
	},

	toggleLogin: function() {
		this.props.dispatch(toggleVisibility());
	},

	render: function() {

		return (
			<div style={styles.body}>
				<div className="header-bar" style={styles.headerBar}>
					<Link to={`/`}><h1 style={[styles.headerText, styles.headerLogo]}>PubPub</h1></Link>
					<p style={[styles.headerText, styles.headerLogin]}>
						<Link style={styles.headerText} to={`/subdomain`}> subdomain </Link> | 
						<Link style={styles.headerText} to={`/pub/cat/edit`}> edit </Link> | 
						<Link style={styles.headerText} to={`/explore`}> explore </Link> | 
						<span onClick={this.toggleLogin}> 
							{this.props.loginData.get('loggedIn') === false ? 'login' : 'Logged In!'} 
						</span> | 
						<Link style={styles.headerText} to={`/profile/istravis`}> profile </Link> | 
						<Link style={styles.headerText} to={`/pub/cat`}> reader </Link> | 
					</p>
				</div>
				<Login />
				<div className="content" style={styles.content}>
					{this.props.children}
				</div>

				
			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login};
})( Radium(App) );


styles = {
	body: {
		height: '100vh',
		width: '100vw',
		overflow: 'hidden',
	},
	headerBar: {
		width: '100%',
		height: 30,
		backgroundColor: '#222',
		margin: 0,
		zIndex: 5,
	},

	headerText: {
		lineHeight: '30px',
		color: 'white',
		textDecoration: 'none',
	},

	headerLogo: {
		margin: 0,
		fontSize: '1em',
		color: '#ddd',
		float: 'left',
		width: '50%',
	},

	headerLogin: {
		margin: 0,
		fontSize: '0.9em',
		color: '#ddd',
		float: 'left',
		width: '50%',
		textAlign: 'right',
	},

	content: {
		width: '100%',
		height: 'calc(100% - 30px)',
		position: 'relative',
		// backgroundColor: 'red',
	},

	base: {
		color: '#f09',
		// transition: '.2s ease-in-out transform, 1s linear opacity',
		':hover': {
			// color: '#0074d9'
			transform: 'translateX(100px)'
		}
	},

	primary: {
		background: '#0074D9'
	},

	warning: {
		background: '#FF4136'
	}
};


// export default connect( state => {
//     return {pushState}
//   })( Radium(Editor) );
