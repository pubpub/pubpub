import React from 'react';
import PropTypes from 'prop-types';
import Avatar from 'components/Avatar/Avatar';

require('./pubCollabHeader.scss');

const propTypes = {
	pubData: PropTypes.object.isRequired,
	collaborators: PropTypes.array.isRequired,
	activeCollaborators: PropTypes.array.isRequired,
};

const PubCollabHeader = function(props) {
	const authors = props.collaborators.filter((collaborator)=> {
		return collaborator.isAuthor;
	});

	return (
		<div className={'pub-collab-header'} >
			<div className={'flex-parent'}>
				<div className={'flex-left title'}>
					{props.pubData.title}
				</div>
				<div className={'flex-center tags'}>
					<div className={'tags-wrapper'}>
						{props.pubData.collections.map((collection)=> {
							return (
								<div key={`collection-${collection.id}`} className={'pt-tag pt-minimal pt-intent-primary'}>
									{collection.title}
									{collection.isPrivate &&
										<span className={'pt-icon-standard pt-icon-lock'} />
									}
								</div>
							);
						})}
					</div>
				</div>
				<div className={'flex-right'}>
					<button type={'button'} className={'pt-button pt-intent-primary'}>Share</button>
					<button type={'button'} className={'pt-button pt-intent-primary'}>Publish Snapshot</button>
					{/* <button type={'button'} className={'pt-button pt-intent-primary'}>Submit for Publication</button> */}
				</div>
			</div>

			<div className={'flex-parent'}>
				<div className={'flex-left'}>
					{authors.map((author, index)=> {
						const separator = index === authors.length - 1 ? '' : ', ';
						const prefix = index === authors.length - 1 ? ' and ' : '';
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
					<span className={'pt-icon-standard pt-icon-edit'} />
				</div>
				<div className={'flex-right avatars'}>
					{props.activeCollaborators.map((collaborator)=> {
						return (
							<div className={'avatar-wrapper'}>
								<Avatar
									key={`avatar-${collaborator.id}`}
									userInitials={collaborator.userInitials}
									userAvatar={collaborator.userAvatar}
									borderColor={collaborator.color}
									borderWidth={'2px'}
									width={24}
								/>
							</div>
						);
					})}
					<button type="button" className={'pt-button pt-icon-more pt-small'} />
				</div>
			</div>

			
		</div>
	);
};

PubCollabHeader.propTypes = propTypes;
export default PubCollabHeader;
