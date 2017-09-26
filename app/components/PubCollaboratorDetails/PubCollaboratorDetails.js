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
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	isPermissionsMode: PropTypes.bool,
};

const defaultProps = {
	pubId: '00-00',
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	isPermissionsMode: false,
};

class PubCollaboratorDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.collaboratorData.name,
			isAuthor: props.collaboratorData.Contributor.isAuthor,
		};
		this.handleChecked = this.handleChecked.bind(this);
		this.handleRemoveClick = this.handleRemoveClick.bind(this);
		this.handlePermissionsChange = this.handlePermissionsChange.bind(this);
	}

	handleChecked(evt) {
		this.setState({ isAuthor: evt.target.checked });
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Contributor.id,
			pubId: this.props.pubId,
			isAuthor: evt.target.checked,
		});
	}

	handleRemoveClick() {
		this.props.onCollaboratorDelete({
			collaboratorId: this.props.collaboratorData.Contributor.id,
			pubId: this.props.pubId,
		});
	}

	handlePermissionsChange(permissionsValue) {
		this.props.onCollaboratorUpdate({
			collaboratorId: this.props.collaboratorData.Contributor.id,
			pubId: this.props.pubId,
			permissions: permissionsValue,
		});
	}

	render() {
		const data = this.props.collaboratorData;
		if (!data) { return null; }

		const avatar = <Avatar width={50} userInitials={data.initials} userAvatar={data.avatar} />;
		const name = <div className={'name'}>{data.Contributor.name || data.fullName}</div>;
		return (
			<div className={'pub-collaborator-details'}>
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
					{!this.props.isPermissionsMode &&
						<Checkbox
							checked={this.state.isAuthor}
							onChange={this.handleChecked}
						>
							List as Author
						</Checkbox>
					}
					{this.props.isPermissionsMode &&
						<PubCollabDropdownPermissions
							value={data.Contributor.permissions}
							onChange={this.handlePermissionsChange}
						/>
					}

				</div>
				<div className={'remove-wrapper'}>
					<button className={'pt-button pt-minimal'} role={'button'} onClick={this.handleRemoveClick}>Remove</button>
				</div>
			</div>
		);
	}
}

PubCollaboratorDetails.propTypes = propTypes;
PubCollaboratorDetails.defaultProps = defaultProps;
export default PubCollaboratorDetails;
