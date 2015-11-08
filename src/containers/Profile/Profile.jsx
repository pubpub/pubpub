import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { pushState } from 'redux-router';
import {logout} from '../../actions/login';
import {getProfile} from '../../actions/profile';

let styles = {};

const Profile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			return dispatch(getProfile(routerParams.username));
		}
	},

	ownProfile: function() {
		let output = 'other';
		if (this.props.loginData.getIn(['userData', 'username']) === this.props.username ) {
			output = 'self';
		}
		return output;
	},
	submitLogout: function() {
		this.props.dispatch(logout());
		this.props.dispatch(pushState(null, ('/')));
	},

	render: function() {
		const metaData = {};
		if (this.props.profileData.getIn(['profileData', 'name'])) {
			metaData.title = 'PubPub - ' + this.props.profileData.getIn(['profileData', 'name']);
		} else {
			metaData.title = 'PubPub - ' + this.props.username;
		}

		const profileData = this.props.profileData.get('profileData').toJS();

		return (
			<div>

				<DocumentMeta {...metaData} />

				<h2>{profileData.name}</h2>
				<h3 style={styles[this.ownProfile()]} onClick={this.submitLogout}>Logout</h3>
				<img style={styles.image} src={profileData.image} />

				<h3>{profileData.pubs 
					? profileData.pubs.length
					: 0} Pubs</h3>

				{profileData.pubs
					? profileData.pubs.map((pub, index)=>{
						return (
							<div key={index}>
								<p>{pub.displayTitle}</p>
								<img style={styles.image} src={pub.image}/>
							</div>
						);
					})
					: ''
				}
				

			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login, profileData: state.profile, username: state.router.params.username};
})( Radium(Profile) );

styles = {
	image: {
		width: 50,
	},
	other: {
		display: 'none'
	}

};
