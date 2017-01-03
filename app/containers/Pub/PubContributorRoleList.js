import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';
import { Link as UnwrappedLink } from 'react-router';
const Link = Radium(UnwrappedLink);
import { postContributorRole, deleteContributorRole } from './actionsContributors';

let styles;

export const PubContributorRoleList = React.createClass({
	propTypes: {
		allRoles: PropTypes.array,
		selectedRoles: PropTypes.array,
		pubId: PropTypes.number, // id of the pub the contributor is a part of
		contributorId: PropTypes.number, // id of the contributor the role is being applied to.
		canSelect: PropTypes.bool,
		pathname: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			selectedRoles: [],
		};
	},

	componentWillMount() {
		this.setState({ selectedRoles: this.props.selectedRoles });
	},

	selectRole: function(role) {
		const selectedRoles = this.state.selectedRoles || [];
		const roleIds = selectedRoles.map((roleItem)=> {
			return roleItem.id;
		});

		const newSelected = roleIds.includes(role.id)
			? selectedRoles.filter((roleItem)=> {
				return role.id !== roleItem.id;
			})
			: [...selectedRoles, role];
		
		this.setState({ selectedRoles: newSelected });

		// If we have dispatch and a pubId, save the result
		if (this.props.contributorId && this.props.dispatch) {
			const action = roleIds.includes(role.id) ? deleteContributorRole : postContributorRole;
			this.props.dispatch(action(this.props.pubId, this.props.contributorId, role.id));
		}
		
	},

	render() {
		const allRoles = this.props.allRoles || [];
		
		const selectedRoles = this.state.selectedRoles || [];
		const selectedRoleIds = selectedRoles.map((roleItem)=> {
			return roleItem.id;
		});

		// If we're using local roles, we want to use the color/title kept in allRoles in case they've been updated.
		const selectedRolesRender = allRoles.filter((role)=> {
			return selectedRoleIds.includes(role.id);
		});

		// Define Popover content for roles button when we are using local (i.e. journal-owned) roles
		const localRolesContent = (
			<div style={styles.popoverContentWrapper}>

				{/* Display all possible roles that can be applied. Provide options to edit */}
				{allRoles.map((role, index)=> {
					return (
						<div className="pt-button-group pt-fill pt-minimal" key={'pubrole- ' + role.id}>
							<button className="pt-button pt-fill" style={styles.roleButton} onClick={this.selectRole.bind(this, role)}>
								<span style={styles.roleColor} className={selectedRoleIds.includes(role.id) ? 'pt-icon-standard pt-icon-small-tick' : ''} /> {role.title}
							</button>
							
						</div>
					);
				})}
				
			</div>
		);	

		return (
			<div style={styles.container}>
				{this.props.canSelect && 
					<Popover 
						content={localRolesContent}
						interactionKind={PopoverInteractionKind.CLICK}
						position={Position.BOTTOM_LEFT}
						transitionDuration={200}
					>
						<span className="pt-tag" style={styles.editRolesButton}>
							Roles <span className="pt-icon-standard pt-icon-small-plus" style={styles.editRolesButtonIcon} />
						</span>	
					</Popover>
				}

				{selectedRolesRender.map((role, index)=> {
					// const toObject = { pathname: this.props.pathname, query: { ...this.props.query, role: role.title, path: undefined, author: undefined, sort: undefined, discussion: undefined } };
					// return <Link to={toObject} key={'role-' + index} className="pt-tag" style={[styles.role, { backgroundColor: role.color || '#CED9E0', color: role.color ? '#FFF' : '#293742' }]}>{role.title}</Link>;
					return <span key={'role-' + index} className="pt-tag" style={[styles.role, { backgroundColor: role.color || '#CED9E0', color: role.color ? '#FFF' : '#293742' }]}>{role.title}</span>;
				})}
					
			</div>
		);
	},


});

export default Radium(PubContributorRoleList);

styles = {
	container: {
		padding: '0.5em 0em',
		// textAlign: 'right',
	},
	popoverContentWrapper: {
		padding: '0.5em',
		minWidth: '150px',
	},
	role: {
		backgroundColor: '#CED9E0', 
		margin: '0em .25em .25em 0em', 
		textDecoration: 'none',
	},
	editRolesButton: {
		backgroundColor: 'transparent',
		boxShadow: 'inset 0px 0px 0px 1px #BBB',
		color: '#888',
		cursor: 'pointer',
		margin: '0em .25em .25em 0em',
	},
	editRolesButtonIcon: {
		color: '#888',
	},
	roleEditCard: {
		padding: '1em 0.5em', 
		margin: '1em 0em',
	},
	roleEditInput: {
		width: '100%',
		marginBottom: '1em',
	},
	roleEditActions: {
		marginTop: '1em',
	},
	roleButton: {
		textAlign: 'left',
	},
	roleColor: {
		display: 'inline-block',
		width: '16px',
		height: '1em',
		borderRadius: '2px',
		verticalAlign: 'middle',
		textAlign: 'center',
		margin: 0,
		backgroundColor: '#CED9E0', 
		color: '#293742',
	},
	localRoleSeparator: {
		margin: '1em 0em .25em',
	},
	popoverSectionHeader: {
		fontWeight: 'bold',
		margin: '0.5em 0em',
	},
	emptyState: {
		textAlign: 'center',
		margin: '1em 0em',
		opacity: '0.75',
	},
	roleSearchWrapper: {
		position: 'relative',
	},
	roleSearchInput: { 
		width: '100%', 
		paddingRight: '25px', 
	},
	roleSearchLoader: {
		position: 'absolute',
		right: 0,
		top: '5px'
	},
};
