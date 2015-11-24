import React, {PropTypes} from 'react';
import Radium from 'radium';
import {Autocomplete} from '../../containers';
import {baseStyles} from './modalStyle';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const EditorModalCollaborators = React.createClass({
	propTypes: {
		collaboratorData: PropTypes.object,
		updateCollaborators: PropTypes.func,
	},

	getInitialState: function() {
		return {
			showInviteOptions: false,
		};
	},
	toggleshowInviteOptions: function() {
		this.setState({
			showInviteOptions: !this.state.showInviteOptions,	
		});
	},

	renderCollaboratorsSearchResults: function(results) {
		console.log(results);
		return (
			<div style={styles.results}>
				{
					results.map((user, index)=>{
						return (<div key={'collabSearchUser-' + index} style={styles.result}>
							
							<div style={styles.imageWrapper}>
								<img style={styles.image} src={user.thumbnail} />
							</div>
							<div style={styles.name}>{user.name}</div>
							<div style={styles.action}>add</div>
						</div>);	
					})
				}
			</div>
		);
	},


	render: function() {
		// const sampleCollaborators = [
		// 	{
		// 		image: 'https://s3.amazonaws.com/pubpub-upload/lip.png',
		// 		name: 'Andy Lippman',
		// 		permissions: 'edit'
		// 	},
		// 	{
		// 		image: 'https://s3.amazonaws.com/pubpub-upload/travis.png',
		// 		name: 'Cesar Hidalgo',
		// 		permissions: 'read'
		// 	},
		// 	{
		// 		image: 'https://s3.amazonaws.com/pubpub-upload/kevin.png',
		// 		name: 'Kevin McManus',
		// 		permissions: 'edit'
		// 	},
		// ];

		const collaboratorData = [];
		for ( const key in this.props.collaboratorData ) {
			if (this.props.collaboratorData.hasOwnProperty(key)) {
				collaboratorData.push(this.props.collaboratorData[key]);
			}
		}

		return (
			<div>
				<h2 style={baseStyles.topHeader}>Collaborators</h2>

				{/* Add new collaborators search bar */}
				<div style={[baseStyles.rightCornerSearch, styles.mainContent[this.state.showInviteOptions]]}>
					<Autocomplete 
						autocompleteKey={'collabAutocomplete'} 
						route={'autocompleteUsers'} 
						placeholder="Add new collaborator" 
						textAlign={'right'} 
						resultRenderFunction={this.renderCollaboratorsSearchResults}/>
					{/* <input style={baseStyles.rightCornerSearchInput} type="text" placeholder="Add new collaborator"/> */}
					<div key="refAdvancedText" style={baseStyles.rightCornerSearchAdvanced} onClick={this.toggleshowInviteOptions}>invite by email</div>
				</div>

				{/* Back button when in invite by email mode */}
				<div style={[baseStyles.rightCornerAction, styles.addOptions, styles.addOptions[this.state.showInviteOptions]]} onClick={this.toggleshowInviteOptions}>
					Back
				</div>

				{/* Generate collaborators table */}
				<div className="main-ref-content" style={styles.mainContent[this.state.showInviteOptions]}>
					<div style={styles.rowContainer}>

						<div style={[styles.imageColumn, styles.columnHeader]}></div>
						<div style={[styles.nameColumn, styles.columnHeader]}>name</div>
						<div style={[styles.permissionsColumn, styles.columnHeader]}>permissions</div>
						<div style={[styles.optionColumn, styles.columnHeader]}></div>

						<div style={styles.clearfix}></div>
					</div>
					

					{
						collaboratorData.map((collaborator, index) => {
							return (
								<div key={'collaborator-' + index} style={styles.rowContainer}>

									<div style={[styles.imageColumn, styles.columnHeader]}> <img style={styles.userImage} src={collaborator.thumbnail} /> </div>
									<div style={[styles.nameColumn]}>{collaborator.name}</div>
									<div style={[styles.permissionsColumn]}>
										<span key={'collaboratorPermissionsEdit-' + index} style={[styles.permission, collaborator.permission === 'edit' && styles.permissionActive]}>can edit</span>
										<span style={[styles.permissionSeparator, collaborator.admin && styles.isAdminHidden]}>|</span>
										<span key={'collaboratorPermissionsRead-' + index} style={[styles.permission, collaborator.permission === 'read' && styles.permissionActive, collaborator.admin && styles.isAdminHidden]}>can read only</span>
									</div>
									<div style={[styles.optionColumn, collaborator.admin && styles.isAdminHidden]}>remove</div>

									<div style={styles.clearfix}></div>
								</div>
							);
						})
					}
					
				</div>

				{/* Invite by email content */}
				<div className="add-options-content" style={[styles.addOptions, styles.addOptions[this.state.showInviteOptions], styles.addOptionsContent]}>

					<h2 style={styles.sectionHeader}>Invite By Email</h2>
					<input type="text" placeholder="email address" />

				</div>

			</div>
		);
	}
});

export default Radium(EditorModalCollaborators);

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
		border: '1px solid red',

	},
	result: {
		height: 30,
		width: '100%',
		margin: '5px 0px',
	},
	imageWrapper: {
		float: 'left',
		height: '100%',
	},
	image: {
		height: '100%',
	},
	name: {
		float: 'left',
	},
	action: {
		float: 'left',
	}
};
