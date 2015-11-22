import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout} from '../../actions/login';
import {getProfile} from '../../actions/profile';
import {LoaderDeterminate} from '../../components';
import {styles} from './ProfileStyle';

const Profile = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		loginData: PropTypes.object,
		username: PropTypes.string,
		dispatch: PropTypes.func
	},

	statics: {
		fetchDataDeferred: function(getState, dispatch, location, routerParams) {
			if (getState().profile.getIn(['profileData', 'username']) !== routerParams.username) {
				return dispatch(getProfile(routerParams.username));
			}
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

		let profileData = {};
		if (this.props.profileData.get('profileData').toJS) {
			profileData = this.props.profileData.get('profileData').toJS();
		}

		return (
			<div style={styles.profilePage}>

				<DocumentMeta {...metaData} />

				{/* 
				// Profile Options Bar
				// Profile Image
				// Profile Name
				// Profile Stats Bar
				// Profile Content Pane
				*/}
				<div style={styles.profileWrapper}>
					<div style={[styles.hiddenUntilLoad, styles[this.props.profileData.get('status')]]}>
						<ul style={styles.profileNav}>

							<li key="profileNav0"style={[styles.profileNavItem, styles[this.ownProfile()]]} onClick={this.submitLogout}>Logout</li>
							<li style={styles.profileNavSeparator}></li>
							<li key="profileNav1"style={[styles.profileNavItem, styles[this.ownProfile()]]}>Settings</li>
							<li style={styles.profileNavSeparator}></li>
							<li key="profileNav2"style={[styles.profileNavItem, styles[this.ownProfile()]]}>Create Pub</li>
							
						</ul>
						{/* 
						<Link to={`/profile/` + this.props.username + `?filter=funk`}><p>funk</p></Link>
						<Link to={`/profile/` + this.props.username + `?filter=dog`}><p>dog</p></Link>
						*/}
					</div>
					
					<LoaderDeterminate value={this.props.profileData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[styles.hiddenUntilLoad, styles[this.props.profileData.get('status')]]}>
						<div style={styles.userImageWrapper}>
							<img style={styles.userImage} src={profileData.image} />
						</div>

						<div style={styles.detailsWrapper}>
							<h2 style={styles.profileName}>{profileData.name}</h2>
							<p style={styles.profileDetail}>PhD Researcher at Arlington High School</p>
							<p style={styles.profileDetail}>Verfied with Twitter</p>
						</div>

						<div style={styles.statsWrapper}>
							<ul style={styles.statsList}>
								<li key="profileStatsItem0" style={[styles.statsItem, styles.noBottomMobile, styles.noRightMobile, styles.pointsItem]}>
									<div style={styles.statsTitle}>Points</div>
									<div style={styles.statsCount}>23,123</div>
								</li>
								<li style={styles.statsSeparator}></li>
								<li key="profileStatsItem1" style={[styles.statsItem]}>
									<div style={styles.statsTitle}>Pubs</div>
									<div style={styles.statsCount}>28</div>
								</li>
								<li style={styles.statsSeparator}></li>
								<li key="profileStatsItem2" style={[styles.statsItem, styles.noRightMobile]}>
									<div style={styles.statsTitle}>Discussions</div>
									<div style={styles.statsCount}>219</div>
								</li>
								<li style={styles.statsSeparator}></li>
								<li key="profileStatsItem3" style={[styles.statsItem, styles.noBottomMobile]}>
									<div style={styles.statsTitle}>Expert Papers</div>
									<div style={styles.statsCount}>14</div>
								</li>
								<li style={styles.statsSeparator}></li>
								<li key="profileStatsItem4" style={[styles.statsItem, styles.noBottomMobile, styles.noRightMobile]}>
									<div style={styles.statsTitle}>Journals</div>
									<div style={styles.statsCount}>20</div>
								</li>

							</ul>
						</div>

						<div style={styles.profileContent}>
							
							<h2>Pubs</h2>
							{profileData.pubs
								? profileData.pubs.map((pub, index)=>{
									return (
										<div key={'profilePub-' + index}>
											<h3>{pub.title}</h3>
											<div>
												<Link to={'/pub/' + pub.slug}>Read</Link> | <Link to={'/pub/' + pub.slug + '/edit'}>Edit {pub.title}</Link>
											</div>
											
										</div>
									);
								})
								: null
							}

						</div>


						{/* <h3>{profileData.pubs 
							? profileData.pubs.length
							: 0} Pubs</h3> */}

					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login, profileData: state.profile, username: state.router.params.username};
})( Radium(Profile) );
