import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Tooltip } from '@blueprintjs/core';
import { MultiSelect } from '@blueprintjs/labs';
import fuzzysearch from 'fuzzysearch';
import Avatar from 'components/Avatar/Avatar';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';

require('./pubCollaboratorDetails.scss');

const propTypes = {
	collaboratorData: PropTypes.object.isRequired,
	pubId: PropTypes.string,
	canManage: PropTypes.bool,
	lastAdmin: PropTypes.bool,
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	handle: PropTypes.node,
	// isPermissionsMode: PropTypes.bool,
};

const defaultProps = {
	pubId: '00-00',
	canManage: false,
	lastAdmin: false,
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	handle: undefined,
	// isPermissionsMode: false,
};

class PubCollaboratorDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// name: props.collaboratorData.name,
			isAuthor: props.collaboratorData.Collaborator.isAuthor,
			isContributor: props.collaboratorData.Collaborator.isContributor,
			permissions: props.collaboratorData.Collaborator.permissions,
			roles: props.collaboratorData.Collaborator.roles || [],
			roleQueryValue: '',
		};
		this.getFilteredItems = this.getFilteredItems.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleAddRole = this.handleAddRole.bind(this);
		this.handleRemoveRole = this.handleRemoveRole.bind(this);
		this.handleCheckedAuthor = this.handleCheckedAuthor.bind(this);
		this.handleCheckedContributor = this.handleCheckedContributor.bind(this);
		this.handleRemoveClick = this.handleRemoveClick.bind(this);
		this.handlePermissionsChange = this.handlePermissionsChange.bind(this);
	}

	getFilteredItems(query) {
		const defaultRoles = ['Conceptualization', 'Methodology', 'Software', 'Validation', 'Formal Analysis', 'Investigation', 'Resources', 'Data Curation', 'Writing – Original Draft Preparation', 'Writing – Review & Editing', 'Visualization', 'Supervision', 'Project Administration', 'Peer Review', 'Funding Acquisition', 'Illustrator'];
		const addNewRoleOption = defaultRoles.reduce((prev, curr)=> {
			if (curr.toLowerCase() === query.toLowerCase()) { return false; }
			return prev;
		}, true);
		const newRoleOption = query && addNewRoleOption ? [query] : [];
		const allRoles = [...newRoleOption, ...defaultRoles];
		return allRoles.filter((item)=> {
			const fuzzyMatchRole = fuzzysearch(query.toLowerCase(), item.toLowerCase());
			const alreadyUsed = this.state.roles.indexOf(item) > -1;
			return !alreadyUsed && fuzzyMatchRole;
		}).sort((foo, bar)=> {
			if (foo.toLowerCase() < bar.toLowerCase()) { return -1; }
			if (foo.toLowerCase() > bar.toLowerCase()) { return 1; }
			return 0;
		});
	}
	handleInputChange(evt) {
		const query = evt.target.value;
		return this.setState({ roleQueryValue: query });
	}

	handleAddRole(newRole) {
		const newRoles = [...this.state.roles, newRole];
		this.setState({
			roles: newRoles,
			roleQueryValue: '',
		});
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
			roles: newRoles,
		});
	}
	handleRemoveRole(evt, index) {
		const newRoles = this.state.roles.filter((item, filterIndex)=> {
			return filterIndex !== index;
		});
		this.setState({
			roles: newRoles
		});
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
			roles: newRoles,
		});
	}

	handleCheckedAuthor(evt) {
		this.setState({ isAuthor: evt.target.checked });
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
			isAuthor: evt.target.checked,
		});
	}
	handleCheckedContributor(evt) {
		this.setState({ isContributor: evt.target.checked });
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
			isContributor: evt.target.checked,
		});
	}

	handleRemoveClick() {
		this.props.onCollaboratorDelete({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
		});
	}

	handlePermissionsChange(permissionsValue) {
		this.setState({ permissions: permissionsValue });
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
			permissions: permissionsValue,
		});
	}

	render() {
		const data = this.props.collaboratorData;
		if (!data) { return null; }

		const avatar = <Avatar width={50} userInitials={data.initials} userAvatar={data.avatar} />;
		const name = <span className="name">{data.Collaborator.name || data.fullName}</span>;
		return (
			<div className={`pub-collaborator-details-component ${!this.props.canManage ? 'static' : ''}`}>
				<div className="avatar-wrapper">
					{data.slug
						? <a href={`/user/${data.slug}`}>{avatar}</a>
						: avatar
					}
				</div>

				<div className="content">
					<div className="name">
						{!this.props.canManage && this.state.isAuthor &&
							<div className="pt-tag">Author</div>
						}
						{!this.props.canManage && this.state.isContributor &&
							<div className="pt-tag">Contributor</div>
						}
						{data.slug
							? <a href={`/user/${data.slug}`}>{name}</a>
							: name
						} {this.props.canManage && this.props.handle}
					</div>
					{!this.props.canManage && data.title &&
						<div className="title">{data.title}</div>
					}
					{this.props.canManage &&
						<Checkbox
							checked={this.state.isAuthor}
							onChange={this.handleCheckedAuthor}
						>
							List as Author
						</Checkbox>
					}
					{this.props.canManage &&
						<Checkbox
							checked={this.state.isContributor}
							onChange={this.handleCheckedContributor}
							disabled={this.state.isAuthor}
						>
							List as Contributor
						</Checkbox>
					}
					<div className="role-wrapper">
						{this.props.canManage &&
							<Tooltip
								content="Must be listed as Author or Contributor to add roles."
								tooltipClassName="pt-dark"
								isDisabled={this.state.isAuthor || this.state.isContributor}
							>
								<MultiSelect
									items={this.getFilteredItems(this.state.roleQueryValue)}
									itemRenderer={({ item, handleClick, isActive })=> {
										return (
											<li key={item}>
												<a role="button" tabIndex={-1} onClick={handleClick} className={isActive ? 'pt-menu-item pt-active' : 'pt-menu-item'}>
													{item}
												</a>
											</li>
										);
									}}
									selectedItems={this.state.roles}
									tagRenderer={(item)=> {
										return (
											<span>
												{item}
											</span>
										);
									}}
									tagInputProps={{
										// className: 'pt-large',
										onRemove: this.handleRemoveRole,
										placeholder: 'Add roles...',
										tagProps: {
											className: 'pt-minimal pt-intent-primary'
										},
										inputProps: {
											onChange: this.handleInputChange,
											placeholder: 'Add roles...',
										},
										disabled: !this.state.isAuthor && !this.state.isContributor,
									}}
									// itemListPredicate={this.handleInputChange}
									resetOnSelect={true}
									onItemSelect={this.handleAddRole}
									noResults={<div className="pt-menu-item">No Matching Roles</div>}
									popoverProps={{ popoverClassName: 'pt-minimal' }}
								/>
							</Tooltip>
						}
						{!this.props.canManage &&
							this.state.roles.map((role)=> {
								return <div key={`${this.props.collaboratorData.id}-${role}`} className="pt-tag pt-minimal pt-intent-primary">{role}</div>
							})
						}
					</div>

				</div>
				{this.props.canManage &&
					<div className="remove-wrapper">
						{!this.props.lastAdmin &&
							<button className="pt-button pt-minimal" onClick={this.handleRemoveClick}>Remove</button>
						}
						{data.slug &&
							<PubCollabDropdownPermissions
								value={this.state.permissions}
								onChange={this.handlePermissionsChange}
								isDisabled={this.props.lastAdmin}
							/>
						}
					</div>
				}
			</div>
		);
	}
}

PubCollaboratorDetails.propTypes = propTypes;
PubCollaboratorDetails.defaultProps = defaultProps;
export default PubCollaboratorDetails;
