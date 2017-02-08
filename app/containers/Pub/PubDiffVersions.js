import React, { PropTypes } from 'react';
import Radium, { Style } from 'radium';
import { browserHistory } from 'react-router';
import { globalStyles } from 'utils/globalStyles';
import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';
import FileDiff from 'components/FileDiff/FileDiff';
import dateFormat from 'dateformat';
import Select from 'react-select';

let styles;

export const PubDiffVersions = React.createClass({
	propTypes: {
		versions: PropTypes.array,
		pathname: PropTypes.string,
		query: PropTypes.object
	},
	
	targetChanged: function(selection) {
		browserHistory.push({
			pathname: this.props.pathname,
			query: { ...this.props.query, target: selection.value } 
		});
	},
	baseChanged: function(selection) {
		browserHistory.push({
			pathname: this.props.pathname,
			query: { ...this.props.query, base: selection.value } 
		});
	},

	filterSelect: function(option, string) {
		const message = option.message ? option.message.toLowerCase() : '';
		const value = option.value ? option.value.toLowerCase() : '';
		const lowercaseString = string ? string.toLowerCase() : '';

		if (message.indexOf(lowercaseString) > -1) { return true; }
		if (value.indexOf(lowercaseString) > -1) { return true; }
		return false;
	},
	renderOption: function(option) {
		return (
			<div>
				<div>{option.label}</div>
				<div>{option.message}</div>
				<div>{dateFormat(option.date, 'mmm dd, yyyy HH:MM')}</div>
			</div>
		);
	},
	buildOption: function(version) {
		return {
			label: version.hash,
			message: version.message,
			date: version.createdAt,
			value: version.hash,
		};
	},

	render: function() {
		const versions = this.props.versions || [];
		const query = this.props.query || {};

		const versionBase = versions.reduce((previous, current)=> {
			if (current.hash === query.base) { return current; }
			return previous;
		}, {});

		const versionTarget = versions.reduce((previous, current)=> {
			if (current.hash === query.target) { return current; }
			return previous;
		}, {});

		const selectionBase = this.buildOption(versionBase);
		const selectionTarget = this.buildOption(versionTarget);

		const allFileNames = {};

		const baseFilesObject = {};
		const baseFiles = versionBase.files || [];
		baseFiles.map((file)=> {
			baseFilesObject[file.name] = file;
			allFileNames[file.name] = true;
		});

		const targetFilesObject = {};
		const targetFiles = versionTarget.files || [];
		targetFiles.map((file)=> {
			targetFilesObject[file.name] = file;
			allFileNames[file.name] = true;
		});

		const options = versions.sort((foo, bar)=> {
			// Sort so that most recent is first in array
			if (foo.createdAt > bar.createdAt) { return -1; }
			if (foo.createdAt < bar.createdAt) { return 1; }
			return 0;
		}).map((version)=> {
			return this.buildOption(version);
		});

		// TODO: Make sure base is always earlier than target
		// Pass in the two files to a component that handles rendering the diff view.

		const changedFilesNames = Object.keys(allFileNames).filter((fileName)=> {
			const baseFile = baseFilesObject[fileName] || {};
			const targetFile = targetFilesObject[fileName] || {};
			return baseFile.hash !== targetFile.hash;
		});

		return (
			<div style={styles.container} className={'diff-page'}>
				<Style rules={{
					'.diff-page .Select': { width: '100%' },
					'.diff-page .Select-control': { borderRadius: '2px 0px 0px 2px'},
				}} />

				<h2>Diff Versions</h2>

				<div style={styles.table}>
					<div style={styles.tableCell}>
						<h6>Base:</h6>
						<Select
							name={'version-selection-base'}
							value={selectionBase}
							options={options}
							onChange={this.baseChanged}
							filterOption={this.filterSelect}
							optionRenderer={this.renderOption}
							clearable={false} />
					</div>

					<div style={styles.tableCell}>
						<h6>Target:</h6>
						<Select
							name={'version-selection-target'}
							value={selectionTarget}
							options={options}
							onChange={this.targetChanged}
							filterOption={this.filterSelect}
							optionRenderer={this.renderOption}
							clearable={false} />
					</div>
				</div>

				<div>
					{changedFilesNames.map((fileName)=> {
						const baseFile = baseFilesObject[fileName] || {};
						const targetFile = targetFilesObject[fileName] || {};
						return <FileDiff key={'fileDiff-' + fileName} baseFile={baseFile} targetFile={targetFile} />;
					})}
				</div>
				

			</div>
		);
	}
});

export default Radium(PubDiffVersions);

styles = {
	container: {
		padding: '1.5em',
	},
	table: {
		display: 'table',
		width: '100%',
	},
	tableCell: {
		width: '50%',
		padding: '0em 1em',
		display: 'table-cell',
	},
	
};
