import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {Login} from '../index';
import {connect} from 'react-redux';
import {toggleVisibility, restoreLogin} from '../../actions/login';
import {LoginHeader} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

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

					<Link to={`/`}><h1 key="pubpubHeaderLogo" style={[styles.headerText, styles.headerLogo]}>PubPub</h1></Link>

					<div key="loginText" style={[styles.headerText, styles.headerLogin]} onClick={this.toggleLogin}>
						<LoginHeader loginData={this.props.loginData} />
					</div>

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
		height: globalStyles.headerHeight,
		backgroundColor: globalStyles.headerBackground,
		margin: 0,
		zIndex: 5,
	},

	headerText: {
		lineHeight: globalStyles.headerHeight,
		color: globalStyles.headerText,
		textDecoration: 'none',
		':hover': {
			color: globalStyles.headerHover
		},
		fontFamily: 'Poiret One',
	},

	headerLogo: {
		margin: 0,
		fontSize: '1em',
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
		height: 'calc(100% - ' + globalStyles.headerHeight + ')',
		position: 'relative',
		// backgroundColor: 'red',
	},

};


// export default connect( state => {
//     return {pushState}
//   })( Radium(Editor) );
// {this.props.loginData.get('loggedIn') === false ? 'login' : 'Logged In!'} 
