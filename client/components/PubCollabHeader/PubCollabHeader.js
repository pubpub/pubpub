import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider, Tooltip } from '@blueprintjs/core';
import DropdownButton from 'components/DropdownButton/DropdownButton';
import { apiFetch, getResizedUrl } from 'utilities';

require('./pubCollabHeader.scss');

const propTypes = {
	loginData: PropTypes.object.isRequired,
	communityData: PropTypes.object.isRequired,
	locationData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	collaborators: PropTypes.array.isRequired,
	activeCollaborators: PropTypes.array.isRequired,
	canManage: PropTypes.bool,
	isAdmin: PropTypes.bool,
	submissionThreadNumber: PropTypes.number,
	activeThread: PropTypes.array,
	collabStatus: PropTypes.string.isRequired,
	onPublishClick: PropTypes.func,
	onSubmitClick: PropTypes.func,
	onShareClick: PropTypes.func,
	onDetailsClick: PropTypes.func,
	onCollaboratorsClick: PropTypes.func,
	onCollectionsClick: PropTypes.func,
	onThreadClick: PropTypes.func.isRequired,
	onChaptersClick: PropTypes.func,
};

const defaultProps = {
	canManage: false,
	isAdmin: false,
	submissionThreadNumber: undefined,
	activeThread: [{}],
	onPublishClick: ()=>{},
	onSubmitClick: ()=>{},
	onShareClick: ()=>{},
	onDetailsClick: ()=>{},
	onCollaboratorsClick: ()=>{},
	onCollectionsClick: ()=>{},
	onChaptersClick: ()=>{},
};

const PubCollabHeader = function(props) {
	const isAdmin = props.loginData.isAdmin;
	const authors = props.collaborators.filter((collaborator)=> {
		return collaborator.Collaborator.isAuthor;
	});
	const uniqueActiveCollaborators = {};
	props.activeCollaborators.forEach((item)=> {
		if (item.initials !== '?') {
			uniqueActiveCollaborators[item.id] = item;
		}
	});
	const numAnonymous = props.activeCollaborators.reduce((prev, curr)=> {
		if (curr.initials === '?') { return prev + 1; }
		return prev;
	}, 0);
	if (numAnonymous) {
		uniqueActiveCollaborators.anon = {
			backgroundColor: 'rgba(96,96,96, 0.2)',
			cursorColor: 'rgba(96,96,96, 1.0)',
			id: 'anon',
			initials: numAnonymous,
			name: `${numAnonymous} anonymous user${numAnonymous === 1 ? '' : 's'}`,
		};
	}
	const resizedSmallHeaderLogo = getResizedUrl(props.communityData.smallHeaderLogo, 'fit-in', '0x50');

	const handleLogout = ()=> {
		apiFetch('/api/logout')
		.then(()=> { window.location.href = '/'; });
	};

	/* If all the collections a pub is in are set to OpenPublish, then the pub can be published */
	const pubIsOpenPublish = props.pubData.collections.reduce((prev, curr)=> {
		if (prev && curr.isOpenPublish) { return prev; }
		return false;
	}, true);

	return (
		<div className="pub-collab-header-component">
			<a href="/" className="header-logo" style={{ backgroundColor: props.communityData.accentColor }}>
				<img alt="header logo" className="headerLogo" src={resizedSmallHeaderLogo} />
			</a>
			<div className="header-content">
				<div className="flex-parent">
					<div
						tabIndex={0}
						role="button"
						className={`flex-left title ${props.canManage ? '' : 'static'}`}
						onClick={props.canManage ? props.onDetailsClick : ()=>{}}
					>
						{props.pubData.title}
					</div>
					<div className="flex-center tags">
						<div className="tags-wrapper">
							{props.pubData.collections.map((collection)=> {
								if (props.isAdmin) {
									return (
										<div tabIndex={0} role="button" key={`collection-${collection.id}`} className="pt-tag pt-minimal pt-intent-primary" onClick={props.onCollectionsClick}>
											{collection.title}
											{!collection.isPublic &&
												<span className="pt-icon-standard pt-icon-lock" />
											}
										</div>
									);
								}
								return (
									<a href={`/${collection.slug}`} key={`collection-${collection.id}`} className="pt-tag pt-minimal pt-intent-primary">
										{collection.title}
										{!collection.isPublic &&
											<span className="pt-icon-standard pt-icon-lock" />
										}
									</a>
								);
							})}
						</div>
					</div>
					<div className="flex-right">
						{props.canManage &&
							<button type="button" className="pt-button pt-intent-primary" onClick={props.onShareClick}>Share</button>
						}
						{props.canManage && (props.isAdmin || pubIsOpenPublish) &&
							<button type="button" className="pt-button pt-intent-primary" onClick={props.onPublishClick}>Publish</button>
						}
						{props.canManage && !props.isAdmin && !pubIsOpenPublish &&
							<span>
								{/* TODO - if there is already a submit discussion, need to redirect to that one! */}
								{props.submissionThreadNumber
									/*? <a href={`/pub/${props.pubData.slug}/collaborate?thread=${props.submissionThreadNumber}`} className={`pt-button pt-intent-primary ${props.activeThread[0].threadNumber === props.submissionThreadNumber ? 'pt-disabled' : ''}`}>Submit for Publication</a>*/
									? <button type="button" className={`pt-button pt-intent-primary ${props.activeThread[0].threadNumber === props.submissionThreadNumber ? 'pt-disabled' : ''}`} onClick={()=> { props.onThreadClick(props.submissionThreadNumber); }}>Submit for Publication</button>
									: <button type="button" className="pt-button pt-intent-primary" onClick={props.onSubmitClick}>Submit for Publication</button>
								}
							</span>
						}
						{/* Login or Signup button */}
						{!props.loginData.slug &&
							<a href={`/login?redirect=/pub/${props.pubData.slug}/collaborate`} className="login-button pt-button pt-large pt-minimal">Login or Signup</a>
						}
						{props.loginData.slug &&
							<Popover
								content={
									<Menu>
										<li>
											<a href={`/user/${props.loginData.slug}`} className="pt-menu-item pt-popover-dismiss">
												<div>{props.loginData.fullName}</div>
												<div className="subtext">View Profile</div>
											</a>
										</li>
										<MenuDivider />
										<li>
											<a href="/pub/create" className="pt-menu-item pt-popover-dismiss">
												Create New Pub
											</a>
										</li>
										{isAdmin &&
											<li>
												<a href="/dashboard" className="pt-menu-item pt-popover-dismiss">
													Dashboard
												</a>
											</li>
										}
										<MenuItem
											className="pt-popover-dismiss"
											href="/notifications"
											text="Notifications"
											label={props.loginData.notificationCount
												? <span className="notification-count">{props.loginData.notificationCount}</span>
												: null
											}
										/>
										<MenuItem text="Logout" onClick={handleLogout} />
									</Menu>
								}
								interactionKind={PopoverInteractionKind.CLICK}
								position={Position.BOTTOM_RIGHT}
								transitionDuration={-1}
								inheritDarkTheme={false}
							>
								<button className="pt-button pt-large pt-minimal avatar-button">
									<Avatar
										userInitials={props.loginData.initials}
										userAvatar={props.loginData.avatar}
										width={30}
									/>
									{!!props.loginData.notificationCount &&
										<div className="notification-count">{props.loginData.notificationCount}</div>
									}
								</button>
							</Popover>
						}
					</div>
				</div>

				<div className="flex-parent">
					<div tabIndex={0} role="button" className="flex-left" onClick={props.onCollaboratorsClick}>
						{authors.sort((foo, bar)=> {
							if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
							if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
							if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
							if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
							return 0;
						}).map((author, index)=> {
							const separator = index === authors.length - 1 || authors.length === 2 ? '' : ', ';
							const prefix = (index === authors.length - 1 && index > 0) ? ' and ' : '';
							if (author.slug) {
								return (
									<span key={`author-${author.id}`}>
										{prefix}
										{author.fullName}
										{separator}
									</span>
								);
							}
							return <span key={`author-${author.id}`}>{prefix}{author.fullName}{separator}</span>;
						})}
					</div>
					<div className="flex-center edit">
						{props.canManage &&
							<span tabIndex={0} role="button" className="pt-icon-standard pt-icon-edit" onClick={props.onCollaboratorsClick} />
						}
					</div>
					<div className="flex-right avatars">
						<div className={`pt-tag pt-minimal ${props.collabStatus === 'disconnected' ? 'pt-intent-danger' : ''}`}>
							{props.collabStatus}
							{props.collabStatus === 'saving' ? '...' : ''}
						</div>
						{Object.keys(uniqueActiveCollaborators).map((key)=> {
							return uniqueActiveCollaborators[key];
						}).filter((item)=> {
							return item && item.id !== props.loginData.id;
						}).map((collaborator)=> {
							return (
								<div className="avatar-wrapper" key={`present-avatar-${collaborator.id}`}>
									<Tooltip
										content={collaborator.name}
										tooltipClassName="pt-dark"
									>
										<Avatar
											/* Cast userInitials to string since
											the anonymous Avatar is a int count */
											userInitials={String(collaborator.initials)}
											userAvatar={collaborator.image}
											borderColor={collaborator.cursorColor}
											borderWidth="2px"
											width={24}
										/>
									</Tooltip>
								</div>
							);
						})}
						<DropdownButton icon="pt-icon-more pt-small" isRightAligned={true}>
							<ul className="pt-menu">
								<li style={{ textAlign: 'right' }}>
									<a href={`/pub/${props.pubData.slug}`} className="pt-menu-item pt-popover-dismiss">
										Go to Published Snapshots
									</a>
								</li>
								{(props.loginData.id === 'b242f616-7aaa-479c-8ee5-3933dcf70859' || props.loginData.id === '807f3604-4223-4495-b576-861d04d2f39e' || props.loginData.id === '52441948-93f6-4e03-950a-b5ed061c635b') &&
									<li>
										<button onClick={props.onChaptersClick} className="pt-menu-item pt-popover-dismiss" style={{ textAlign: 'right' }}>
											Chapters
										</button>
									</li>
								}
							</ul>
						</DropdownButton>
					</div>
				</div>
			</div>

		</div>
	);
};

PubCollabHeader.defaultProps = defaultProps;
PubCollabHeader.propTypes = propTypes;
export default PubCollabHeader;
