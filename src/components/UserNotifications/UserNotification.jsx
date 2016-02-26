import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';

// import {globalMessages} from '../../utils/globalMessages';
import {FormattedDate, FormattedRelative} from 'react-intl';

let styles = {};

const UserNotification = React.createClass({
	propTypes: {
		notificationObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
		};
	},

	render: function() {
		
		const notification = this.props.notificationObject;
		// console.log(notification);
		return (
			<div style={styles.container}>

				{this.props.notificationObject.read
					? <div style={styles.unread}></div>
					: <div style={styles.unread}>●</div>
				}

				<div style={[styles.notificationText]}>
					{(() => {
						const discussion = notification.discussion || {};

						switch (this.props.notificationObject.type) {
						case 'discussion/repliedTo':
							return (
								<div>
									<Link to={'/user/' + notification.sender.username} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.sender.name}</span>
									</Link>
									<span> responded to your </span>
									<Link to={'/pub/' + notification.pub.slug + '/discussions/' + discussion._id} style={globalStyles.link}>
										<span style={styles.boldLink}>discussion</span>
									</Link>
								</div>
							);
						case 'discussion/pubComment':
							return (
								<div>
									<Link to={'/user/' + notification.sender.username} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.sender.name}</span>
									</Link>

									{discussion.version === 0
										? <span> commented on the draft of </span>
										: <span> added a discussion to your pub, </span>
									}
									{discussion.version === 0
										? <Link to={'/pub/' + notification.pub.slug + '/draft'} style={globalStyles.link}>
											<span style={styles.boldLink}>{notification.pub.title}</span>
										</Link>
										: <Link to={'/pub/' + notification.pub.slug} style={globalStyles.link}>
											<span style={styles.boldLink}>{notification.pub.title}</span>
										</Link>
									}
								</div>
							);
						case 'follows/followedYou':
							return (
								<div>
									<Link to={'/user/' + notification.sender.username} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.sender.name}</span>
									</Link>
									<span> followed you</span>
								</div>
							);
						case 'follows/followedPub':
							return (
								<div>
									<Link to={'/user/' + notification.sender.username} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.sender.name}</span>
									</Link>
									<span> followed your pub, </span>
									<Link to={'/pub/' + notification.pub.slug} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.pub.title}</span>
									</Link>
								</div>
							);
						case 'followers/newPub':
							return (
								<div>
									<Link to={'/user/' + notification.sender.username} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.sender.name}</span>
									</Link>
									<span> published a new pub: </span>
									<Link to={'/pub/' + notification.pub.slug} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.pub.title}</span>
									</Link>
								</div>
							);
						case 'followers/newVersion':
							return (
								<div>
									<Link to={'/user/' + notification.sender.username} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.sender.name}</span>
									</Link>
									<span> published a new version of their pub: </span>
									<Link to={'/pub/' + notification.pub.slug} style={globalStyles.link}>
										<span style={styles.boldLink}>{notification.pub.title}</span>
									</Link>
								</div>
							);
						default: 
							return null;
						}
					})()}	
				</div>
				

				<div style={styles.date}>
					{((new Date() - new Date(this.props.notificationObject.createDate)) / (1000 * 60 * 60 * 24)) < 7
						? <FormattedRelative value={this.props.notificationObject.createDate} />
						: <FormattedDate value={this.props.notificationObject.createDate} />
					}
				</div>							

				<div style={globalStyles.clearFix}></div>
			</div>
		);
	}
});

export default Radium(UserNotification);

styles = {
	container: {
		padding: '10px 0px',
		borderBottom: '1px solid rgba(0,0,0,0.1)',
	},
	
	unread: {
		width: '15px',
		height: '1px',
		float: 'left',
		fontFamily: 'Courier',
		fontSize: '13px',
		color: '#000',
		lineHeight: '22px',
	},
	notificationText: {
		width: 'calc(85% - 15px)',
		float: 'left',
		color: '#999',
	},
	boldLink: {
		color: '#000',
	},
	date: {
		width: '15%',
		float: 'left',
		textAlign: 'right',
		fontFamily: 'Courier',
		fontSize: '13px',
	}

};
