import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles, navStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';
import UserNotification from './UserNotification';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserNotifications = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
		setNotificationsReadHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			profileData: {
				discussions: [],
				pubs: [],
			},
		};
	},

	getInitialState: function() {
		return {
			mode: '',
		};
	},

	componentDidMount() {
		this.props.setNotificationsReadHandler();
	},

	setMode: function(mode) {
		return ()=>{
			this.setState({mode: mode});
		};
	},

	render: function() {
		// console.log(this.props.profileData);
		return (
			<div style={styles.container}>

				<ul style={[navStyles.navList, styles.subNav]}></ul>
				
				{
					this.props.profileData.notifications && this.props.profileData.notifications.map((notification)=>{
						return (<div key={'notificationWrapper-' + notification._id}>
								<UserNotification notificationObject={notification} />
							</div>
						);
					})

				}
				{this.props.profileData.notifications && this.props.profileData.notifications.length === 0
					? <div style={globalStyles.emptyBlock}>
						{this.props.ownProfile === 'self'
							? <FormattedMessage id="user.noNotifications" defaultMessage="No Notifications"/>
							: <FormattedMessage id="user.mustBeLoggedInNotifications" defaultMessage="Must be logged in to view notifications"/>
						}
						
					</div>
					: null
				}

			</div>
		);
	}
});

export default Radium(UserNotifications);

styles = {
	subNav: {
		// margin: '10px 0px',
		// borderBottom: '1px solid #CCC',
		fontSize: '15px',
		margin: '0px 0px 35px 0px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '15px',
		}
	},
	noLeftPadding: {
		padding: '0px 20px 0px 2px',
	},
	inactiveNav: {
		color: '#bbb',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '15px',
		}
	},
	activeNav: {
		color: '#333',
	},
};
