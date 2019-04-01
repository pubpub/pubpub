import React, { useContext, useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import useWindowSize from 'react-use/lib/useWindowSize';
import { PageContext } from 'components/PageWrapper/PageWrapper';
import dateFormat from 'dateformat';
import stickybits from 'stickybits';
import throttle from 'lodash.throttle';
import { apiFetch, getResizedUrl } from 'utilities';
import {
	Button,
	EditableText,
	Popover,
	PopoverInteractionKind,
	Position,
	Tag,
	Intent,
} from '@blueprintjs/core';
import Icon from 'components/Icon/Icon';
import GridWrapper from 'components/GridWrapper/GridWrapper';
import DropdownButton from 'components/DropdownButton/DropdownButton';

require('./pubHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	// communityData: PropTypes.object.isRequired,
	// locationData: PropTypes.object.isRequired,
	updateLocalData: PropTypes.func.isRequired,
	// setPubData: PropTypes.func.isRequired,
	// activeDiscussionChannel: PropTypes.object,
	// setDiscussionChannel: PropTypes.func.isRequired,
};

// const defaultProps = {
// 	locationData: { params: {} },
// 	activeDiscussionChannel: { title: 'public' },
// };

const PubHeader = (props) => {
	const { communityData } = useContext(PageContext);
	const headerRef = useRef(null);
	const [title, setTitle] = useState(props.pubData.title);
	const [isMounted, setIsMounted] = useState(false);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const { width: windowWidth } = useWindowSize();

	useEffect(() => {
		setIsMounted(true);
		const nextOffsetHeight = headerRef.current.offsetHeight;
		const stickyInstance = stickybits('.pub-header-component', {
			stickyBitStickyOffset: 35 - nextOffsetHeight,
			useStickyClasses: true,
		});

		return () => {
			stickyInstance.cleanup();
		};
	}, [props.pubData, windowWidth]);

	const handleTitleSave = (newTitle) => {
		return apiFetch('/api/pubs', {
			method: 'PUT',
			body: JSON.stringify({
				title: newTitle,
				pubId: props.pubData.id,
				communityId: communityData.id,
			}),
		})
			.then(() => {
				props.updateLocalData('pub', {
					title: newTitle,
				});
				setIsEditingTitle(false);
			})
			.catch((err) => {
				console.error('Error Saving: ', err);
			});
	};

	const pubData = props.pubData;
	// const authors = pubData.collaborators.filter((collaborator)=> {
	// 	return collaborator.Collaborator.isAuthor;
	// });
	// const queryObject = this.props.locationData.query;
	// const activeDiscussionChannel = pubData.discussionChannels.reduce(
	// 	(prev, curr) => {
	// 		if (queryObject.channel === curr.title) {
	// 			return curr;
	// 		}
	// 		return prev;
	// 	},
	// 	{ title: 'public' },
	// );

	const authors = pubData.attributions.filter((attribution) => {
		return attribution.isAuthor;
	});
	const useHeaderImage = pubData.useHeaderImage && pubData.avatar;
	const backgroundStyle = {};
	if (useHeaderImage) {
		const resizedBackground = getResizedUrl(pubData.avatar, 'fit-in', '1500x600');
		backgroundStyle.backgroundImage = `url("${resizedBackground}")`;
		backgroundStyle.color = 'white';
	}
	// const mode = props.locationData.params.mode;
	// const subMode = props.locationData.params.subMode;
	// const activeVersion = pubData.activeVersion;
	// const sortedVersionsList = pubData.versions.sort((foo, bar) => {
	// 	if (foo.createdAt < bar.createdAt) {
	// 		return 1;
	// 	}
	// 	if (foo.createdAt > bar.createdAt) {
	// 		return -1;
	// 	}
	// 	return 0;
	// });

	// const numNewerVersions =
	// 	!pubData.isDraft &&
	// 	pubData.versions.reduce((prev, curr) => {
	// 		if (curr.createdAt > activeVersion.createdAt) {
	// 			return prev + 1;
	// 		}
	// 		return prev;
	// 	}, 0);
	const numDiscussions = pubData.discussions.length;
	// const numAttributions = pubData.collaborators.filter((item)=> {
	// 	return item.Collaborator.isAuthor || item.Collaborator.isContributor;
	// }).length;
	const numAttributions = pubData.attributions.length;

	// const discussionChannels = [
	// 	{ title: 'public' },
	// 	...this.props.pubData.discussionChannels.filter((channel) => {
	// 		return !channel.isArchived;
	// 	}),
	// ];

	const useEditableTitle = pubData.isManager && isMounted;
	let pubTitle = pubData.title;
	if (isEditingTitle) {
		pubTitle = title;
	}

	const metaModes = [
		{ title: 'Details', icon: '...', key: 'details' },
		{ title: 'Download', icon: 'download', key: 'download' },
	];

	return (
		<div className="pub-header-component" style={backgroundStyle} ref={headerRef}>
			<div className={`wrapper ${useHeaderImage ? 'dim' : ''}`}>
				<GridWrapper containerClassName="pub">
					<div className="tags-buttons-wrapper">
						<div className="tags">
							{pubData.pubTags
								.filter((pubTag) => {
									return pubTag.tag;
								})
								.sort((foo, bar) => {
									if (foo.tag.title.toLowerCase() < bar.tag.title.toLowerCase()) {
										return -1;
									}
									if (foo.tag.title.toLowerCase() > bar.tag.title.toLowerCase()) {
										return 1;
									}
									return 0;
								})
								.map((item) => {
									return (
										<a
											key={item.id}
											href={
												item.tag.page
													? `/${item.tag.page.slug}`
													: `/search?tag=${item.tag.title}`
											}
										>
											<Tag
												intent={Intent.PRIMARY}
												minimal={true}
												icon={
													!item.tag.isPublic ? (
														<Icon icon="lock2" />
													) : (
														undefined
													)
												}
											>
												{item.tag.title}
											</Tag>
										</a>
									);
								})}
						</div>
						{/* <div className="buttons">
										{!pubData.isDraft &&
											(pubData.isDraftViewer ||
												pubData.isDraftEditor ||
												pubData.isManager) && (
												<a
													className="bp3-button bp3-small"
													href={`/pub/${pubData.slug}/draft`}
												>
													Go To Working Draft
												</a>
											)}
										<button
											className="bp3-button bp3-small"
											type="button"
											onClick={() => {
												this.props.setOptionsMode(
													pubData.isManager ? 'details' : 'attribution',
												);
											}}
										>
											Options
										</button>

										{pubData.isManager && (
											<button
												className="bp3-button bp3-small"
												type="button"
												onClick={() => {
													this.props.setOptionsMode('sharing');
												}}
											>
												Share
											</button>
										)}
									</div> */}
					</div>

					<h1>
						{useEditableTitle && (
							<EditableText
								placeholder="Add a Pub Title"
								onConfirm={handleTitleSave}
								onChange={(newTitle) => {
									setTitle(newTitle.replace(/\n/g, ''));
								}}
								onEdit={() => {
									setTitle(props.pubData.title);
									setIsEditingTitle(true);
								}}
								onCancel={() => {
									setIsEditingTitle(false);
								}}
								value={pubTitle}
								multiline={true}
								confirmOnEnterKey={true}
							/>
						)}
						{!useEditableTitle && (
							<span className="editable-text-match">{pubData.title}</span>
						)}
					</h1>

					{pubData.description && (
						<div className="description">{pubData.description}</div>
					)}

					{!!authors.length && (
						<div className="authors">
							<span>by </span>
							{authors
								.sort((foo, bar) => {
									if (foo.order < bar.order) {
										return -1;
									}
									if (foo.order > bar.order) {
										return 1;
									}
									if (foo.createdAt < bar.createdAt) {
										return 1;
									}
									if (foo.createdAt > bar.createdAt) {
										return -1;
									}
									return 0;
								})
								.map((author, index) => {
									const separator =
										index === authors.length - 1 || authors.length === 2
											? ''
											: ', ';
									const prefix =
										index === authors.length - 1 && index !== 0 ? ' and ' : '';
									const user = author.user;
									if (user.slug) {
										return (
											<span key={`author-${user.id}`}>
												{prefix}
												<a
													href={`/user/${user.slug}`}
													className="underline-on-hover"
												>
													{user.fullName}
												</a>
												{separator}
											</span>
										);
									}
									return (
										<span key={`author-${user.id}`}>
											{prefix}
											{user.fullName}
											{separator}
										</span>
									);
								})}
						</div>
					)}
					<div className="details-wrapper">
						<div className="details">
							{/* <Popover
										content={
											<div className="bp3-menu">
												{(pubData.isDraftViewer ||
													pubData.isDraftEditor ||
													pubData.isManager) && (
													<li>
														<a
															className={`bp3-menu-item ${
																pubData.isDraft ? 'bp3-active' : ''
															}`}
															tabIndex="0"
															href={`/pub/${pubData.slug}/draft`}
														>
															Working Draft
														</a>
													</li>
												)}
												{sortedVersionsList.map((version) => {
													return (
														<li key={version.id}>
															<a
																className={`bp3-menu-item ${
																	version.id ===
																	pubData.activeVersion.id
																		? 'bp3-active'
																		: ''
																}`}
																tabIndex="0"
																href={`/pub/${
																	pubData.slug
																}?version=${version.id}`}
															>
																{dateFormat(
																	version.createdAt,
																	'mmm dd, yyyy · h:MMTT',
																)}
																{!version.isPublic && (
																	<Icon icon="lock2" />
																)}
															</a>
														</li>
													);
												})}
											</div>
										}
										interactionKind={PopoverInteractionKind.CLICK}
										position={Position.BOTTOM_LEFT}
										popoverClassName="versions-popover"
										// transitionDuration={-1}
										minimal={true}
										// inline={true}
										inheritDarkTheme={false}
									>
										<div
											// href={`/pub/${pubData.slug}/versions`}
											// onClick={(evt)=> {
											// 	evt.preventDefault();
											// 	this.props.setOptionsMode('versions');
											// }}
											role="button"
											tabIndex={-1}
											className="detail-button versions"
										>
											{!pubData.isDraft && !activeVersion.isPublic && (
												<Icon icon="lock2" />
											)}
											{!pubData.isDraft && (
												<span>
													{sortedVersionsList[
														sortedVersionsList.length - 1
													].id !== activeVersion.id
														? 'Updated '
														: ''}
													{dateFormat(
														pubData.activeVersion.createdAt,
														'mmm dd, yyyy',
													)}
												</span>
											)}
											
											{pubData.isDraft && (
												<span>
													Working Draft ({pubData.versions.length} Saved
													Version
													{pubData.versions.length === 1 ? '' : 's'})
												</span>
											)}

											
											{!pubData.isDraft && !!numNewerVersions && (
												<span>
													{' '}
													({numNewerVersions} Newer Version
													{numNewerVersions === 1 ? '' : 's'})
												</span>
											)}

											
											{!pubData.isDraft &&
												!numNewerVersions &&
												pubData.versions.length > 1 && (
													<span>
														{' '}
														({pubData.versions.length - 1} Older Version
														{pubData.versions.length - 1 === 1
															? ''
															: 's'}
														)
													</span>
												)}
											<Icon icon="chevron-down" />
										</div>
									</Popover> */}
							{/* this.props.pubData.publicDiscussions && (
										<a
											href="#discussions"
											role="button"
											tabIndex={-1}
											className="detail-button"
										>
											{numDiscussions} Discussion
											{numDiscussions === 1 ? '' : 's'} (#
											{activeDiscussionChannel.title})
										</a>
									) */}
							{!!numAttributions && (
								<div
									role="button"
									tabIndex={-1}
									className="detail-button"
									// href={`/pub/${pubData.slug}/collaborators`}
									// onClick={(evt) => {
									// 	evt.preventDefault();
									// 	this.props.setOptionsMode('attribution');
									// }}
								>
									{/* <span className="bp3-icon-standard bp3-icon-team" /> */}
									{numAttributions} Contributor
									{numAttributions === 1 ? '' : 's'}
								</div>
							)}
						</div>
						<div className="meta-buttons">
							{metaModes.map((mode) => {
								const isActive = pubData.metaMode === mode.key;
								return (
									<Button
										text={mode.icon}
										active={isActive}
										onClick={() => {
											props.updateLocalData('pub', {
												metaMode: isActive ? undefined : mode.key,
											});
										}}
									/>
								);
							})}
						</div>
					</div>
				</GridWrapper>
				<div className="bottom-text">
					<div className="bottom-title">{pubData.title}</div>
					<div className="bottom-buttons">
						{metaModes.map((mode) => {
							const isActive = pubData.metaMode === mode.key;
							return (
								<Button
									text={mode.icon}
									active={isActive}
									minimal={true}
									small={true}
									onClick={() => {
										props.updateLocalData('pub', {
											metaMode: isActive ? undefined : mode.key,
										});
									}}
								/>
							);
						})}
						{/*<Button
							minimal={true}
							small={true}
							// onClick={() => {
							// 	this.props.setOptionsMode('cite');
							// }}
							text="Cite"
						/>
						<span className="dot">·</span>
						<Button
							minimal={true}
							small={true}
							// onClick={() => {
							// 	this.props.setOptionsMode('download');
							// }}
							text="Download"
						/>
						<span className="dot">·</span>*/}
						{/*this.props.pubData.publicDiscussions && (
								<DropdownButton
									label={`#${this.props.activeDiscussionChannel.title}`}
									// icon={items[props.value].icon}
									isRightAligned={true}
									isMinimal={true}
									isSmall={true}
								>
									<ul className="channel-permissions-dropdown bp3-menu">
										{discussionChannels.map((channel) => {
											return (
												<li key={`channel-option-${channel.title}`}>
													<button
														className="bp3-menu-item bp3-popover-dismiss"
														onClick={() => {
															this.props.setDiscussionChannel(
																channel.title,
															);
														}}
														type="button"
													>
														#{channel.title}
													</button>
												</li>
											);
										})}
										<li className="bp3-menu-divider" />
										<li>
											<Button
												minimal={true}
												text="Manage Discussion Channels"
												onClick={() => {
													this.props.setOptionsMode('discussions');
												}}
											/>
										</li>
									</ul>
								</DropdownButton>
							) */}
					</div>
				</div>
			</div>
		</div>
	);
};

PubHeader.propTypes = propTypes;
// PubHeader.defaultProps = defaultProps;
export default PubHeader;
