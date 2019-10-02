import React from 'react';
import PropTypes from 'prop-types';
import { Icon, ProgressBar } from '@blueprintjs/core';

const propTypes = {
	file: PropTypes.shape({
		path: PropTypes.string,
		name: PropTypes.string,
	}).isRequired,
	status: PropTypes.oneOfType([
		PropTypes.shape({
			state: 'pending',
		}),
		PropTypes.shape({
			state: 'uploading',
			loaded: PropTypes.number,
			total: PropTypes.number,
		}),
		PropTypes.shape({
			state: 'complete',
			url: PropTypes.string,
		}),
	]).isRequired,
};

require('./fileImportEntry.scss');

const FileImportEntry = (props) => {
	const { file, status } = props;
	const { state, loaded, total } = status;
	const displayTitle = file.path || file.name;
	const displayTitleBreak = Math.max(displayTitle.length - 5, 0);
	const displayTitleStart = displayTitle.slice(0, displayTitleBreak);
	const displayTitleEnd = displayTitle.slice(displayTitleBreak);

	const renderProgressContent = () => {
		if (state === 'complete') {
			return (
				<React.Fragment>
					<Icon icon="tick" />
					Upload complete
				</React.Fragment>
			);
		}
		return <ProgressBar value={state === 'uploading' ? loaded / total : undefined} />;
	};

	return (
		<div className="file-import-entry">
			<div className="file-title">
				<span className="start">{displayTitleStart}</span>
				<span className="end">{displayTitleEnd}</span>
			</div>
			<div className="file-progress">{renderProgressContent()}</div>
		</div>
	);
};

FileImportEntry.propTypes = propTypes;
export default FileImportEntry;
