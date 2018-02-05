import React from 'react';
import PropTypes from 'prop-types';
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
	setOverlayPanel: PropTypes.func.isRequired,
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
		<div className="pub-pres-details-component">
			<div className={`container pub ${props.hasHeaderImage ? '' : 'no-header-image'}`}>
				<div className="row">
					<div className="col-12">
						<div className="details">
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
											<a href={`/user/${author.slug}`}>{author.fullName}</a>
											{separator}
										</span>
									);
								}
								return <span key={`author-${author.id}`}>{prefix}{author.fullName}{separator}</span>;
							})}
						</div>
						<div className="button upper">
							<Popover
								content={
									<ul className="pt-menu">
										<li className="pt-menu-header" style={{ textAlign: 'right' }}>
											<h6 style={{ paddingRight: '0px' }}>Published Snapshots</h6>
										</li>
										<li className="pt-menu-divider" />
										{props.versions.sort((foo, bar)=>{
											if (foo.createdAt < bar.createdAt) { return 1; }
											if (foo.createdAt > bar.createdAt) { return -1; }
											return 0;
										}).map((version)=> {
											return (
												<li key={`version-${version.id}`} style={{ textAlign: 'right' }}>
													<a href={`/pub/${props.slug}?version=${version.id}`} className="pt-menu-item pt-popover-dismiss">
														<span style={{ fontWeight: version.isActive ? '600' : 'normal' }}>
															{dateFormat(version.createdAt, 'mmm dd, yyyy · HH:MM')}
														</span>
													</a>
												</li>
											);
										})}
									</ul>
								}
								interactionKind={PopoverInteractionKind.CLICK}
								position={Position.BOTTOM_RIGHT}
								popoverClassName="pt-minimal"
								transitionDuration={-1}
								inheritDarkTheme={false}
							>
								<button className="pt-button pt-minimal date">
									{dateFormat(activeVersion.createdAt, 'mmm dd, yyyy')}
									<span className="pt-icon-standard pt-icon-caret-down pt-align-right" />
								</button>
							</Popover>
						</div>
					</div>

					<div className="col-12">
						<div className="details lower">
							{props.localPermissions !== 'none' &&
								<span>
									<a href={`/pub/${props.slug}/collaborate`} className="pt-button pt-minimal">
										{props.numDiscussions}
										<span className="pt-icon-standard pt-align-right pt-icon-chat" />
									</a>
									{/* <a href={`/pub/${props.slug}/collaborate`} className="pt-button pt-minimal">
										{props.numSuggestions}
										<span className="pt-icon-standard pt-align-right pt-icon-doc" />
									</a> */}
								</span>
							}
							<a
								// href={`/pub/${props.slug}?panel=collaborators`}
								onClick={()=> { props.setOverlayPanel('collaborators'); }}
								className="pt-button pt-minimal"
							>
								{props.collaborators.length}
								<span className="pt-icon-standard pt-icon-team" />
								<span className="avatars">
									{props.collaborators.map((collaborator, index)=> {
										return (
											<Avatar
												key={`avatar-${collaborator.id}`}
												instanceNumber={index}
												userInitials={collaborator.initials}
												userAvatar={collaborator.avatar}
												borderColor="rgba(255, 255, 255, 1.0)"
												width={20}
												doesOverlap={true}
											/>
										);
									})}
								</span>
							</a>
						</div>
						{props.localPermissions !== 'none' &&
							<div className="button">
								<a href={`/pub/${props.slug}/collaborate`} className="pt-button pt-intent-primary">Edit, Review, Discuss</a>
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
