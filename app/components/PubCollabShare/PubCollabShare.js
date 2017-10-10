import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubAdminPermissions from 'components/PubAdminPermissions/PubAdminPermissions';
import PubCollaboratorDetails from 'components/PubCollaboratorDetails/PubCollaboratorDetails';
import PubCollabDropdownPrivacy from 'components/PubCollabDropdownPrivacy/PubCollabDropdownPrivacy';

require('./pubCollabShare.scss');

const propTypes = {
	appData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	canAdmin: PropTypes.bool,
	onOpenCollaborators: PropTypes.func,
	onCollaboratorAdd: PropTypes.func,
	onCollaboratorUpdate: PropTypes.func,
	onCollaboratorDelete: PropTypes.func,
	onPutPub: PropTypes.func,
	// isLoading: PropTypes.bool,
};

const defaultProps = {
	canAdmin: false,
	onOpenCollaborators: ()=>{},
	onCollaboratorAdd: ()=>{},
	onCollaboratorUpdate: ()=>{},
	onCollaboratorDelete: ()=>{},
	onPutPub: ()=>{},
	// isLoading: false,
};

class PubCollabShare extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collaborationMode: this.props.pubData.collaborationMode,
			adminPermissions: this.props.pubData.adminPermissions,
		};
		this.handleUserSelect = this.handleUserSelect.bind(this);
		this.handleCollaborationModeChange = this.handleCollaborationModeChange.bind(this);
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
	handleCollaborationModeChange(value) {
		this.setState({ collaborationMode: value });
		this.props.onPutPub({
			collaborationMode: value,
		});
	}

	render() {
		const pubData = this.props.pubData;
		const numPubAdmins = this.props.pubData.contributors.reduce((prev, curr)=> {
			if (curr.Contributor.permissions === 'admin') { return prev + 1;}
			return prev;
		}, 0);
		return (
			<div className={'pub-collab-share'}>
				<h5>Share Pub</h5>
				<div className={'intro'}>Use this panel to manage permissions and access to the pub. To edit who is recognized and listed for working on this pub open the <span tabIndex={-1} role={'button'} onClick={this.props.onOpenCollaborators}>Collaborators Panel</span>.</div>

				<div className={'wrapper'}>
					<div className={'share-link'}>
						<div className={'input-name'}>
							Anyone with this link <b>Can Edit</b>
						</div>
						<input className={'pt-input'} type={'text'} value={`https://www.pubpub.org/pub/${pubData.slug}/collaborate/${pubData.editHash}`} onChange={()=>{}} />
					</div>
					<div className={'share-link'}>
						<div className={'input-name'}>
							Anyone with this link <b>Can Suggest</b>
						</div>
						<input className={'pt-input'} type={'text'} value={`https://www.pubpub.org/pub/${pubData.slug}/collaborate/${pubData.suggestHash}`} onChange={()=>{}} />
					</div>
				</div>

				<div className={'wrapper'}>
					<PubCollabDropdownPrivacy
						value={this.state.collaborationMode}
						onChange={this.handleCollaborationModeChange}
					/>
				</div>

				<div>
					<h6>Add Collaborators</h6>
					<UserAutocomplete onSelect={this.handleUserSelect} allowCustomUser={true} />

					<div className={'collaborators-wrapper'}>
						<PubAdminPermissions
							appData={this.props.appData}
							onSave={this.props.onPutPub}
							pubData={pubData}
						/>
						{this.props.pubData.contributors.filter((item)=> {
							return item.slug;
						}).sort((foo, bar)=> {
							if (foo.Contributor.order < bar.Contributor.order) { return 1; }
							if (foo.Contributor.order > bar.Contributor.order) { return -1; }
							if (foo.Contributor.createdAt < bar.Contributor.createdAt) { return 1; }
							if (foo.Contributor.createdAt > bar.Contributor.createdAt) { return -1; }
							return 0;
						}).map((item)=> {
							return (
								<PubCollaboratorDetails
									key={`details-${item.id}`}
									pubId={this.props.pubData.id}
									canAdmin={this.props.canAdmin}
									lastAdmin={item.Contributor.permissions === 'admin' && numPubAdmins === 1}
									collaboratorData={item}
									onCollaboratorUpdate={this.props.onCollaboratorUpdate}
									onCollaboratorDelete={this.props.onCollaboratorDelete}
									isPermissionsMode={true}
								/>
							);
						})}
					</div>
				</div>

			</div>
		);
	}
}

PubCollabShare.propTypes = propTypes;
PubCollabShare.defaultProps = defaultProps;
export default PubCollabShare;
