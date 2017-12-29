import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@blueprintjs/core';
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
			name: props.collaboratorData.name,
			isAuthor: props.collaboratorData.Collaborator.isAuthor,
			permissions: props.collaboratorData.Collaborator.permissions,
		};
		this.handleChecked = this.handleChecked.bind(this);
		this.handleRemoveClick = this.handleRemoveClick.bind(this);
		this.handlePermissionsChange = this.handlePermissionsChange.bind(this);
	}

	handleChecked(evt) {
		this.setState({ isAuthor: evt.target.checked });
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Collaborator.id,
			pubId: this.props.pubId,
			isAuthor: evt.target.checked,
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
			<div className="pub-collaborator-details-component">
				<div className="avatar-wrapper">
					{data.slug
						? <a href={`/user/${data.slug}`}>
							{avatar}
						</a>
						: avatar
					}
				</div>

				<div className="content">
					<div className="name">
						{data.slug
							? <a href={`/user/${data.slug}`}>
								{name}
							</a>
							: name
						} {this.props.canManage && this.props.handle}
					</div>
					{this.props.canManage &&
						<Checkbox
							checked={this.state.isAuthor}
							onChange={this.handleChecked}
						>
							List as Author
						</Checkbox>
					}
					{!this.props.canManage && this.state.isAuthor &&
						<div className="pt-tag pt-minimal pt-intent-primary">Author</div>
					}

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
