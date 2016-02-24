import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {globalStyles} from '../../utils/styleConstants';
// import { Link } from 'react-router';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const GroupMembers = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
		isAdmin: PropTypes.bool,
		saveStatus: PropTypes.string,
		handleGroupSave: PropTypes.func,
		intl: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			groupData: {
				pubs: [],
				members: [],
			},
		};
	},

	removeUser: function(userID) {
		return () => {
			let outputUsers = this.props.groupData.members.filter((user)=>{
				return user._id !== userID;
			});
			outputUsers = outputUsers.map((user)=>{
				return user._id;
			});

			this.props.handleGroupSave({members: outputUsers});
		};
	},

	handleAddNew: function(userID) {
		return () => {
			const outputUsers = this.props.groupData.members.map((user)=>{
				return user._id;
			});

			outputUsers.push(userID);

			this.props.handleGroupSave({members: outputUsers});
		};
	},

	renderMemberSearchResults: function(results) {
		let totalCount = 0; // This is in the case that we have no results because the users in the list are already added
		const userObject = {};
		for (let index = this.props.groupData.members.length; index--; ) {
			userObject[this.props.groupData.members[index]._id] = this.props.groupData.members[index];
		}
		return (
			<div style={styles.results}>
				{

					results.map((user, index)=>{

						if (user._id in userObject) {
							return null;
						}

						totalCount++;
						return (<div key={'collabSearchUser-' + index} style={styles.result}>

							<div style={styles.imageWrapper}>
								<img style={styles.image} src={user.thumbnail} />
							</div>
							<div style={styles.name}>{user.name}</div>
							<div style={styles.action} key={'collabSearchAdd-' + index} onClick={this.handleAddNew(user._id)}>
								<FormattedMessage {...globalMessages.add} />
							</div>
						</div>);
					})
				}
				{results.length === 0 || totalCount === 0
					? <div style={styles.noResults}>
						<FormattedMessage {...globalMessages.noResults} />
					</div>
					: null
				}
			</div>
		);
	},

	render: function() {
		// console.log('groupData', this.props.groupData);
		const messages = defineMessages({
			addNewMember: {
				id: 'group.addNewMember',
				defaultMessage: 'Add new member',
			},
		});

		return (
			<div style={styles.container}>
				<div style={styles.header}>Members</div>

				{this.props.isAdmin
					? <div style={styles.memberAddWrapper}>
						<Autocomplete
							autocompleteKey={'groupMemberAutocomplete'}
							route={'autocompleteUsers'}
							placeholder={this.props.intl.formatMessage(messages.addNewMember)}
							resultRenderFunction={this.renderMemberSearchResults}/>
					</div>
					: null
				}

				{
					this.props.groupData.members.map((member, index) => {
						return (
							<div key={'admin-' + index} style={styles.rowContainer}>

								<div style={[styles.imageColumn, styles.columnHeader]}> <img style={styles.userImage} src={member.thumbnail} /> </div>
								<div style={[styles.nameColumn]}>{member.name}</div>
								{
									this.props.isAdmin ?
									<div key={'adminRemove-' + index} style={[styles.optionColumn, styles.optionColumnClickable, this.props.groupData.members.length === 1 && styles.hideRemove]} onClick={this.removeUser(member._id)}>
										<FormattedMessage {...globalMessages.remove} />
									</div>
								: null
								}
								<div style={globalStyles.clearFix}></div>

							</div>
						);
					})
				}
				<div style={globalStyles.clearFix}></div>

			</div>
		);
	}
});

export default injectIntl(Radium(GroupMembers));

styles = {
	header: {
		fontSize: '30px',
		margin: '10px 20px',
	},
	memberAddWrapper: {
		width: 'calc(50% - 40px)',
		margin: '20px 20px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(80% - 40px)',
		}
	},
	results: {
		boxShadow: '0px 0px 2px 2px #D7D7D7',
		width: 'calc(100% - 6px)',
		margin: '0 auto 5px auto',
		backgroundColor: 'white',

	},
	result: {
		height: 30,
		width: 'calc(100% - 10px)',
		padding: '5px 0px',
		margin: '0px 5px',
		borderBottom: '1px solid #F0F0F0',
		fontFamily: 'Courier',
		fontSize: '15px',
		lineHeight: '30px',
	},

	imageWrapper: {
		float: 'left',
		height: '100%',
		width: 30,
	},
	image: {
		height: '100%',
	},
	name: {
		float: 'left',
		width: '65%',
		margin: '0px 5%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	action: {
		float: 'left',
		width: 'calc(100% - 30px - 75%)',
		textAlign: 'center',
		userSelect: 'none',
		color: globalStyles.veryLight,
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},
	noResults: {
		fontFamily: 'Courier',
		fontSize: '15px',
		height: 30,
		lineHeight: '30px',
		textAlign: 'center',
	},

	rowContainer: {
		width: 'calc(60% - 40px)',
		padding: '5px 20px',
		fontFamily: 'Courier',
		fontSize: 15,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
		}
	},

	imageColumn: {
		width: '50px',
		padding: '0px calc(10% - 50px) 0px 0px',
		float: 'left',
	},
	userImage: {
		width: '50px',
	},
	nameColumn: {
		width: 'calc(70% - 20px)',
		padding: '0px 10px',
		float: 'left',
		height: '50px',
		lineHeight: '50px',
		fontSize: '18px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	optionColumn: {
		width: 'calc(20% - 10px)',
		padding: '0px 5px',
		float: 'left',
		textAlign: 'center',
		height: '50px',
		lineHeight: '50px',
		fontSize: '16px',

	},
	optionColumnClickable: {
		userSelect: 'none',
		color: globalStyles.veryLight,
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},
	hideRemove: {
		display: 'none',
	}
};
