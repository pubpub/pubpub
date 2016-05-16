import React, {PropTypes} from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const HeaderNav = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
	},

	render: function() {
		const isLoggedIn = this.props.loginData.get('loggedIn');
		const headerStyle = {};
		return (
			<div className="header-bar" style={[styles.headerBar, headerStyle.headerBar]}>

				<div key="headerLogo" style={[styles.headerLogo]}>
					<Link to={'/'} style={globalStyles.link}>
						<div style={[styles.headerText, styles.logoLink, headerStyle.headerText]}>
							PubPub
						</div>
					</Link>
				</div>

				<div style={[styles.headerNavContainer]} >
					
					<div style={styles.headerNav}>
						<div styles={styles.right}>

							{
								this.props.loginData.getIn(['userData', 'notificationCount'])
									? 	<div>
											<Link to={'/user/' + this.props.loginData.getIn(['userData', 'username']) + '/notifications'}>
											<div key="headerNavNotifications" style={[styles.navButton, styles.notificationBlock, this.notificationStyle()]}>
												{this.props.loginData.getIn(['userData', 'notificationCount'])}
											</div></Link>
										</div>
									: null
							}

							<div key="headerNavLogin" >

								{/* If Logged Out */}
								{/* ------------- */}
								<span style={styles.loggedOut[isLoggedIn]}>
									<FormattedMessage {...globalMessages.login} />
								</span>

								{/* If Logged In */}
								{/* ------------ */}
								<Link to={'/user/' + this.props.loginData.getIn(['userData', 'username'])}>
									<span key="headerLogin" style={[styles.loggedIn[isLoggedIn]]}>

										<img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'thumbnail'])} />
										{/* <div style={styles.userName}>{this.props.loginData.getIn(['userData', 'name'])}</div> */}
										<div style={[styles.userName, this.headerTextColorStyle()]}>
											<FormattedMessage {...globalMessages.account} />
										</div>

									</span>
								</Link>

							</div>

							{/*
								this.props.loginData.get('loggedIn') === true
									? 	<div>
											<div style={styles.separator}></div>
											<Link to={'/pubs/create'}><div key="headerNavNewPub" style={[styles.navButton, this.headerTextColorStyle()]}>
												<FormattedMessage {...globalMessages.newPub} />
											</div></Link>
											{
												this.props.isJournalAdmin
													? <div>
														<div style={styles.separator}></div>
														<Link to={'/journal/' + this.props.journalSubdomain}><div key="headerNavAdmin" style={[styles.navButton, this.headerTextColorStyle()]}>
															<FormattedMessage {...globalMessages.journalAdmin} />
														</div></Link>
													</div>
													: null
											}
										</div>
									: null
							*/}


						</div>
					</div>
				</div>

			</div>
			
		);
	}
});

export default Radium(HeaderNav);

styles = {
	right: {
		float: 'right',
	},
	navButton: {
		float: 'right',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		fontFamily: globalStyles.headerFont,
		padding: '0px 15px',
		':hover': {
			cursor: 'pointer',
		}
	},
	accountSpanWithNotification: {
		padding: '0px 5px 0px 15px',
	},
	notificationBlock: {
		height: '18px',
		lineHeight: '16px',
		padding: '0px 5px',
		margin: '6px 6px 6px -0px',
		textAlign: 'center',
		borderRadius: '1px',
	},
	separator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'right',
	},

	loggedOut: {
		true: {
			display: 'none',
		}
	},
	loggedIn: {
		false: {
			display: 'none',
		}
	},
	userImage: {
		height: 18,
		width: 18,
		padding: 6,
		float: 'right',
	},
	userName: {
		float: 'right',
		padding: '0px 3px 0px 0px',
	},
};

// {( this.props.loginData.get('loggedIn') === false
// 	? <span>Login</span>
// 	: ( <div>
// 			<img src={this.props.loginData.getIn(['userData', 'image'])} />
// 			{this.props.loginData.getIn(['userData', 'name'])}
// 		</div>)
// )}
