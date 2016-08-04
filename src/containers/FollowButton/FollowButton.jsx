import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';

import {follow, unfollow} from './actions';
// import {globalStyles} from 'utils/styleConstants';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

let styles = {};

export const FollowButton = React.createClass({
	propTypes: {
		followButtonData: PropTypes.object,
		id: PropTypes.string,
		type: PropTypes.string,
		isFollowing: PropTypes.bool,
		buttonStyle: PropTypes.object,
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
		if (this.state.isFollowing) {
			this.props.dispatch(unfollow(this.props.type, this.props.id));
			this.setState({isFollowing: false});
		} else {
			this.props.dispatch(follow(this.props.type, this.props.id));
			this.setState({isFollowing: true});
		}
	},

	render: function() {
		return (
			<div className={'button'} style={[styles.followButton, this.props.buttonStyle]} onClick={this.toggleFollow}>
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
	};
})( Radium(FollowButton) );

styles = {
	followButton: {
		padding: '0em 1em ',
		fontSize: '0.85em',
	},
};
