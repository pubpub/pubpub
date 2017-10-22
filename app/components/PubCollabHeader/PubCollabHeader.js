import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';
import { Link } from 'react-router-dom';
import DropdownButton from 'components/DropdownButton/DropdownButton';

require('./pubCollabHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collaborators: PropTypes.array.isRequired,
	activeCollaborators: PropTypes.array.isRequired,
	canManage: PropTypes.bool,
	isAdmin: PropTypes.bool,
	submissionThreadNumber: PropTypes.number,
	activeThread: PropTypes.array,
	onPublishClick: PropTypes.func,
	onSubmitClick: PropTypes.func,
	onShareClick: PropTypes.func,
	onDetailsClick: PropTypes.func,
	onCollaboratorsClick: PropTypes.func,
	onCollectionsClick: PropTypes.func,
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
};

const PubCollabHeader = function(props) {
	const authors = props.collaborators.filter((collaborator)=> {
		return collaborator.Collaborator.isAuthor;
	});
	const uniqueActiveCollaborators = {};
	props.activeCollaborators.forEach((item)=> {
		uniqueActiveCollaborators[item.id] = item;
	});
	return (
		<div className={'pub-collab-header'} >
			<div className={'flex-parent'}>
				<div
					tabIndex={0}
					role={'button'}
					className={`flex-left title ${props.canManage ? '' : 'static'}`}
					onClick={props.canManage ? props.onDetailsClick : ()=>{}}
				>
					{props.pubData.title}
				</div>
				<div className={'flex-center tags'}>
					<div className={'tags-wrapper'}>
						{props.pubData.collections.map((collection)=> {
							if (props.isAdmin) {
								return (
									<div tabIndex={0} role={'button'} key={`collection-${collection.id}`} className={'pt-tag pt-minimal pt-intent-primary'} onClick={props.onCollectionsClick}>
										{collection.title}
										{!collection.isPublic &&
											<span className={'pt-icon-standard pt-icon-lock'} />
										}
									</div>
								);
							}
							return (
								<Link to={`/${collection.slug}`} key={`collection-${collection.id}`} className={'pt-tag pt-minimal pt-intent-primary'}>
									{collection.title}
									{!collection.isPublic &&
										<span className={'pt-icon-standard pt-icon-lock'} />
									}
								</Link>
							);
						})}
					</div>
				</div>
				{props.canManage &&
					<div className={'flex-right'}>
						<button type={'button'} className={'pt-button pt-intent-primary'} onClick={props.onShareClick}>Share</button>
						{props.isAdmin
							? <button type={'button'} className={'pt-button pt-intent-primary'} onClick={props.onPublishClick}>Publish</button>
							/* TODO - if there is already a submit discussion, need to redirect to that one! */
							: <span>
								{props.submissionThreadNumber
									? <Link className={`pt-button pt-intent-primary ${props.activeThread[0].threadNumber === props.submissionThreadNumber ? 'pt-disabled' : ''}`} to={`/pub/${props.pubData.slug}/collaborate?thread=${props.submissionThreadNumber}`}>Submit for Publication</Link>
									: <button type={'button'} className={'pt-button pt-intent-primary'} onClick={props.onSubmitClick}>Submit for Publication</button>
								}
							</span>
							
						}
					</div>
				}
			</div>

			<div className={'flex-parent'}>
				<div tabIndex={0} role={'button'} className={'flex-left'} onClick={props.onCollaboratorsClick}>
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
				<div className={'flex-center edit'}>
					{props.canManage &&
						<span tabIndex={0} role={'button'} className={'pt-icon-standard pt-icon-edit'} onClick={props.onCollaboratorsClick} />
					}
				</div>
				<div className={'flex-right avatars'}>
					{Object.keys(uniqueActiveCollaborators).map((key)=> {
						return uniqueActiveCollaborators[key];
					}).filter((item)=> {
						return item;
					}).map((collaborator)=> {
						return (
							<div className={'avatar-wrapper'} key={`present-avatar-${collaborator.id}`}>
								<Avatar
									userInitials={collaborator.initials}
									userAvatar={collaborator.image}
									borderColor={collaborator.cursorColor}
									borderWidth={'2px'}
									width={24}
								/>
							</div>
						);
					})}
					<DropdownButton icon={'pt-icon-more pt-small'} isRightAligned={true}>
						<ul className={'pt-menu'}>
							<li style={{ textAlign: 'right' }}>
								<Link to={`/pub/${props.pubData.slug}`} className="pt-menu-item pt-popover-dismiss">
									Go to published URL
								</Link>
							</li>
						</ul>
					</DropdownButton>
				</div>
			</div>

		</div>
	);
};

PubCollabHeader.defaultProps = defaultProps;
PubCollabHeader.propTypes = propTypes;
export default PubCollabHeader;
