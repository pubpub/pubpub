import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';

require('./pubCollaboratorDetails.scss');

const propTypes = {
	collaboratorData: PropTypes.object.isRequired,
	pubId: PropTypes.string,
	canAdmin: PropTypes.bool,
	lastAdmin: PropTypes.bool,
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	isPermissionsMode: PropTypes.bool,
};

const defaultProps = {
	pubId: '00-00',
	canAdmin: false,
	lastAdmin: false,
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	isPermissionsMode: false,
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
		const name = <span className={'name'}>{data.Collaborator.name || data.fullName}</span>;
		return (
			<div className={`pub-collaborator-details ${this.props.isPermissionsMode ? 'permission-mode' : ''}`}>
				<div className={'avatar-wrapper'}>
					{data.slug
						? <Link to={`/user/${data.slug}`}>
							{avatar}
						</Link>
						: avatar
					}
				</div>

				<div className={'content'}>
					<div className={'name'}>
						{data.slug
							? <Link to={`/user/${data.slug}`}>
								{name}
							</Link>
							: name
						}
					</div>
					{!this.props.isPermissionsMode && this.props.canAdmin &&
						<Checkbox
							checked={this.state.isAuthor}
							onChange={this.handleChecked}
						>
							List as Author
						</Checkbox>
					}

				</div>
				{this.props.canAdmin &&
					<div className={'remove-wrapper'}>
						{!this.props.lastAdmin &&
							<button className={'pt-button pt-minimal'} onClick={this.handleRemoveClick}>Remove</button>
						}
						{this.props.isPermissionsMode &&
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
