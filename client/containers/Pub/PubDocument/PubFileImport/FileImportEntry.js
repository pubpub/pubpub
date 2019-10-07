import React from 'react';
import PropTypes from 'prop-types';
import { Icon, ProgressBar, Tag, Button } from '@blueprintjs/core';

const propTypes = {
	file: PropTypes.shape({
		localPath: PropTypes.string,
		state: PropTypes.string,
		loaded: PropTypes.number,
		total: PropTypes.number,
		label: PropTypes.string,
	}).isRequired,
	onSelectAsDocument: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

require('./fileImportEntry.scss');

const FileImportEntry = (props) => {
	const {
		file: { loaded, total, state, localPath, label },
		onDelete,
		onSelectAsDocument,
	} = props;
	const displayTitleBreak = Math.max(localPath.length - 5, 0);
	const displayTitleStart = localPath.slice(0, displayTitleBreak);
	const displayTitleEnd = localPath.slice(displayTitleBreak);

	const renderProgressContent = () => {
		if (state === 'complete') {
			return (
				<React.Fragment>
					<Icon icon="tick" iconSize={14} />
					Uploaded
				</React.Fragment>
			);
		}
		if (state === 'waiting') {
			return 'Ready to upload';
		}
		return (
			<React.Fragment>
				<span className="screenreader-only">
					{Math.round((100 * loaded) / total)}% complete
				</span>
				<ProgressBar value={state === 'uploading' ? loaded / total : undefined} />
			</React.Fragment>
		);
	};

	const renderLabel = () => {
		if (label === 'potential-document') {
			return (
				<Tag interactive onClick={onSelectAsDocument} icon="locate">
					select as document
				</Tag>
			);
		}
		return <Tag intent="success">{label}</Tag>;
	};

	return (
		<div className="file-import-entry">
			<div className="file-title" title={localPath}>
				<span className="start">{displayTitleStart}</span>
				<span className="end">{displayTitleEnd}</span>
				{label && <div className="file-label">{renderLabel()}</div>}
			</div>
			<div className="file-progress">{renderProgressContent()}</div>
			<Button
				onClick={onDelete}
				className="file-delete-button"
				icon="small-cross"
				small
				minimal
			/>
		</div>
	);
};

FileImportEntry.propTypes = propTypes;
export default FileImportEntry;
