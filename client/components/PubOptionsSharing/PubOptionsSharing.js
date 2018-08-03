import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { Checkbox, Spinner } from '@blueprintjs/core';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubOptionsSharingDropdownPrivacy from 'components/PubOptionsSharingDropdownPrivacy/PubOptionsSharingDropdownPrivacy';
import PubOptionsSharingDropdownPermissions from 'components/PubOptionsSharingDropdownPermissions/PubOptionsSharingDropdownPermissions';
import PubOptionsSharingCard from 'components/PubOptionsSharingCard/PubOptionsSharingCard';
import Avatar from 'components/Avatar/Avatar';
import { apiFetch } from 'utilities';

require('./pubOptionsSharing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsSharing extends Component {
	constructor(props) {
		super(props);
		this.state = {
			/* We store pubData in state of this component so we can do immediate */
			/* updates and save in the background without jumpy effects */
			pubData: this.props.pubData,
			isLoading: false,
			activePermissionsVersion: 'draft',
		};
		this.handleAddManager = this.handleAddManager.bind(this);
		this.handleRemoveManager = this.handleRemoveManager.bind(this);
		this.handleVersionUpdate = this.handleVersionUpdate.bind(this);
		this.handlePubUpdate = this.handlePubUpdate.bind(this);
		this.handleVersionPermissionAdd = this.handleVersionPermissionAdd.bind(this);
		this.handleVersionPermissionUpdate = this.handleVersionPermissionUpdate.bind(this);
		this.handleVersionPermissionDelete = this.handleVersionPermissionDelete.bind(this);
	}

	handleAddManager(user) {
		return apiFetch('/api/pubManagers', {
			method: 'POST',
			body: JSON.stringify({
				userId: user.id,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			const newPubData = {
				...this.state.pubData,
				managers: [
					...this.state.pubData.managers,
					result,
				]
			};
			this.setState({ pubData: newPubData });
			this.props.setPubData(newPubData);
		});
	}

	handleRemoveManager(managerId) {
		const newPubData = {
			...this.state.pubData,
			managers: this.state.pubData.managers.filter((manager)=> {
				return manager.id !== managerId;
			})
		};
		this.setState({ pubData: newPubData, isLoading: true });
		return apiFetch('/api/pubManagers', {
			method: 'DELETE',
			body: JSON.stringify({
				pubManagerId: managerId,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData(newPubData);
			this.setState({ isLoading: false });
		});
	}

	handleVersionUpdate(versionUpdates) {
		const newPubData = {
			...this.state.pubData,
			versions: this.state.pubData.versions.map((version)=> {
				if (version.id !== versionUpdates.versionId) { return version; }
				return {
					...version,
					...versionUpdates,
				};
			})
		};
		this.setState({ pubData: newPubData, isLoading: true });
		return apiFetch('/api/versions', {
			method: 'PUT',
			body: JSON.stringify({
				...versionUpdates,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData(newPubData);
			this.setState({ isLoading: false });
		});
	}

	handlePubUpdate(pubUpdates) {
		const newPubData = {
			...this.state.pubData,
			...pubUpdates,
		};
		this.setState({ pubData: newPubData, isLoading: true });
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...pubUpdates,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData(newPubData);
			this.setState({ isLoading: false });
		});
	}

	handleVersionPermissionAdd(newVersionPermission) {
		return apiFetch('/api/versionPermissions', {
			method: 'POST',
			body: JSON.stringify({
				...newVersionPermission,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			const newPubData = {
				...this.state.pubData,
				versionPermissions: [
					...this.state.pubData.versionPermissions,
					result,
				]
			};
			this.setState({ pubData: newPubData });
			this.props.setPubData(newPubData);
		});
	}

	handleVersionPermissionUpdate(versionPermissionUpdates) {
		const newPubData = {
			...this.state.pubData,
			versionPermissions: this.state.pubData.versionPermissions.map((versionPermission)=> {
				if (versionPermission.id !== versionPermissionUpdates.versionPermissionId) { return versionPermission; }
				return {
					...versionPermission,
					...versionPermissionUpdates,
				};
			})
		};
		this.setState({ pubData: newPubData, isLoading: true });
		return apiFetch('/api/versionPermissions', {
			method: 'PUT',
			body: JSON.stringify({
				...versionPermissionUpdates,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.setState({ isLoading: false });
			this.props.setPubData(newPubData);
		});
	}

	handleVersionPermissionDelete(versionPermissionId) {
		const newPubData = {
			...this.state.pubData,
			versionPermissions: this.state.pubData.versionPermissions.filter((versionPermission)=> {
				return versionPermission.id !== versionPermissionId;
			})
		};
		this.setState({ pubData: newPubData, isLoading: true });
		return apiFetch('/api/versionPermissions', {
			method: 'DELETE',
			body: JSON.stringify({
				versionPermissionId: versionPermissionId,
				pubId: this.state.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.setState({ isLoading: false });
			this.props.setPubData(newPubData);
		});
	}

	render() {
		const pubData = this.state.pubData;
		const managers = pubData.managers;
		const managerIds = {};
		managers.forEach((manager)=> {
			managerIds[manager.user.id] = true;
		});
		const defaultPublicVersionId = pubData.versions.sort((foo, bar)=> {
			if (foo.createdAt > bar.createdAt) { return -1; }
			if (foo.createdAt < bar.createdAt) { return 1; }
			return 0;
		}).reduce((prev, curr)=> {
			if (!prev && curr.isPublic) { return curr.id; }
			return prev;
		}, undefined);
		return (
			<div className="pub-options-sharing-component">
				<div>
					{this.state.isLoading &&
						<div className="save-wrapper">
							<Spinner small={true} /> Saving...
						</div>
					}
					<h1>Sharing</h1>
					<h2>Managers</h2>
					<p>Managers can view all versions, edit pub details, and edit the draft.</p>
					<div className="cards-wrapper">
						<PubOptionsSharingCard
							content={[
								<span className="pt-icon-standard pt-icon-people" />,
								<span>Community Admins</span>
							]}
							options={
								<Checkbox
									checked={pubData.isCommunityAdminManaged}
									onChange={(evt)=> {
										this.handlePubUpdate({
											isCommunityAdminManaged: evt.target.checked,
										});
									}}
								>
									Can Manage
								</Checkbox>
							}
						/>
						{managers.sort((foo, bar)=> {
							if (foo.createdAt < bar.createdAt) { return -1; }
							if (foo.createdAt > bar.createdAt) { return 1; }
							return 0;
						}).map((manager)=> {
							return (
								<PubOptionsSharingCard
									key={`card-${manager.id}`}
									content={[
										<Avatar width={25} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />,
										<span>{manager.user.fullName}</span>
									]}
									options={managers.length > 1
										? <button
											className="pt-button pt-minimal pt-small pt-icon-small-cross"
											type="button"
											onClick={()=> {
												this.handleRemoveManager(manager.id);
											}}
										/>
										: null
									}
								/>
							);
						})}
						<PubOptionsSharingCard
							content={
								<UserAutocomplete
									onSelect={this.handleAddManager}
									allowCustomUser={false} // Eventually use this for emails
									placeholder="Add manager..."
									usedUserIds={managers.map((item)=> {
										return item.user.id;
									})}
								/>
							}
							isAddCard={true}
						/>
					</div>

					<h2>Version Permissions</h2>
					<div
						className={`version-block ${this.state.activePermissionsVersion === 'draft' ? 'active' : ''}`}
						onClick={()=> { this.setState({ activePermissionsVersion: 'draft' }); }}
						role="button"
						tabIndex="-1"
					>
						<div className="header">
							<div className="title"><b>Working Draft</b></div>
							<div className="privacy">
								{this.state.activePermissionsVersion === 'draft' &&
									<PubOptionsSharingDropdownPrivacy
										value={pubData.draftPermissions}
										isDraft={true}
										onChange={(newValue)=> {
											this.handlePubUpdate({ draftPermissions: newValue });
										}}
									/>
								}
								{this.state.activePermissionsVersion !== 'draft' &&
									<span>
										{pubData.draftPermissions === 'private' &&
											<span className="pt-icon-standard pt-icon-lock2" />
										}
										<span>{pubData.draftPermissions.replace('public', 'Public ').replace('private', 'Private')}</span>
									</span>
								}
							</div>
						</div>
						{this.state.activePermissionsVersion !== 'draft' && pubData.draftPermissions !== 'publicEdit' &&
							<div className="access-preview">
								{(pubData.isCommunityAdminManaged || pubData.communityAdminDraftPermissions !== 'none') &&
									<span className="pt-icon-standard pt-icon-people" />
								}
								{pubData.managers.concat(pubData.versionPermissions.filter((versionPermission)=> {
									return !managerIds[versionPermission.user.id];
								}).filter((versionPermission)=> {
									return !versionPermission.versionId;
								})).map((item)=> {
									return <Avatar width={20} userInitials={item.user.initials} userAvatar={item.user.avatar} />;
								})}
							</div>
						}
						{this.state.activePermissionsVersion === 'draft' &&
							<div>
								<div>Permissions</div>
								<div className="cards-wrapper">
									<PubOptionsSharingCard
										content={[
											<span>Managers</span>,
											<span className="managers-preview">
												{pubData.isCommunityAdminManaged &&
													<span className="pt-icon-standard pt-icon-people" />
												}
												{managers.slice(0, 2).map((manager)=> {
													return <Avatar width={20} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />;
												})}
												{managers.length - 2 > 0 &&
													<Avatar width={20} userInitials={`+${managers.length - 2}`} />
												}
											</span>
										]}
										options={
											<span>Can Edit</span>
										}
										isFlatCard={true}
									/>

									{/* If community admins are not managers, show options for their draft permissions */}
									{!pubData.isCommunityAdminManaged &&
										<PubOptionsSharingCard
											content={[
												<span className="pt-icon-standard pt-icon-people" />,
												<span>Community Admins</span>
											]}
											options={
												<PubOptionsSharingDropdownPermissions
													value={pubData.communityAdminDraftPermissions}
													onChange={(newValue)=> {
														this.handlePubUpdate({
															communityAdminDraftPermissions: newValue,
														});
													}}
												/>
											}
										/>
									}

									{/* List all version permissions, filtering out managers */}
									{pubData.versionPermissions.filter((versionPermission)=> {
										return !managerIds[versionPermission.user.id];
									}).filter((versionPermission)=> {
										return !versionPermission.versionId;
									}).sort((foo, bar)=> {
										if (foo.createdAt < bar.createdAt) { return -1; }
										if (foo.createdAt > bar.createdAt) { return 1; }
										return 0;
									}).map((versionPermission)=> {
										return (
											<PubOptionsSharingCard
												key={versionPermission.id}
												content={[
													<Avatar width={25} userInitials={versionPermission.user.initials} userAvatar={versionPermission.user.avatar} />,
													<span>{versionPermission.user.fullName}</span>
												]}
												options={[
													<PubOptionsSharingDropdownPermissions
														value={versionPermission.permissions}
														hideNone={true}
														onChange={(newValue)=> {
															this.handleVersionPermissionUpdate({
																versionPermissionId: versionPermission.id,
																permissions: newValue,
															});
														}}
													/>,
													<button
														className="pt-button pt-minimal pt-small"
														type="button"
														onClick={()=> {
															this.handleVersionPermissionDelete(versionPermission.id);
														}}
													>
														<span className="pt-icon-standard pt-icon-small-cross" />
													</button>
												]}
											/>
										);
									})}
									<PubOptionsSharingCard
										content={
											<UserAutocomplete
												onSelect={(user)=> {
													return this.handleVersionPermissionAdd({
														userId: user.id,
														versionId: null,
													});
												}}
												allowCustomUser={false} // Eventually use this for emails
												placeholder="Add user..."
												usedUserIds={pubData.versionPermissions.filter((versionPermission)=> {
													return !versionPermission.versionId;
												}).map((item)=> {
													return item.user.id;
												}).concat(pubData.managers.map((item)=> {
													return item.user.id;
												}))}
											/>
										}
										isAddCard={true}
									/>
								</div>

								<div>Sharing Links</div>
								<div><a href={`${window.location.origin}/pub/${pubData.slug}/draft?access=${pubData.draftViewHash}`}>Anyone with this link can view (Click to copy)</a></div>
								<div><a href={`${window.location.origin}/pub/${pubData.slug}/draft?access=${pubData.draftEditHash}`}>Anyone with this link can edit (Click to copy)</a></div>
							</div>
						}
					</div>
					{pubData.versions.sort((foo, bar)=> {
						if (foo.createdAt < bar.createdAt) { return 1; }
						if (foo.createdAt > bar.createdAt) { return -1; }
						return 0;
					}).map((version)=> {
						const isActive = this.state.activePermissionsVersion === version.id;
						return (
							<div
								className={`version-block ${isActive ? 'active' : ''}`}
								onClick={()=> { this.setState({ activePermissionsVersion: version.id }); }}
								role="button"
								tabIndex="-1"
							>
								<div className="header">
									<div className="title">
										<b>{dateFormat(version.createdAt, 'mmm dd, yyyy · h:MMTT')}</b>
										<span>{version.description}</span>
									</div>
									<div className="privacy">
										{isActive &&
											<PubOptionsSharingDropdownPrivacy
												value={version.isPublic ? 'publicView' : 'private'}
												isDraft={false}
												onChange={(newValue)=> {
													this.handleVersionUpdate({
														versionId: version.id,
														isPublic: newValue === 'public'
													});
												}}
											/>
										}
										{!isActive &&
											<span>
												{version.id === defaultPublicVersionId &&
													<span>(Default Public Version) </span>
												}
												{!version.isPublic &&
													<span className="pt-icon-standard pt-icon-lock2" />
												}
												<span>{version.isPublic ? 'Public' : 'Private'}</span>
											</span>
										}
									</div>
								</div>
								{!isActive && !version.isPublic &&
									<div className="access-preview">
										{(pubData.isCommunityAdminManaged || version.isCommunityAdminShared) &&
											<span className="pt-icon-standard pt-icon-people" />
										}
										{pubData.managers.concat(pubData.versionPermissions.filter((versionPermission)=> {
											return !managerIds[versionPermission.user.id];
										}).filter((versionPermission)=> {
											return versionPermission.versionId === version.id;
										})).map((item)=> {
											return <Avatar width={20} userInitials={item.user.initials} userAvatar={item.user.avatar} />;
										})}
									</div>
								}
								{isActive &&
									<div>
										<div>Permissions</div>
										<div className="cards-wrapper">
											<PubOptionsSharingCard
												content={[
													<span>Managers</span>,
													<span className="managers-preview">
														{version.isCommunityAdminShared &&
															<span className="pt-icon-standard pt-icon-people" />
														}
														<span className="pt-icon-standard pt-icon-people" />
														{managers.slice(0, 2).map((manager)=> {
															return <Avatar width={20} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />;
														})}
														{managers.length - 2 > 0 &&
															<Avatar width={20} userInitials={`+${managers.length - 2}`} />
														}
													</span>
												]}
												options={
													<span>Can View</span>
												}
												isFlatCard={true}
											/>

											{/* If community admins are not managers, show options for their version permissions */}
											{!pubData.isCommunityAdminManaged &&
												<PubOptionsSharingCard
													content={[
														<span className="pt-icon-standard pt-icon-people" />,
														<span>Community Admins</span>
													]}
													options={
														<Checkbox
															checked={version.isCommunityAdminShared}
															onChange={(evt)=> {
																this.handleVersionUpdate({
																	versionId: version.id,
																	isCommunityAdminShared: evt.target.checked,
																});
															}}
														>
															Can View
														</Checkbox>
													}
												/>
											}
											{pubData.versionPermissions.filter((versionPermission)=> {
												return !managerIds[versionPermission.user.id];
											}).filter((versionPermission)=> {
												return versionPermission.versionId === version.id;
											}).sort((foo, bar)=> {
												if (foo.createdAt < bar.createdAt) { return -1; }
												if (foo.createdAt > bar.createdAt) { return 1; }
												return 0;
											}).map((versionPermission)=> {
												return (
													<PubOptionsSharingCard
														key={versionPermission.id}
														content={[
															<Avatar width={25} userInitials={versionPermission.user.initials} userAvatar={versionPermission.user.avatar} />,
															<span>{versionPermission.user.fullName}</span>,
														]}
														options={
															<button
																className="pt-button pt-minimal pt-small"
																type="button"
																onClick={()=> {
																	this.handleVersionPermissionDelete(versionPermission.id);
																}}
															>
																<span className="pt-icon-standard pt-icon-small-cross" />
															</button>
														}
													/>
												);
											})}
											<PubOptionsSharingCard
												content={
													<UserAutocomplete
														onSelect={(user)=> {
															return this.handleVersionPermissionAdd({
																userId: user.id,
																versionId: version.id,
															});
														}}
														allowCustomUser={false} // Eventually use this for emails
														placeholder="Add user..."
														usedUserIds={pubData.versionPermissions.filter((versionPermission)=> {
															return !versionPermission.versionId;
														}).map((item)=> {
															return item.user.id;
														}).concat(pubData.managers.map((item)=> {
															return item.user.id;
														}))}
													/>
												}
												isAddCard={true}
											/>
										</div>

										<div>Sharing Links</div>
										<a href={`${window.location.origin}/pub/${pubData.slug}?version=${version.id}&access=${version.viewHash}`}>Anyone with this link can view (Click to copy)</a>
									</div>
								}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

PubOptionsSharing.propTypes = propTypes;
export default PubOptionsSharing;
