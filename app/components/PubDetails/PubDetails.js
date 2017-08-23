import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import dateFormat from 'dateformat';
import Avatar from 'components/Avatar/Avatar';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, MenuDivider } from '@blueprintjs/core';

require('./pubDetails.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collaborators: PropTypes.array.isRequired,
	versions: PropTypes.array.isRequired,
};

const PubDetails = function(props) {
	const authors = props.collaborators.filter((collaborator)=> {
		return collaborator.isAuthor;
	});

	const activeVersion = props.versions.reduce((prev, curr)=> {
		if (curr.active) { return curr; }
		return prev;
	}, undefined);

	return (
		<div className={'pub-details'}>
			<div className={'container'}>
				<div className={'row'}>
					<div className={'col-12'}>
						<div className={'details'}>
							{authors.length && <span>by </span>}
							{authors.map((author, index)=> {
								const separator = index === authors.length - 1 ? '' : ', '; 
								const prefix = index === authors.length - 1 ? ' and ' : ''
								if (author.slug) {
									return (
										<span>
											{prefix}
											<Link key={`author-${author.id}`} to={`/user/${author.slug}`}>{author.fullName}</Link>
											{separator}
										</span>
									);	
								}
								return <span key={`author-${author.id}`}>{prefix}{author.fullName}{separator}</span>
							})}
						</div>
						<div className={'button'}>
							<Popover
								content={
									<Menu>
										{props.versions.sort((foo, bar)=>{
											if (foo.date < bar.date) { return 1; }
											if (foo.date > bar.date) { return -1; }
											return 0;
										}).map((version)=> {
											return (
												<li key={`version-${version.id}`} style={{ textAlign: 'right' }}>
													<Link to={`/pub/${props.pubData.slug}`} className="pt-menu-item pt-popover-dismiss">
														<span style={{ fontWeight: version.active ? '600' : 'normal' }}>
															{dateFormat(version.date, 'mmm dd, yyyy · HH:MM')}
														</span>
													</Link>
												</li>
											);
										})}
									</Menu>
								}
								interactionKind={PopoverInteractionKind.CLICK}
								position={Position.BOTTOM_RIGHT}
								popoverClassName={'pt-minimal'}
								transitionDuration={-1}
								inheritDarkTheme={false}
							>
								<button className={'pt-button pt-minimal'}>
									{dateFormat(activeVersion.date, 'mmm dd, yyyy')}
									<span className={'pt-icon-standard pt-icon-caret-down pt-align-right'} />
								</button>
							</Popover>


							
						</div>
					</div>
					<div className={'col-12'}>
						<div className={'details'}>
							{props.pubData.numDiscussions}
							<span className={'pt-icon-standard pt-icon-chat'} />
							{props.pubData.numSuggestions}
							<span className={'pt-icon-standard pt-icon-manually-entered-data'} />
							{props.pubData.numCollaborators}
							<span className={'pt-icon-standard pt-icon-people'} />
							{props.collaborators.map((collaborator)=> {
								return (
									<Avatar
										key={`avatar-${collaborator.id}`}
										userInitials={collaborator.userInitials}
										userAvatar={collaborator.userAvatar}
										borderColor={'rgba(255, 255, 255, 0.5)'}
										width={20}
										doesOverlap={true}
									/>
								);
							})}
						</div>
						<div className={'button'}>
							<Link to={'/'} className={'pt-button pt-intent-primary'}>Collaborate</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

PubDetails.propTypes = propTypes;
export default PubDetails;
