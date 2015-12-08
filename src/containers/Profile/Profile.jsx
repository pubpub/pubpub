import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout} from '../../actions/login';
import {getProfile} from '../../actions/profile';
import {LoaderDeterminate} from '../../components';
import {styles} from './profileStyles';
import {globalStyles} from '../../utils/styleConstants';

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
		// let output = 'other';
		// if (this.props.loginData.getIn(['userData', 'username']) === this.props.username ) {
		// 	output = 'self';
		// }
		// return output;

		return this.props.loginData.getIn(['userData', 'username']) === this.props.username ? 'self' : 'other';
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

		const ownProfile = this.ownProfile();

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

							<li key="profileNav0"style={[styles.profileNavItem, ownProfile === 'self' && styles.profileNavShow]} onClick={this.submitLogout}>Logout</li>
							<li style={[styles.profileNavSeparator, ownProfile === 'self' && styles.profileNavSeparatorShow]}></li>

							<li key="profileNav1"style={[styles.profileNavItem, ownProfile === 'self' && styles.profileNavShow]}>Settings</li>
							<li style={[styles.profileNavSeparator, ownProfile === 'self' && styles.profileNavSeparatorShow]}></li>

							<li key="profileNav2"style={[styles.profileNavItem, ownProfile === 'other' && styles.profileNavShow]}>Follow</li>
							<li style={[styles.profileNavSeparator, ownProfile === 'other' && styles.profileNavShow]}></li>
							
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

						{/* Content Wrapper is the right-hand side of the profile page.
							Everything except the image really */}
						<div style={styles.contentWrapper}>

							{/* User Details */}
							<h2 style={styles.profileName}>{profileData.name}</h2>
							<p style={styles.profileDetail}>PhD Researcher at Arlington High School</p>
							<p style={styles.profileDetail}>Verfied with Twitter</p>
							<p style={styles.profileDetail}>A biography or simply bio is a detailed description of a person's life. It involves more than just the basic facts like education, work, relationships, and death, but also portrays a subject's experience of these life events. Unlike a profile or curriculum vitae, a biography presents a subject's life story, highlighting various aspects of his or her life, including intimate details of experience, and may include an analysis of the subject's personality.</p>

							{/* Stats and Intra-Profile nav */}
							<div style={styles.statsWrapper}>
								<ul style={styles.statsList}>
									<li key="profileStatsItem1" style={[styles.statsItem]}>
										<div style={styles.statsTitle}>Points</div>
										<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>23,123<span style={styles.statParenthese}>)</span></div>
									</li>
									
									<li key="profileStatsItem2" style={[styles.statsItem]}>
										<div style={styles.statsTitle}>Pubs</div>
										<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>28<span style={styles.statParenthese}>)</span></div>
									</li>
									
									<li key="profileStatsItem3" style={[styles.statsItem]}>
										<div style={styles.statsTitle}>Discussions</div>
										<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>219<span style={styles.statParenthese}>)</span></div>
									</li>
									
									<li key="profileStatsItem4" style={[styles.statsItem]}>
										<div style={styles.statsTitle}>Expert Papers</div>
										<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>14<span style={styles.statParenthese}>)</span></div>
									</li>
									
									<li key="profileStatsItem5" style={[styles.statsItem]}>
										<div style={styles.statsTitle}>Journals</div>
										<div style={styles.statsCount}><span style={styles.statParenthese}>(</span>20<span style={styles.statParenthese}>)</span></div>
									</li>

								</ul>
							</div>

							{/* Selected Content based on nav */}
							<div style={styles.profileContent}>
							
								<h2>Pubs</h2>
								{profileData.pubs
									? profileData.pubs.map((pub, index)=>{
										return (
											
											<div key={'profilePub-' + index} style={styles.pubBlock}>
												<Link to={'/pub/' + pub.slug} style={globalStyles.link}>
													<div key={'profilePubWrapper-' + index} style={styles.pubTextWrapper}>
														<div style={styles.pubTitle}>{pub.title}</div>
														<div style={styles.pubAbstract}>{pub.abstract}</div>
													</div>
													
												</Link>

												{
													ownProfile === 'self'
														? <Link to={'/pub/' + pub.slug + '/edit'} style={globalStyles.link}>
															<div key={'profilePubEdit-' + index} style={styles.pubEdit}>Edit</div>
														</Link>
														: null
												}
												
											</div>
											
										);
									})
									: null
								}

							</div>


						</div>
						

					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {loginData: state.login, profileData: state.profile, username: state.router.params.username};
})( Radium(Profile) );
