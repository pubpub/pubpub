import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dateFormat from 'dateformat';
import { Checkbox } from '@blueprintjs/core';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import PubOptionsSharingDropdownPrivacy from 'components/PubOptionsSharingDropdownPrivacy/PubOptionsSharingDropdownPrivacy';
import PubOptionsSharingDropdownPermissions from 'components/PubOptionsSharingDropdownPermissions/PubOptionsSharingDropdownPermissions';
import Avatar from 'components/Avatar/Avatar';
import { apiFetch } from 'utilities';

require('./pubOptionsSharing.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
	canManage: PropTypes.bool.isRequired,
};

class PubOptionsSharing extends Component {
	constructor(props) {
		super(props);
		this.state = {
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
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				managers: [
					...this.props.pubData.managers,
					result,
				]
			});
		});
	}

	handleRemoveManager(managerId) {
		return apiFetch('/api/pubManagers', {
			method: 'DELETE',
			body: JSON.stringify({
				pubManagerId: managerId,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				managers: this.props.pubData.managers.filter((manager)=> {
					return manager.id !== managerId;
				})
			});
		});
	}

	handleVersionUpdate(versionUpdates) {
		return apiFetch('/api/versions', {
			method: 'PUT',
			body: JSON.stringify({
				...versionUpdates,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				versions: this.props.pubData.versions.map((version)=> {
					if (version.id !== versionUpdates.versionId) { return version; }
					return {
						...version,
						...versionUpdates,
					};
				})
			});
		});
	}

	handlePubUpdate(pubUpdates) {
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				...pubUpdates,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				...pubUpdates,
			});
		});
	}

	handleVersionPermissionAdd(newVersionPermission) {
		return apiFetch('/api/versionPermissions', {
			method: 'POST',
			body: JSON.stringify({
				...newVersionPermission,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((result)=> {
			this.props.setPubData({
				...this.props.pubData,
				versionPermissions: [
					...this.props.pubData.versionPermissions,
					result,
				]
			});
		});
	}

	handleVersionPermissionUpdate(versionPermissionUpdates) {
		return apiFetch('/api/versionPermissions', {
			method: 'PUT',
			body: JSON.stringify({
				...versionPermissionUpdates,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				versionPermissions: this.props.pubData.versionPermissions.map((versionPermission)=> {
					if (versionPermission.id !== versionPermissionUpdates.versionPermissionId) { return versionPermission; }
					return {
						...versionPermission,
						...versionPermissionUpdates,
					};
				})
			});
		});
	}

	handleVersionPermissionDelete(versionPermissionId) {
		return apiFetch('/api/versionPermissions', {
			method: 'DELETE',
			body: JSON.stringify({
				versionPermissionId: versionPermissionId,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then(()=> {
			this.props.setPubData({
				...this.props.pubData,
				versionPermissions: this.props.pubData.versionPermissions.filter((versionPermission)=> {
					return versionPermission.id !== versionPermissionId;
				})
			});
		});
	}

	render() {
		const pubData = this.props.pubData;
		const managers = pubData.managers;
		const managerIds = {};
		managers.forEach((manager)=> {
			managerIds[manager.user.id] = true;
		});
		return (
			<div className="pub-options-sharing-component">
				<div>
					<h1>Sharing</h1>
					<div className="pt-callout">
						<h5>UI Questions</h5>
						<p>Should the people cards be fixed-width, or adjustable width (as they are now)?</p>
						<p>When a version is public, should we show the preview of faces (as we do now) when it is collapsed under Version Permissions?</p>
						<p>When a version is public, should we disable the manipulation of specific permissions when chosen version is expanded (perhaps reduced opacity, so you can see something is there, but not change it)?</p>

					</div>
					<h2>Managers</h2>
					<p>Managers can view all versions, edit pub details, and edit the draft.</p>
					<div className="cards-wrapper">
						<div className="card pt-elevation-1">
							<div className="name">
								<span className="pt-icon-standard pt-icon-people" />
								Community Admins
							</div>
							<div className="options">
								<Checkbox
									checked={this.props.pubData.isCommunityAdminManaged}
									onChange={(evt)=> {
										this.handlePubUpdate({
											isCommunityAdminManaged: evt.target.checked,
										});
									}}
								>
									Can Manage
								</Checkbox>
							</div>
						</div>
						{managers.sort((foo, bar)=> {
							if (foo.createdAt < bar.createdAt) { return -1; }
							if (foo.createdAt > bar.createdAt) { return 1; }
							return 0;
						}).map((manager)=> {
							return (
								<div className="card pt-elevation-1">
									<div className="name">
										<Avatar width={25} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />
										{manager.user.fullName}
									</div>
									{managers.length > 1 &&
										<div className="options">
											<button
												className="pt-button pt-minimal pt-small"
												type="button"
												onClick={()=> {
													this.handleRemoveManager(manager.id);
												}}
											>
												<span className="pt-icon-standard pt-icon-small-cross" />
											</button>
										</div>
									}
								</div>
							);
						})}
						<div className="card pt-elevation-1 add">
							<UserAutocomplete
								onSelect={this.handleAddManager}
								allowCustomUser={false} // Eventually use this for emails
								placeholder="Add manager..."
								usedUserIds={managers.map((item)=> {
									return item.user.id;
								})}
							/>
						</div>
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
										value={this.props.pubData.draftPermissions}
										isDraft={true}
										onChange={(newValue)=> {
											this.handlePubUpdate({ draftPermissions: newValue });
										}}
									/>
								}
								{this.state.activePermissionsVersion !== 'draft' &&
									<span>
										{this.props.pubData.draftPermissions === 'private' &&
											<span className="pt-icon-standard pt-icon-lock2" />
										}
										<span>{this.props.pubData.draftPermissions.replace('public', 'Public ').replace('private', 'Private')}</span>
									</span>
								}
							</div>
						</div>
						{this.state.activePermissionsVersion !== 'draft' &&
							<div className="access-preview">
								{(this.props.pubData.isCommunityAdminManaged || this.props.pubData.communityAdminDraftPermissions !== 'none') &&
									<span className="pt-icon-standard pt-icon-people" />
								}
								{this.props.pubData.managers.concat(this.props.pubData.versionPermissions.filter((versionPermission)=> {
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
									<div className="card pt-elevation-0 flat">
										<div className="name">
											Managers
											<span className="managers-preview">
												<span className="pt-icon-standard pt-icon-people" />
												{managers.slice(0, 2).map((manager)=> {
													return <Avatar width={20} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />;
												})}
												{managers.length - 2 > 0 &&
													<Avatar width={20} userInitials={`+${managers.length - 2}`} />
												}
											</span>
										</div>
										<div className="options">
											Can Edit
										</div>
									</div>

									{/* If community admins are not managers, show options for their draft permissions */}
									{!this.props.pubData.isCommunityAdminManaged &&
										<div className="card pt-elevation-1">
											<div className="name">
												<span className="pt-icon-standard pt-icon-people" />
												Community Admins
											</div>
											<div className="options">
												<PubOptionsSharingDropdownPermissions
													value={this.props.pubData.communityAdminDraftPermissions}
													onChange={(newValue)=> {
														this.handlePubUpdate({
															communityAdminDraftPermissions: newValue,
														});
													}}
												/>
											</div>
										</div>
									}

									{/* List all version permissions, filtering out managers */}
									{this.props.pubData.versionPermissions.filter((versionPermission)=> {
										return !managerIds[versionPermission.user.id];
									}).filter((versionPermission)=> {
										return !versionPermission.versionId;
									}).sort((foo, bar)=> {
										if (foo.createdAt < bar.createdAt) { return -1; }
										if (foo.createdAt > bar.createdAt) { return 1; }
										return 0;
									}).map((versionPermission)=> {
										return (
											<div className="card pt-elevation-1">
												<div className="name">
													<Avatar width={25} userInitials={versionPermission.user.initials} userAvatar={versionPermission.user.avatar} />
													{versionPermission.user.fullName}
												</div>
												<div className="options">
													<PubOptionsSharingDropdownPermissions
														value={versionPermission.permissions}
														hideNone={true}
														onChange={(newValue)=> {
															this.handleVersionPermissionUpdate({
																versionPermissionId: versionPermission.id,
																permissions: newValue,
															});
														}}
													/>
													<button
														className="pt-button pt-minimal pt-small"
														type="button"
														onClick={()=> {
															this.handleVersionPermissionDelete(versionPermission.id);
														}}
													>
														<span className="pt-icon-standard pt-icon-small-cross" />
													</button>
												</div>
											</div>
										);
									})}
									<div className="card pt-elevation-1 add">
										<UserAutocomplete
											onSelect={(user)=> {
												return this.handleVersionPermissionAdd({
													userId: user.id,
													versionId: null,
												});
											}}
											allowCustomUser={false} // Eventually use this for emails
											placeholder="Add user..."
											usedUserIds={this.props.pubData.versionPermissions.filter((versionPermission)=> {
												return !versionPermission.versionId;
											}).map((item)=> {
												return item.user.id;
											}).concat(this.props.pubData.managers.map((item)=> {
												return item.user.id;
											}))}
										/>
									</div>
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
												{!version.isPublic &&
													<span className="pt-icon-standard pt-icon-lock2" />
												}
												<span>{version.isPublic ? 'Public' : 'Private'}</span>
											</span>
										}
									</div>
								</div>
								{!isActive &&
									<div className="access-preview">
										{(this.props.pubData.isCommunityAdminManaged || version.isCommunityAdminShared) &&
											<span className="pt-icon-standard pt-icon-people" />
										}
										{this.props.pubData.managers.concat(this.props.pubData.versionPermissions.filter((versionPermission)=> {
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
											<div className="card pt-elevation-0 flat">
												<div className="name">
													Managers
													<span className="managers-preview">
														<span className="pt-icon-standard pt-icon-people" />
														{managers.slice(0, 2).map((manager)=> {
															return <Avatar width={20} userInitials={manager.user.initials} userAvatar={manager.user.avatar} />;
														})}
														{managers.length - 2 > 0 &&
															<Avatar width={20} userInitials={`+${managers.length - 2}`} />
														}
													</span>
												</div>
												<div className="options">
													Can View
												</div>
											</div>

											{/* If community admins are not managers, show options for their version permissions */}
											{!this.props.pubData.isCommunityAdminManaged &&
												<div className="card pt-elevation-1">
													<div className="name">
														<span className="pt-icon-standard pt-icon-people" />
														Community Admins
													</div>
													<div className="options">
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
													</div>
												</div>
											}
											{this.props.pubData.versionPermissions.filter((versionPermission)=> {
												return !managerIds[versionPermission.user.id];
											}).filter((versionPermission)=> {
												return versionPermission.versionId === version.id;
											}).sort((foo, bar)=> {
												if (foo.createdAt < bar.createdAt) { return -1; }
												if (foo.createdAt > bar.createdAt) { return 1; }
												return 0;
											}).map((versionPermission)=> {
												return (
													<div className="card pt-elevation-1">
														<div className="name">
															<Avatar width={25} userInitials={versionPermission.user.initials} userAvatar={versionPermission.user.avatar} />
															{versionPermission.user.fullName}
														</div>
														<div className="options">
															<button
																className="pt-button pt-minimal pt-small"
																type="button"
																onClick={()=> {
																	this.handleVersionPermissionDelete(versionPermission.id);
																}}
															>
																<span className="pt-icon-standard pt-icon-small-cross" />
															</button>
														</div>
													</div>
												);
											})}
											<div className="card pt-elevation-1 add">
												<UserAutocomplete
													onSelect={(user)=> {
														return this.handleVersionPermissionAdd({
															userId: user.id,
															versionId: version.id,
														});
													}}
													allowCustomUser={false} // Eventually use this for emails
													placeholder="Add user..."
													usedUserIds={this.props.pubData.versionPermissions.filter((versionPermission)=> {
														return !versionPermission.versionId;
													}).map((item)=> {
														return item.user.id;
													}).concat(this.props.pubData.managers.map((item)=> {
														return item.user.id;
													}))}
												/>
											</div>
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
