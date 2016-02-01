import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {baseStyles} from './editorModalStyle';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {injectIntl, defineMessages, FormattedMessage} from 'react-intl';

let styles = {};

const EditorModalCollaborators = React.createClass({
	propTypes: {
		collaboratorData: PropTypes.object,
		updateCollaborators: PropTypes.func,
		intl: PropTypes.object,
	},

	getInitialState: function() {
		return {
			showInviteOptions: false,
		};
	},

	setPermission: function(mode, username) {
		return () => {
			// if the selected value is different than the set value
			if (mode !== this.props.collaboratorData[username].permission) {
				
				const newCollaboratorsObject = this.props.collaboratorData;
				newCollaboratorsObject[username].permission = mode;
				this.props.updateCollaborators(newCollaboratorsObject, null);
			}
		};
	},

	removeUser: function(username) {
		return () => {
			const removedUserID = this.props.collaboratorData[username]._id;
			const newCollaboratorsObject = this.props.collaboratorData;
			delete newCollaboratorsObject[username];
			this.props.updateCollaborators(newCollaboratorsObject, removedUserID);
		};
	},

	toggleshowInviteOptions: function() {
		this.setState({
			showInviteOptions: !this.state.showInviteOptions,	
		});
	},

	handleAddNew: function(result) {
		return () => {
			const newCollaboratorsObject = this.props.collaboratorData;
			if (result.username) {
				newCollaboratorsObject[result.username] = result;
				newCollaboratorsObject[result.username].permission = 'read';
			} else {
				newCollaboratorsObject[result.groupSlug] = result;
				newCollaboratorsObject[result.groupSlug].permission = 'read';
			}
			
			// console.log(newCollaboratorsObject);
			this.props.updateCollaborators(newCollaboratorsObject, null);
		};
	},

	renderCollaboratorsSearchResults: function(results) {
		let totalCount = 0; // This is in the case that we have no results because the users in the list are already added
		return (
			<div style={styles.results}>
				{

					results.map((result, index)=>{
						if (result.username in this.props.collaboratorData) {
							return null;
						}
						if (result.groupSlug in this.props.collaboratorData) {
							return null;
						}

						totalCount++;
						return (result.username
							? <div key={'collabSearchUser-' + index} style={styles.result}>
								
								<div style={styles.imageWrapper}>
									<img style={styles.image} src={result.thumbnail} />
								</div>
								<div style={styles.name}>{result.name}</div>
								<div style={styles.action} key={'collabSearchAdd-' + index} onClick={this.handleAddNew(result)}>
									<FormattedMessage {...globalMessages.add} />
								</div>
							</div>
							: <div key={'collabSearchUser-' + index} style={styles.result}>
								<div style={styles.groupName}>{result.groupName}</div>
								<div style={styles.groupSlug}>{result.groupSlug}</div>
								<div style={styles.action} key={'collabSearchAdd-' + index} onClick={this.handleAddNew(result)}>
									<FormattedMessage {...globalMessages.add} />
								</div>
							</div>
						);	
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
		const collaboratorData = [];
		for ( const key in this.props.collaboratorData ) {
			if (this.props.collaboratorData.hasOwnProperty(key)) {
				collaboratorData.push(this.props.collaboratorData[key]);
			}
		}

		const messages = defineMessages({
			addNewCollaborator: {
				id: 'editor.addNewCollaborator',
				defaultMessage: 'Add new collaborator',
			},
		});

		return (
			<div>
				<div style={baseStyles.topHeader}>
					<FormattedMessage {...globalMessages.collaborators} />
				</div>

				{/* Add new collaborators search bar */}
				<div style={[baseStyles.rightCornerSearch, styles.mainContent[this.state.showInviteOptions]]}>
					<Autocomplete 
						autocompleteKey={'collabAutocomplete'} 
						route={'autocompleteUsersAndGroups'} 
						placeholder={this.props.intl.formatMessage(messages.addNewCollaborator)}
						textAlign={'right'}
						resultRenderFunction={this.renderCollaboratorsSearchResults}/>
					{/* <input style={baseStyles.rightCornerSearchInput} type="text" placeholder="Add new collaborator"/> */}
					{/* <div key="refAdvancedText" style={baseStyles.rightCornerSearchAdvanced} onClick={this.toggleshowInviteOptions}>
						<FormattedMessage
							id="editor.inviteByEmail"
							defaultMessage="invite by email"/>
					</div> */}
				</div>

				{/* Back button when in invite by email mode */}
				<div style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[this.state.showInviteOptions]]} onClick={this.toggleshowInviteOptions}>
					<FormattedMessage {...globalMessages.back} />
				</div>

				{/* Generate collaborators table */}
				<div className="main-ref-content" style={styles.mainContent[this.state.showInviteOptions]}>
					<div style={styles.rowContainer}>

						<div style={[styles.imageColumn, styles.columnHeader]}></div>
						<div style={[styles.nameColumn, styles.columnHeader]}>
							<FormattedMessage
								id="editor.name"
								defaultMessage="name"/>
						</div>
						<div style={[styles.permissionsColumn, styles.columnHeader]}>
							<FormattedMessage
								id="editor.permissions"
								defaultMessage="permissions"/>
						</div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>

						<div style={styles.clearfix}></div>
					</div>
					

					{
						collaboratorData.map((collaborator, index) => {
							return (
								<div key={'collaborator-' + index} style={styles.rowContainer}>

									<div style={[styles.imageColumn, styles.columnHeader]}> <img style={styles.userImage} src={collaborator.thumbnail ? collaborator.thumbnail : '/thumbnails/group.png'} /> </div>
									<div style={[styles.nameColumn]}>{collaborator.name ? collaborator.name : collaborator.groupName}</div>
									<div style={[styles.permissionsColumn]}>
										<span key={'collaboratorPermissionsEdit-' + index} style={[styles.permission, collaborator.permission === 'edit' && styles.permissionActive]} onClick={this.setPermission('edit', collaborator.username ? collaborator.username : collaborator.groupSlug)}>
											<FormattedMessage
												id="editor.canEdit"
												defaultMessage="can edit"/>
										</span>
										<span style={[styles.permissionSeparator, collaborator.admin && styles.isAdminHidden]}>|</span>
										<span key={'collaboratorPermissionsRead-' + index} style={[styles.permission, collaborator.permission === 'read' && styles.permissionActive, collaborator.admin && styles.isAdminHidden]} onClick={this.setPermission('read', collaborator.username ? collaborator.username : collaborator.groupSlug)}>
											<FormattedMessage
												id="editor.canRead"
												defaultMessage="can only read"/>
										</span>
									</div>
									<div key={'collaboratorRemove-' + index} style={[styles.optionColumn, styles.optionColumnClickable, collaborator.admin && styles.isAdminHidden]} onClick={this.removeUser(collaborator.username ? collaborator.username : collaborator.groupSlug)}>
										<FormattedMessage {...globalMessages.remove} />
									</div>

									<div style={styles.clearfix}></div>
								</div>
							);
						})
					}
					
				</div>

				{/* Invite by email content */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptions[this.state.showInviteOptions], styles.addOptionsContent]}>

					<div style={styles.sectionHeader}>
						<FormattedMessage
							id="editor.InviteByEmailHeader"
							defaultMessage="Invite By Email"/>
					</div>
					<input type="text" placeholder={this.props.intl.formatMessage(globalMessages.emailAddress)} />

				</div>

			</div>
		);
	}
});

export default injectIntl(Radium(EditorModalCollaborators));

styles = {
	mainContent: {
		true: {
			display: 'none',
		},
	},
	addOptions: {
		true: {
			display: 'block',
		},
		display: 'none',
		
	},
	addOptionsContent: {
		padding: '15px 25px',
	},
	rowContainer: {
		width: 'calc(100% - 30px)',
		padding: 15,
		fontFamily: baseStyles.rowTextFontFamily,
		fontSize: baseStyles.rowTextFontSize,
	},
	columnHeader: {
		fontFamily: baseStyles.rowHeaderFontFamily,
		fontSize: baseStyles.rowHeaderFontSize,
		height: '30px',
	},
	imageColumn: {
		width: '30px',
		padding: '0px calc(5% - 15px)',
		float: 'left',
	},
	userImage: {
		width: '30px',
	},
	nameColumn: {
		width: 'calc(30% - 20px)',
		padding: '0px 10px',
		float: 'left',
		height: '30px',
		lineHeight: '30px',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	permissionsColumn: {
		width: 'calc(50% - 20px)',
		padding: '0px 10px',
		float: 'left',
		height: '30px',
		lineHeight: '30px',
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
	clearfix: {
		// necessary because we float elements with variable height 
		display: 'table',
		clear: 'both',
	},
	isAdminHidden: {
		display: 'none'
	},
	sectionHeader: {
		margin: 0,
		fontSize: '1.5em',
	},
	permission: {
		color: globalStyles.veryLight,
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		},
	},
	permissionSeparator: {
		padding: '0px 10px',
	},
	permissionActive: {
		color: 'black',
		':hover': {
			cursor: 'default',
			color: 'black',
		},
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
	groupName: {
		float: 'left',
		width: '45%',
		margin: '0px 2.5%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	groupSlug: {
		float: 'left',
		width: '25%',
		margin: '0px 15px',
		fontSize: '12px',
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
	}
};
