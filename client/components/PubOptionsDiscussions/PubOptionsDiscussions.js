import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox } from '@blueprintjs/core';
import PubOptionsSharingCard from 'components/PubOptionsSharingCard/PubOptionsSharingCard';
import UserAutocomplete from 'components/UserAutocomplete/UserAutocomplete';
import Avatar from 'components/Avatar/Avatar';
import { apiFetch } from 'utilities';

require('./pubOptionsDiscussions.scss');

const propTypes = {
	communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	loginData: PropTypes.object.isRequired,
	setPubData: PropTypes.func.isRequired,
};

class PubOptionsDiscussions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			newChannelTitle: '',
		};
		this.handleAddChannel = this.handleAddChannel.bind(this);
	}

	handleAddChannel(evt) {
		evt.preventDefault();
		return apiFetch('/api/discussionChannels', {
			method: 'POST',
			body: JSON.stringify({
				title: this.state.newChannelTitle,
				pubId: this.props.pubData.id,
				communityId: this.props.communityData.id,
			})
		})
		.then((newDiscussionChannel)=> {
			this.setState({ newChannelTitle: '' });
			this.props.setPubData({
				...this.props.pubData,
				discussionChannels: [
					newDiscussionChannel,
					...this.props.pubData.discussionChannels
				],
			});
		})
		.catch((err)=> {
			console.error('Error creating discussion channel', err);
		});
	}

	render() {
		const pubData = this.props.pubData;
		/* List all discussion channels
			Show public write/ public View
			Show options if you can set options
		*/
		// TODO: Hide public options
		// Only allow options on channels you moderate
		const channels = [
			{
				id: undefined,
				title: 'public',
				permissions: 'public',
				isCommunityAdminModerated: true,
				participants: [],
			},
			...pubData.discussionChannels
		];
		return (
			<div className="pub-options-discussions-component">
				<h1>Discussion Channels</h1>
				<form onSubmit={this.handleAddChannel}>
					<input
						type="text"
						className="pt-input pt-fill"
						placeholder="New Discussion Channel Title..."
						value={this.state.newChannelTitle}
						onChange={(evt)=> {
							this.setState({ newChannelTitle: evt.target.value.replace(/ /g, '-').replace(/[^a-zA-Z0-9-]/gi, '').toLowerCase() });
						}}
					/>
				</form>

				<div className="channels">
					{channels.map((channel)=> {
						return (
							<div className="channel" key={`channel-${channel.id}`}>
								<div className="header">
									<div className="title">
										#{channel.title}
									</div>
									<div className="option">
										{channel.permissions}
									</div>
								</div>
								<div>
									<div className="cards-wrapper">
										{/* If community admins are not managers, show options for their permissions */}
										<PubOptionsSharingCard
											content={[
												<span className="pt-icon-standard pt-icon-people" />,
												<span>Community Admins</span>
											]}
											options={(
												<Checkbox
													checked={channel.isCommunityAdminModerated}
													onChange={(evt)=> {
														this.handleVersionUpdate({
															versionId: version.id,
															isCommunityAdminShared: evt.target.checked,
														});
													}}
												>
													Can Moderate
												</Checkbox>
											)}
										/>

										{/* List all version permissions, filtering out managers */}
										{channel.participants.sort((foo, bar)=> {
											if (foo.createdAt < bar.createdAt) { return -1; }
											if (foo.createdAt > bar.createdAt) { return 1; }
											return 0;
										}).map((participant)=> {
											return (
												<PubOptionsSharingCard
													key={participant.id}
													content={[
														<Avatar width={25} userInitials={participant.user.initials} userAvatar={participant.user.avatar} />,
														<span>{participant.user.fullName}</span>
													]}
													options={(
														<button
															className="pt-button pt-minimal pt-small"
															type="button"
															onClick={()=> {
																this.handleVersionPermissionDelete(versionPermission.id || null);
															}}
														>
															<span className="pt-icon-standard pt-icon-small-cross" />
														</button>
													)}
												/>
											);
										})}

										{/* Card for adding new user to version permissions */}
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
													placeholder={`Add participant to #${channel.title}...`}
													usedUserIds={channel.participants.map((item)=> {
														return item.user.id;
													})}
												/>
											}
											isAddCard={true}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}

PubOptionsDiscussions.propTypes = propTypes;
export default PubOptionsDiscussions;
