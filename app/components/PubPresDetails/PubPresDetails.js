import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position } from '@blueprintjs/core';

require('./pubPresDetails.scss');

const propTypes = {
	slug: PropTypes.string.isRequired,
	numDiscussions: PropTypes.number,
	numSuggestions: PropTypes.number,
	collaborators: PropTypes.array.isRequired,
	versions: PropTypes.array.isRequired,
	localPermissions: PropTypes.string,
	hasHeaderImage: PropTypes.bool,
};

const defaultProps = {
	numDiscussions: 0,
	numSuggestions: 0,
	localPermissions: 'none',
	hasHeaderImage: false,
};

const PubPresDetails = function(props) {
	const authors = props.collaborators.filter((collaborator)=> {
		return collaborator.Collaborator.isAuthor;
	});

	const activeVersion = props.versions.reduce((prev, curr)=> {
		if (curr.isActive) { return curr; }
		return prev;
	}, {});

	return (
		<div className={'pub-pres-details'}>
			<div className={`container pub ${props.hasHeaderImage ? '' : 'no-header-image'}`}>
				<div className={'row'}>
					<div className={'col-12'}>
						<div className={'details'}>
							{!!authors.length && <span>by </span>}
							{authors.sort((foo, bar)=> {
								if (foo.Collaborator.order < bar.Collaborator.order) { return -1; }
								if (foo.Collaborator.order > bar.Collaborator.order) { return 1; }
								if (foo.Collaborator.createdAt < bar.Collaborator.createdAt) { return 1; }
								if (foo.Collaborator.createdAt > bar.Collaborator.createdAt) { return -1; }
								return 0;
							}).map((author, index)=> {
								const separator = index === authors.length - 1 || authors.length === 2 ? '' : ', ';
								const prefix = index === authors.length - 1 && index !== 0 ? ' and ' : '';
								if (author.slug) {
									return (
										<span key={`author-${author.id}`}>
											{prefix}
											<Link to={`/user/${author.slug}`}>{author.fullName}</Link>
											{separator}
										</span>
									);
								}
								return <span key={`author-${author.id}`}>{prefix}{author.fullName}{separator}</span>;
							})}
						</div>
						<div className={'button'}>
							<Popover
								content={
									<ul className={'pt-menu'}>
										<li className={'pt-menu-header'} style={{ textAlign: 'right' }}>
											<h6 style={{ paddingRight: '0px' }}>Published Snapshots</h6>
										</li>
										<li className={'pt-menu-divider'} />
										{props.versions.sort((foo, bar)=>{
											if (foo.createdAt < bar.createdAt) { return 1; }
											if (foo.createdAt > bar.createdAt) { return -1; }
											return 0;
										}).map((version)=> {
											return (
												<li key={`version-${version.id}`} style={{ textAlign: 'right' }}>
													<Link to={`/pub/${props.slug}?version=${version.id}`} className="pt-menu-item pt-popover-dismiss">
														<span style={{ fontWeight: version.isActive ? '600' : 'normal' }}>
															{dateFormat(version.createdAt, 'mmm dd, yyyy · HH:MM')}
														</span>
													</Link>
												</li>
											);
										})}
									</ul>
								}
								interactionKind={PopoverInteractionKind.CLICK}
								position={Position.BOTTOM_RIGHT}
								popoverClassName={'pt-minimal'}
								transitionDuration={-1}
								inheritDarkTheme={false}
							>
								<button className={'pt-button pt-minimal'}>
									{dateFormat(activeVersion.createdAt, 'mmm dd, yyyy')}
									<span className={'pt-icon-standard pt-icon-caret-down pt-align-right'} />
								</button>
							</Popover>
						</div>
					</div>

					<div className={'col-12'}>
						<div className={'details'}>
							{props.numDiscussions}
							<span className={'pt-icon-standard pt-icon-chat'} />
							{props.numSuggestions}
							{/* <span className={'pt-icon-standard pt-icon-manually-entered-data'} /> */}
							<span className={'pt-icon-standard pt-icon-doc'} />
							{props.collaborators.length}
							<span className={'pt-icon-standard pt-icon-team'} />
							{props.collaborators.map((collaborator)=> {
								return (
									<Avatar
										key={`avatar-${collaborator.id}`}
										userInitials={collaborator.initials}
										userAvatar={collaborator.avatar}
										borderColor={'rgba(255, 255, 255, 0.5)'}
										width={20}
										doesOverlap={true}
									/>
								);
							})}
						</div>
						{props.localPermissions !== 'none' &&
							<div className={'button'}>
								<Link to={`/pub/${props.slug}/collaborate`} className={'pt-button pt-intent-primary'}>Collaborate</Link>
							</div>
						}
						
					</div>
				</div>
			</div>
		</div>
	);
};

PubPresDetails.defaultProps = defaultProps;
PubPresDetails.propTypes = propTypes;
export default PubPresDetails;
