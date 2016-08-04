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
		return <span></span>;
		// return (
		// 	<div className={'button'} style={styles.followButton} onClick={this.toggleFollow}>
		// 		{this.state.isFollowing
		// 			? 'Following'
		// 			: 'Follow'
		// 		}
		// 	</div>
		// );
	}

});

export default connect( state => {
	return {
		followButtonData: state.followButton,
	};
})( Radium(FollowButton) );

styles = {
	followButton: {
		padding: '0em 0.2em ',
		lineHeight: '1.4em',
		fontSize: '16px',
	},
};
