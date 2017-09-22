import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar/Avatar';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';
import PubCollabDropdownPermissions from 'components/PubCollabDropdownPermissions/PubCollabDropdownPermissions';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';

require('./pubCollabShare.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	onOpenCollaborators: PropTypes.func,
	onCollaboratorAdd: PropTypes.func,
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	isLoading: PropTypes.bool,
};

const defaultProps = {
	onOpenCollaborators: ()=>{},
	onCollaboratorAdd: ()=>{},
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	isLoading: false,
};

class PubCollabShare extends Component {
	constructor(props) {
		super(props);
		this.handleUserSelect = this.handleUserSelect.bind(this);
	}

	handleUserSelect(user) {
		const calculateOrder = 0.75;
		this.props.onCollaboratorAdd({
			userId: user.id,
			name: user.name,
			order: calculateOrder,
			pubId: this.props.pubData.id,
		});
	}

	render() {
		return (
			<div className={'pub-collab-share'}>
				<h5>Share Pub</h5>
				<div className={'intro'}>Use this panel to manage permissions and access to the pub. To edit who is recognized and listed for working on this pub open the <span onClick={this.props.onOpenCollaborators}>Collaborators Panel</span>.</div>
				<PubCollabDropdownPrivacy />
				<PubCollabDropdownPermissions />

				<UserAutocomplete onSelect={this.handleUserSelect} allowCustomUser={true}/>
				<div className={'collaborators-wrapper'}>
					{this.props.pubData.contributors.sort((foo, bar)=> {
						if (foo.Contributor.order < bar.Contributor.order) { return 1; }
						if (foo.Contributor.order > bar.Contributor.order) { return -1; }
						if (foo.id < bar.id) { return 1; }
						if (foo.id > bar.id) { return -1; }
						return 0;
					}).map((item)=> {
						return (
							<PubCollaboratorDetails
								key={`details-${item.id}`}
								pubId={this.props.pubData.id}
								collaboratorData={item}
								onCollaboratorUpdate={this.props.onCollaboratorUpdate}
								onCollaboratorDelete={this.props.onCollaboratorDelete}
							/>
						);
					})}
				</div>

			</div>
		);
	}
}

PubCollabShare.propTypes = propTypes;
PubCollabShare.defaultProps = defaultProps;
export default PubCollabShare;
