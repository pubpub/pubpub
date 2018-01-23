import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';

require('./pubAdminPermissions.scss');

const propTypes = {
	communityData: PropTypes.object,
	pubData: PropTypes.object,
	onSave: PropTypes.func,
	hideNone: PropTypes.bool,
};

const defaultProps = {
	communityData: {},
	pubData: {},
	onSave: ()=>{},
	hideNone: false,
};

class PubAdminPermissions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			permissions: props.pubData.adminPermissions,
		};
		this.handlePermissionsChange = this.handlePermissionsChange.bind(this);
	}

	handlePermissionsChange(permissionsValue) {
		this.setState({ permissions: permissionsValue });
		this.props.onSave({
			adminPermissions: permissionsValue,
		});
	}

	render() {
		return (
			<div className="pub-admin-permissions-component">
				<div className="dropdown">
					<PubCollabDropdownPermissions
						value={this.state.permissions}
						onChange={this.handlePermissionsChange}
						hideNone={this.props.hideNone}
						leftAligned={true}
					/>
				</div>
				<div className="details">Permissions for the {this.props.communityData.title} team.</div>
			</div>
		);
	}
}

PubAdminPermissions.propTypes = propTypes;
PubAdminPermissions.defaultProps = defaultProps;
export default PubAdminPermissions;
