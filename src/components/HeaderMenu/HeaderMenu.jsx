import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const HeaderMenu = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		color: PropTypes.string,
		hoverColor: PropTypes.string,
		loginToggle: PropTypes.func,
		menuOpen: PropTypes.bool,

		openMenuHandler: PropTypes.func,
		closeMenuHandler: PropTypes.func,
		openPubModalHandler: PropTypes.func,
		pubStatus: PropTypes.string,
		followPubToggleHandler: PropTypes.func,
		isFollowing: PropTypes.bool,
		journalCount: PropTypes.number, 
		historyCount: PropTypes.number,
		analyticsCount: PropTypes.number,
		citationsCount: PropTypes.number,
		newsCount: PropTypes.number,

		isJournalAdmin: PropTypes.bool,
		journalSubdomain: PropTypes.string,

		slug: PropTypes.string,
		path: PropTypes.string,
	},

	headerTextColorStyle: function() {
		return {
			color: this.props.color,
			':hover': {
				color: this.props.hoverColor,
			}
		};
	},

	// openMenu: function() {
	// 	this.props.setQueryHandler({menu: true});
	// },

	// closeMenu: function() {
	// 	this.props.goBackHandler(-1);
	// },

	// openPubModal: function(mode) {
		
	// 		// this.props.setQueryHandler({mode: mode});
	// 		this.props.openPubModalHandler
	// 	};
	// },

	render: function() {
		const isLoggedIn = this.props.loginData.get('loggedIn');
		const isPub = this.props.path.indexOf('/pub') > -1 && this.props.path.indexOf('/draft') === -1;
		const notificationCount = this.props.loginData.getIn(['userData', 'notificationCount']);
		return (
			<div styles={styles.right}>

				<div key="headerMenuLogin" onClick={this.props.openMenuHandler} style={[styles.navButton, this.headerTextColorStyle()]}>
					<span>
						<FormattedMessage {...globalMessages.menu} />
					</span>
				</div>

				<div className="menuDrawer" style={[
					styles.menuDrawer,
					this.props.menuOpen && styles.menuDrawerOpen
				]}>
					<div style={styles.closeBar} onClick={this.props.closeMenuHandler}></div>
					<div style={styles.menuContent}>
						<ul style={styles.menuList}>
							<li key="menuListItem0" style={[styles.menuItem, styles.menuItemClose]} onClick={this.props.closeMenuHandler}>
								<FormattedMessage {...globalMessages.close} />
							</li>
							{
								isLoggedIn
									? <Link to={'/user/' + this.props.loginData.getIn(['userData', 'username'])}>
										<li key="menuListItem1" style={[styles.menuItem, !this.props.isJournalAdmin && !notificationCount && styles.menuItemNoBottom]}>
											<span key="headerLogin" style={[styles.loggedIn[isLoggedIn]]}>
												<img style={styles.userImage} src={this.props.loginData.getIn(['userData', 'thumbnail'])} />
												{/* <div style={styles.userName}>{this.props.loginData.getIn(['userData', 'name'])}</div> */}
												<div style={styles.userName}>
													<FormattedMessage {...globalMessages.account} />
												</div>
												<div style={globalStyles.clearFix}></div>
											</span>
										</li>
									</Link>
									: <li key="menuListItem1" style={[styles.menuItem, !this.props.isJournalAdmin && styles.menuItemNoBottom]} onClick={this.props.loginToggle}>
										<span style={styles.loggedOut[isLoggedIn]}>
											<FormattedMessage {...globalMessages.loginOrRegister} />
										</span>
									</li>

							}

							{
								notificationCount
									? <Link to={'/user/' + this.props.loginData.getIn(['userData', 'username']) + '/notifications'} style={globalStyles.link}>
										<li key="menuListItem23" style={[styles.menuItem, !this.props.isJournalAdmin && styles.menuItemNoBottom]}>
											<FormattedMessage id="nav.userNotifications" defaultMessage="Notifications ({count})" values={{count: notificationCount}}/>
										</li>
									</Link> 
									: null
							}
							
							{
								this.props.isJournalAdmin 
									? <Link to={'/journal/' + this.props.journalSubdomain} style={globalStyles.link}><li key="menuListItem22" style={[styles.menuItem, styles.menuItemNoBottom]}>
										<FormattedMessage {...globalMessages.journalAdmin} />
									</li></Link> 
									: null
							}

							{/* <li key="menuListItem2" style={[styles.menuItem, styles.menuItemNoBottom, styles.menuItemLink]}><Link style={styles.innerLink}to={'/pubs/create'}>New Pub</Link></li> */}
							
							{(isPub === true
								? <div>
									<li key="menuListItem3" style={styles.menuItemseparator}></li>
									<li key="menuListItem4" style={styles.menuItem} onClick={this.props.followPubToggleHandler}>
										{this.props.isFollowing 
											? <FormattedMessage {...globalMessages.following} />
											: <FormattedMessage {...globalMessages.follow} />
										}
									</li>
									
									<li key="menuListItem5" style={styles.menuItem} onClick={this.props.openPubModalHandler('tableOfContents')}>
										<FormattedMessage {...globalMessages.tableOfContents} />
									</li>

									<li key="menuListItem7" style={styles.menuItem} onClick={this.props.openPubModalHandler('discussions')}>
										<FormattedMessage {...globalMessages.discussions} />
									</li>

									<li key="menuListItem6" style={[styles.menuItem, this.props.pubStatus === 'Draft' && styles.hidden]} onClick={this.props.openPubModalHandler('reviews')}>
										<FormattedMessage {...globalMessages.reviews} />
									</li>

									{/* <Link to={'/pub/' + this.props.slug + '/experts'} style={globalStyles.link}><li key="menuListItem16" style={[styles.menuItem]}>
										<FormattedMessage {...globalMessages.experts} />
									</li></Link> */}

									<Link to={'/pub/' + this.props.slug + '/journals'} style={globalStyles.link}><li key="menuListItem28" style={styles.menuItem}>
										<FormattedMessage {...globalMessages.Journals} />
										{/* <span style={styles.count}> ({this.props.journalCount})</span> */}
									</li></Link>

									<Link to={'/pub/' + this.props.slug + '/history'} style={globalStyles.link}><li key="menuListItem8" style={styles.menuItem}>
										<FormattedMessage {...globalMessages.history} />
										{/* <span style={styles.count}> ({this.props.historyCount})</span> */}
									</li></Link>

									<Link to={'/pub/' + this.props.slug + '/analytics'} style={globalStyles.link}><li key="menuListItem18" style={styles.menuItem}>
										<FormattedMessage {...globalMessages.analytics} />
										{/* <span style={styles.count}> ({this.props.analyticsCount})</span> */}
									</li></Link>

									<Link to={'/pub/' + this.props.slug + '/citations'} style={globalStyles.link}><li key="menuListItem19" style={styles.menuItem}>
										<FormattedMessage {...globalMessages.citations} />
										{/* <span style={styles.count}> ({this.props.citationsCount})</span> */}
									</li></Link>

									<Link to={'/pub/' + this.props.slug + '/news'} style={globalStyles.link}><li key="menuListItem20" style={styles.menuItem}>
										<FormattedMessage {...globalMessages.inthenews} />
										{/* <span style={styles.count}> ({this.props.newsCount})</span> */}
									</li></Link>

									<Link to={'/pub/' + this.props.slug + '/source'} style={globalStyles.link}><li key="menuListItem9" style={styles.menuItem}>
										<FormattedMessage {...globalMessages.source} />
									</li></Link>

									<li key="menuListItem10" style={[styles.menuItem, styles.menuItemNoBottom]} onClick={this.props.openPubModalHandler('cite')}>
										<FormattedMessage {...globalMessages.cite} />
									</li>

									</div>
								: null
							)}
							
							<li key="menuListItem11" style={styles.menuItemseparator}></li>

							<Link style={globalStyles.link} to={'/pub/about'}><li key="menuListItem12" style={styles.menuItem}>
								<FormattedMessage {...globalMessages.FAQ} />
							</li></Link>

							<a style={globalStyles.link} target="_blank" href={'mailto:pubpub@media.mit.edu'}><li key="menuListItem14" style={styles.menuItem}>
								<FormattedMessage {...globalMessages.contact} />
							</li></a>
							
						</ul>
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(HeaderMenu);

styles = {
	right: {
		float: 'right',
	},
	navButton: {
		float: 'right',
		height: globalStyles.headerHeightMobile,
		lineHeight: globalStyles.headerHeightMobile,
		fontFamily: globalStyles.headerFont,
		fontSize: '1.5em',
		padding: '0px 15px 0px 25px',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
		}
	},
	hidden: {
		display: 'none',
	},
	menuDrawer: {
		width: '100vw',
		height: '100vh',
		// backgroundColor: 'rgba(255,0,190,0.2)',
		position: 'absolute',
		top: 0,
		right: 0,
		transition: '.2s linear transform',
		// transform: 'translateX(105%)',
		transform: 'translate3d(105%,0,0)',
	},
	menuDrawerOpen: {
		// transform: 'translateX(0%)',
		transform: 'translate3d(0%,0,0)',
	},
	closeBar: {
		float: 'left',
		width: '10%',
		height: '100%',
		// backgroundColor: 'rgba(255,0,190,0.2)',
	},
	menuContent: {
		float: 'left',
		width: '90%',
		height: '100%',
		overflowY: 'scroll',
		backgroundColor: globalStyles.sideBackground,
		boxShadow: '0px 3px 4px 2px rgba(0,0,0,0.5)',
		color: globalStyles.headerBackground,

	},
	menuList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
	menuItem: {
		textAlign: 'right',
		fontSize: '2em',
		width: 'calc(100% - 100px)',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		padding: '20px 20px',
		margin: '0px 0px 0px 60px',
		borderBottom: '1px solid rgba(0,0,0,0.1)',
		fontFamily: globalStyles.headerFont,
		color: globalStyles.headerBackground,
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
	},
	menuItemLink: {
		padding: 0,
		width: 'calc(100% - 60px)',
	},
	innerLink: {
		padding: '20px 20px',
		width: 'calc(100% - 40px)',
		height: 'calc(100% - 40px)',
		display: 'block',
		textDecoration: 'none',
		color: globalStyles.headerBackground,
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
	},
	menuItemNoBottom: {
		borderBottom: '0px solid black',
	},
	menuItemseparator: {
		backgroundColor: 'rgba(200,200,200,0.2)',
		height: 20,
		width: '100%',
	},
	menuItemClose: {
		borderBottom: '0px solid black',
		margin: '0px 0px 40px 60px',
	},
	userImage: {
		height: 34,
		width: 34,
		float: 'right',
	},
	userName: {
		float: 'right',
		padding: '0px 10px 0px 0px',
		color: globalStyles.headerBackground,
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
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
	count: {

	},
};
