import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import { Link } from 'react-router';
import { pushState } from 'redux-router';
import {logout} from '../../actions/login';
import {getProfile} from '../../actions/user';
import {LoaderDeterminate} from '../../components';
import {globalStyles, profileStyles, navStyles} from '../../utils/styleConstants';

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
			if (getState().user.getIn(['profileData', 'username']) !== routerParams.username) {
				return dispatch(getProfile(routerParams.username));
			}
		}
	},

	ownProfile: function() {
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
			<div style={profileStyles.profilePage}>

				<DocumentMeta {...metaData} />

				<div style={profileStyles.profileWrapper}>
					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.profileData.get('status')]]}>
						<ul style={navStyles.navList}>

							<li key="profileNav0"style={[navStyles.navItem, ownProfile === 'self' && navStyles.navItemShow]} onClick={this.submitLogout}>Logout</li>
							<li style={[navStyles.navSeparator, ownProfile === 'self' && navStyles.navItemShow]}></li>

							<li key="profileNav1"style={[navStyles.navItem, ownProfile === 'self' && navStyles.navItemShow]}>Settings</li>
							<li style={[navStyles.navSeparator, ownProfile === 'self' && navStyles.navItemShow]}></li>

							<li key="profileNav2"style={[navStyles.navItem, ownProfile === 'other' && navStyles.navItemShow]}>Follow</li>
							<li style={[navStyles.navSeparator, ownProfile === 'other' && styles.navItemShow]}></li>
							
						</ul>
					</div>
					
					<LoaderDeterminate value={this.props.profileData.get('status') === 'loading' ? 0 : 100}/>

					<div style={[globalStyles.hiddenUntilLoad, globalStyles[this.props.profileData.get('status')]]}>
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
	return {
		loginData: state.login, 
		profileData: state.user, 
		username: state.router.params.username};
})( Radium(Profile) );

styles = {
	userImageWrapper: {
		margin: 30,
		width: 150,
		height: 150,
		border: '1px solid rgba(0,0,0,0.1)',
		borderRadius: '1px',
		float: 'left',
		// backgroundColor: 'rgba(190,250,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			margin: '30px auto',
		},
	},
	userImage: {
		width: '100%',
		height: '100%',
		
	},
	contentWrapper: {
		float: 'left',
		width: 'calc(100% - 242px)',
		// backgroundColor: 'rgba(255,190,89,0.4)',
		margin: '30px 30px 60px 0px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
			width: 'calc(100% - 30px)',
			padding: '0px 15px',
		},
	},
	profileName: {
		margin: 0,
		fontSize: '40px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '50px',
			textAlign: 'center',
		},
	},
	profileDetail: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textAlign: 'center',
			fontSize: '20px',
		},
	},

	statsWrapper: {
		borderWidth: '1px 0px 1px 0px',
		borderColor: '#CCC',
		borderStyle: 'solid',
		margin: '20px 0px',
		padding: '10px 0px',
		// clear: 'both',
		// height: 100,
		// backgroundColor: globalStyles.sideBackground,
		// backgroundColor: '#F0F0F0',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// height: 300
			margin: '30px 0px',
		},
	},
	statsList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
	statParenthese: {
		display: 'inline',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',	
		}
	},
	statsItem: {
		// backgroundColor: 'rgba(200,200,100,0.3)',

		height: '30px',
		width: 'calc(100% / 3)',
		margin: '10px 0px',
		display: 'inline-block',

		// whiteSpace: 'nowrap',
		overflow: 'hidden',
		// textOverflow: 'ellipsis',

		textDecoration: 'none',
		color: globalStyles.sideText,
		userSelect: 'none',

		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '50%',
			height: 70,
			margin: '20px 0px',
		},
		
	},

	statsTitle: {
		// backgroundColor: 'rgba(255,0,0,0.2)',
		// textAlign: 'center',
		height: 30,
		lineHeight: '30px',
		fontSize: '18px',
		display: 'inline-block',
		// backgroundColor: 'rgba(70,250,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			height: 25,
			lineHeight: '25px',
			fontSize: '25px',
			textAlign: 'center',
		},

	},
	statsCount: {
		// backgroundColor: 'rgba(0,92,0,0.2)',
		height: 30,
		paddingLeft: 10,
		// textAlign: 'center',
		lineHeight: '30px',
		fontSize: '18px',
		display: 'inline-block',
		// backgroundColor: 'rgba(190,70,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			height: 45,
			lineHeight: '40px',
			textAlign: 'center',
			fontSize: '35px',
		},
	},
	profileContent: {
		// width: 'calc(100% - 40px)',
		// margin: '0px 20px',
	},
	pubBlock: {
		margin: 15,
		float: 'left',
		backgroundColor: '#EAEAEA',
		fontFamily: 'Lora',
		width: 'calc(100% / 3 - 30px)',
		height: 175,
		overflow: 'hidden',
		position: 'relative',
		':hover': {
			backgroundColor: '#E5E5E5',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)'
		},

	},
	pubTextWrapper: {
		width: '100%',
		height: '100%',
	},
	pubTitle: {
		color: '#333',
		padding: '10px 10px 20px 10px',
		fontSize: '20px',
	},
	pubAbstract: {
		color: '#888',
		padding: '5px 15px 0px 15px',
	},
	pubEdit: {
		backgroundColor: '#FCFCFC',
		textAlign: 'center',
		position: 'absolute',
		bottom: 2,
		left: 2,
		height: '30px',
		lineHeight: '30px',
		color: '#555',
		width: 'calc(100% - 4px)',
		':hover': {
			cusror: 'pointer',
			color: '#111',

		},
	},
};
