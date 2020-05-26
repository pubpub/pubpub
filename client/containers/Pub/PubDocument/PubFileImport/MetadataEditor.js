import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button, Checkbox, InputGroup, TextArea } from '@blueprintjs/core';

import { Avatar } from 'components';
import { MenuButton, MenuItem } from 'components/Menu';
import { profileUrl } from 'shared/utils/canonicalUrls';

require('./metadataEditor.scss');

const authorShape = PropTypes.shape({
	name: PropTypes.string,
	users: PropTypes.arrayOf(PropTypes.shape({})),
});

const propTypes = {
	proposedMetadata: PropTypes.shape({
		authors: PropTypes.arrayOf(authorShape),
	}).isRequired,
};

const guessAuthorInitials = (name) => {
	const firstName = name
		.split(' ')
		.slice(0, -1)
		.join(' ');
	const lastName = name.split(' ').pop();
	return firstName.charAt(0) + lastName.charAt(0);
};

const ProposedAuthor = ({ author, onUpdateAuthor }) => {
	const { name, users, matchedUser, ignored } = author;

	const handleToggleIgnored = () => {
		if (ignored) {
			onUpdateAuthor({ ignored: false });
		} else {
			onUpdateAuthor({ ignored: true, matchedUser: null });
		}
	};

	const rendermatchedUsersMenu = () => {
		if (!users || users.length === 0 || ignored) {
			return null;
		}

		if (matchedUser) {
			return (
				<Button small minimal onClick={() => onUpdateAuthor({ matchedUser: null })}>
					Unmatch user
				</Button>
			);
		}

		return (
			<MenuButton
				aria-label="Match author to PubPub user"
				buttonProps={{
					minimal: true,
					small: true,
					rightIcon: 'chevron-down',
				}}
				buttonContent="Match user"
				placement="bottom-end"
			>
				{users.map((user) => (
					<MenuItem
						text={user.fullName}
						icon={<Avatar width={20} avatar={user.avatar} />}
						key={user.id}
						onClick={() => onUpdateAuthor({ matchedUser: user })}
					/>
				))}
			</MenuButton>
		);
	};

	const renderToggleIgnoredButton = () => {
		return (
			<Button
				aria-label={
					ignored
						? `Add ${name} to Pub attribution`
						: `Remove ${name} from Pub attribution`
				}
				onClick={handleToggleIgnored}
				icon={ignored ? 'small-plus' : 'small-cross'}
				small
				minimal
			/>
		);
	};

	const renderName = () => {
		if (matchedUser) {
			return (
				<a href={profileUrl(matchedUser.slug)} target="_blank" rel="noopener noreferrer">
					{matchedUser.fullName}
				</a>
			);
		}
		return name;
	};

	return (
		<div className="proposed-author">
			<Avatar
				width={20}
				initials={matchedUser ? matchedUser.initials : guessAuthorInitials(name)}
				avatar={matchedUser && matchedUser.avatar}
			/>
			<div className={classNames('author-name', ignored && 'ignored')}>{renderName()}</div>
			<div className="controls">
				{rendermatchedUsersMenu()}
				{renderToggleIgnoredButton()}
			</div>
		</div>
	);
};

ProposedAuthor.propTypes = {
	author: authorShape.isRequired,
	onUpdateAuthor: PropTypes.func.isRequired,
};

const MetadataEditor = (props) => {
	const { proposedMetadata } = props;
	const [metadata, setMetadata] = useState(proposedMetadata);
	const [ignoredFields, setIgnoredFields] = useState({});
	const { authors } = metadata;

	useEffect(() => {
		setMetadata(proposedMetadata);
		setIgnoredFields({});
	}, [proposedMetadata]);

	const handleUpdateAuthor = (authorIndex, nextValue) => {
		const nextAuthors = authors.concat();
		nextAuthors.splice(authorIndex, 1, { ...authors[authorIndex], ...nextValue });
		setMetadata({
			...metadata,
			authors: nextAuthors,
		});
	};

	const renderFreeformFieldEntry = (pubDataFieldName, useTextarea = false) => {
		const EntryComponent = useTextarea ? TextArea : InputGroup;
		const currentValue = metadata[pubDataFieldName];
		const currentlyIgnored = ignoredFields[pubDataFieldName];
		if (currentValue === null || currentValue === undefined) {
			return null;
		}
		return (
			<div className="field-entry">
				<Checkbox
					checked={!currentlyIgnored}
					label={`Use imported ${pubDataFieldName}`}
					onChange={() =>
						setIgnoredFields((current) => ({
							...current,
							[pubDataFieldName]: !currentlyIgnored,
						}))
					}
				/>
				<EntryComponent
					disabled={currentlyIgnored}
					value={currentValue}
					onChange={(evt) => {
						const { value } = evt.target;
						setMetadata((current) => ({
							...current,
							[pubDataFieldName]: value,
						}));
					}}
				/>
			</div>
		);
	};

	return (
		<div className="metadata-editor-component">
			<h6>Metadata</h6>
			{renderFreeformFieldEntry('title')}
			{renderFreeformFieldEntry('description')}
			<h6>Authors</h6>
			{authors.map((author, index) => (
				<ProposedAuthor
					// eslint-disable-next-line react/no-array-index-key
					key={index}
					author={author}
					onUpdateAuthor={(value) => handleUpdateAuthor(index, value)}
				/>
			))}
		</div>
	);
};

MetadataEditor.propTypes = propTypes;
export default MetadataEditor;
