import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import { Link } from 'react-router';

import {follow, unfollow} from './actions';
// import {globalStyles} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const FollowButton = React.createClass({
	propTypes: {
		followButtonData: PropTypes.object,
		loginData: PropTypes.object,
		path: PropTypes.string,
		id: PropTypes.string,
		type: PropTypes.string,
		isFollowing: PropTypes.bool,
		buttonStyle: PropTypes.object,
		buttonClasses: PropTypes.string,
		dispatch: PropTypes.func

	},

	getInitialState() {
		return {
			isFollowing: false,
		};
	},

	componentWillMount() {
		this.setState({isFollowing: this.props.isFollowing});
	},

	toggleFollow: function() {
		const loggedIn = this.props.loginData && this.props.loginData.get('loggedIn');

		if (!loggedIn) { return undefined; }

		if (this.state.isFollowing) {
			this.props.dispatch(unfollow(this.props.type, this.props.id));
			this.setState({isFollowing: false});
		} else {
			this.props.dispatch(follow(this.props.type, this.props.id));
			this.setState({isFollowing: true});
		}
	},

	render: function() {
		const loggedIn = this.props.loginData && this.props.loginData.get('loggedIn');
		const loginQuery = this.props.path && this.props.path !== '/' ? '?redirect=' + this.props.path : ''; // Query appended to login route. Used to redirect to a given page after succesful login.
		return (
			<div className={'button showChildOnHover ' + this.props.buttonClasses} style={[styles.followButton, this.props.buttonStyle]} onClick={this.toggleFollow}>
				{!loggedIn &&
					<Link to={'/login' + loginQuery} className={'hoverChild'} style={styles.loginMessage}>Login</Link>
				}
				{this.state.isFollowing
					? 'Following'
					: 'Follow'
				}
			</div>
		);
	}

});

export default connect( state => {
	return {
		followButtonData: state.followButton,
		loginData: state.login,
		path: state.router.location.pathname,
	};
})( Radium(FollowButton) );

styles = {
	followButton: {
		padding: '0em 1em ',
		fontSize: '0.85em',
		position: 'relative',
	},
	loginMessage: {
		position: 'absolute',
		zIndex: 2,
		left: 0,
		top: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#2C2A2B',
		textDecoration: 'none',
		color: 'inherit',
		textAlign: 'center',
		padding: 0,
	}
};
