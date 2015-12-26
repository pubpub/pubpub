import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {LoaderIndeterminate} from '../../components';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const JournalSettings = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		journalSaving: PropTypes.bool,
		journalSaveHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			journalData: {},
		};
	},

	saveSettings: function() {
		const newObject = {
			journalName: this.refs.name.value,
			customDomain: this.refs.customDomain.value,
		};

		this.props.journalSaveHandler(newObject);
	},

	removeUser: function(userID) {
		return () => {
			const outputAdmins = this.props.journalData.admins.filter((admin)=>{
				return admin._id !== userID;
			});
			
			this.props.journalSaveHandler({admins: outputAdmins});
		};
	},

	handleAddNew: function(userID) {
		return () => {
			const outputAdmins = this.props.journalData.admins.map((admin)=>{
				return admin._id;
			});
			outputAdmins.push(userID);
			
			this.props.journalSaveHandler({admins: outputAdmins});
		};
	},

	renderAdminSearchResults: function(results) {
		let totalCount = 0; // This is in the case that we have no results because the users in the list are already added
		const adminObject = {};
		for (let index = this.props.journalData.admins.length; index--; ) {
			adminObject[this.props.journalData.admins[index]._id] = this.props.journalData.admins[index];
		}
		return (
			<div style={styles.results}>
				{

					results.map((user, index)=>{
						// for(let index = this.props.journalData.admins.length; index--; ) {
						// 	if (String(this.props.journalData.admins[index]._id) === String(user._id)) {
						// 		return null;
						// 	}
						// }

						if (user._id in adminObject) {
							return null;
						}

						totalCount++;
						return (<div key={'collabSearchUser-' + index} style={styles.result}>
							
							<div style={styles.imageWrapper}>
								<img style={styles.image} src={user.thumbnail} />
							</div>
							<div style={styles.name}>{user.name}</div>
							<div style={styles.action} key={'collabSearchAdd-' + index} onClick={this.handleAddNew(user._id)}>add</div>
						</div>);	
					})
				}
				{results.length === 0 || totalCount === 0
					? <div style={styles.noResults}>No Results</div>
					: null
				}
			</div>
		);
	},

	render: function() {
		// console.log(this.props.journalData);
		return (
			<div style={styles.container}>

				<div key={'settingsForm-name'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'name'}>Journal Name</label>
					<input style={styles.manualFormInput} name={'name'} id={'settingsForm-name'} ref={'name'} type="text" defaultValue={this.props.journalData.journalName}/>
				</div>

				<div key={'settingsForm-customDomain'} style={styles.inputWrapper}>
					<label style={styles.manualFormInputTitle} htmlFor={'customDomain'}>Custom Domain</label>
					<input style={styles.manualFormInput} name={'customDomain'} id={'settingsForm-customDomain'} ref={'customDomain'} type="text" defaultValue={this.props.journalData.customDomain}/>
				</div>

				<div style={styles.saveSettings} key={'userSettingsSaveButton'} onClick={this.saveSettings}>Save</div>

				<div style={styles.loader}>
					{this.props.journalSaving
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<div style={styles.settingsHeader}>Journal Admins</div>
				<div style={styles.adminAddWrapper}>
					<Autocomplete 
						autocompleteKey={'journalAdminAutocomplete'} 
						route={'autocompleteUsers'} 
						placeholder="Add new admin" 
						resultRenderFunction={this.renderAdminSearchResults}/>
				</div>

				{
					this.props.journalData.admins.map((admin, index) => {
						return (
							<div key={'admin-' + index} style={styles.rowContainer}>

								<div style={[styles.imageColumn, styles.columnHeader]}> <img style={styles.userImage} src={admin.thumbnail} /> </div>
								<div style={[styles.nameColumn]}>{admin.name}</div>
								<div key={'adminRemove-' + index} style={[styles.optionColumn, styles.optionColumnClickable, this.props.journalData.admins.length === 1 && styles.hideRemove]} onClick={this.removeUser(admin._id)}>remove</div>
								<div style={globalStyles.clearFix}></div>

							</div>
						);
					})
				}
				
			</div>
		);
	}
});

export default Radium(JournalSettings);

styles = {
	container: {
		margin: '10px 0px',
		fontFamily: 'Courier',
		position: 'relative',
	},
	settingsHeader: {
		fontFamily: globalStyles.headerFont,
		fontSize: '25px',
	},
	inputWrapper: {
		width: '400px',
		margin: '30px 20px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 40px)',
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
	adminAddWrapper: {
		width: '60%',
		margin: '20px 20px',
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
		width: 'calc(100% - 30px)',
		padding: '5px 20px',
		fontFamily: 'Courier',
		fontSize: 15,
	},

	imageColumn: {
		width: '30px',
		padding: '0px calc(10% - 30px) 0px 0px',
		float: 'left',
	},
	userImage: {
		width: '30px',
	},
	nameColumn: {
		width: 'calc(80% - 20px)',
		padding: '0px 10px',
		float: 'left',
		height: '30px',
		lineHeight: '30px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	optionColumn: {
		width: 'calc(10% - 10px)',
		padding: '0px 5px',
		float: 'left',
		textAlign: 'center',
		height: '30px',
		lineHeight: '30px',
		
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
