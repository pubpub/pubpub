import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {globalStyles} from '../../utils/styleConstants';
import {LoaderIndeterminate} from '../../components';
// import { Link } from 'react-router';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const GroupSettings = React.createClass({
	propTypes: {
		groupData: PropTypes.object,
		groupSaving: PropTypes.bool,
		isAdmin: PropTypes.bool,
		saveStatus: PropTypes.string,
		handleGroupSave: PropTypes.func,
		intl: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			groupData: {
				pubs: [],
				admins: [],
			},
		};
	},

	saveSettings: function() {
		const newObject = {
			groupName: this.refs.groupName.value,
			description: this.refs.description.value,
			background: this.refs.background.value.replace(/;/g, ''),
		};

		this.props.handleGroupSave(newObject);
	},

	removeUser: function(userID) {
		return () => {
			let outputUsers = this.props.groupData.admins.filter((user)=>{
				return user._id !== userID;
			});
			outputUsers = outputUsers.map((user)=>{
				return user._id;
			});
			
			this.props.handleGroupSave({admins: outputUsers});
		};
	},

	handleAddNew: function(userID) {
		return () => {
			const outputUsers = this.props.groupData.admins.map((user)=>{
				return user._id;
			});

			outputUsers.push(userID);
			
			this.props.handleGroupSave({admins: outputUsers});
		};
	},

	renderAdminSearchResults: function(results) {
		let totalCount = 0; // This is in the case that we have no results because the users in the list are already added
		const userObject = {};
		for (let index = this.props.groupData.admins.length; index--; ) {
			userObject[this.props.groupData.admins[index]._id] = this.props.groupData.admins[index];
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
			addNewAdmin: {
				id: 'group.addNewAdmin',
				defaultMessage: 'Add new admin',
			},
		});


		return (
			<div style={styles.container}>
				<div style={styles.header}>Settings</div>

				<div key={'groupSettings-groupName'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'groupSettings-groupName'}>
						<FormattedMessage {...globalMessages.GroupName} />
					</label>
					<input style={styles.manualFormInput} name={'groupName'} id={'groupSettings-groupName'} ref={'groupName'} type="text" defaultValue={this.props.groupData.groupName}/>
				</div>

				<div key={'groupSettings-description'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'groupSettings-description'}>
						<FormattedMessage {...globalMessages.Description} />
					</label>
					<textarea style={[styles.manualFormInput, styles.manualFormTextArea]} name={'description'} id={'groupSettings-description'} ref={'description'} defaultValue={this.props.groupData.description}></textarea>
				</div>

				<div key={'groupSettings-background'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'groupSettings-background'}>
						<FormattedMessage id="group.background" defaultMessage="Background CSS" />
					</label>
					<input style={styles.manualFormInput} name={'background'} id={'groupSettings-background'} ref={'background'} type="text" defaultValue={this.props.groupData.background}/>
				</div>

				<div style={styles.saveSettings} key={'groupSettingsSaveButton'} onClick={this.saveSettings}>
					<FormattedMessage {...globalMessages.save} />
				</div>

				<div style={styles.loader}>
					{this.props.groupSaving
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<div style={styles.header}>Admins</div>

				<div style={styles.adminAddWrapper}>
					<Autocomplete 
						autocompleteKey={'groupAdminAutocomplete'} 
						route={'autocompleteUsers'} 
						placeholder={this.props.intl.formatMessage(messages.addNewAdmin)}
						resultRenderFunction={this.renderAdminSearchResults}/>
				</div>
			

				{
					this.props.groupData.admins.map((admin, index) => {
						return (
							<div key={'admin-' + index} style={styles.rowContainer}>

								<div style={[styles.imageColumn, styles.columnHeader]}> <img style={styles.userImage} src={admin.thumbnail} /> </div>
								<div style={[styles.nameColumn]}>{admin.name}</div>
								<div key={'adminRemove-' + index} style={[styles.optionColumn, styles.optionColumnClickable, this.props.groupData.admins.length === 1 && styles.hideRemove]} onClick={this.removeUser(admin._id)}>
									<FormattedMessage {...globalMessages.remove} />
								</div>
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

export default injectIntl(Radium(GroupSettings));

styles = {
	header: {
		fontSize: '30px',
		margin: '10px 20px',
	},
	adminAddWrapper: {
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
	},

	// Settings Styles
	inputWrapper: {
		width: 'calc(50% - 40px)',
		margin: '30px 20px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(80% - 40px)',
		},
	},
	manualFormInputTitle: {
		fontSize: 20,
		color: '#BBB',
	},
	manualFormInput: {
		width: '100%',
		fontFamily: 'Courier',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#BBB',
		outline: 'none',
		fontSize: 18,
		color: '#555',
	},
	manualFormTextArea: {
		borderWidth: '1px 1px 1px 1px',
		minHeight: '100px',
		resize: 'vertical',
	},
	saveSettings: {
		fontSize: 20,
		width: '52px',
		padding: '0px 20px',
		marginBottom: 20,
		fontFamily: globalStyles.headerFont,
		cursor: 'pointer',
		':hover': {
			color: 'black',
		}
	},
	loader: {
		position: 'relative',
		top: -50,
		width: '100%',
		height: 1
	},
};
