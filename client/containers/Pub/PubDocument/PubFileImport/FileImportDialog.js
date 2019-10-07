import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Button, ButtonGroup, Callout, Classes, Drawer, Icon, Spinner } from '@blueprintjs/core';

import { apiFetch } from 'utils';
import { pingTask } from 'utils/pingTask';

import FileImportEntry from './FileImportEntry';
import { useFileManager, extensionToPandocFormat } from './useFileManager';
import { importDocToEditor } from './importDocToEditor';

require('./fileImportDialog.scss');

const propTypes = {
	editorChangeObject: PropTypes.shape({
		view: PropTypes.shape({}),
	}).isRequired,
	updateLocalData: PropTypes.func.isRequired,
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
};

const acceptedFileTypes = [
	...Object.keys(extensionToPandocFormat).map((ext) => `.${ext}`),
	'.bib',
	'image/*',
].join(',');

const getFingerprintOfImportedFiles = (currentFiles) =>
	currentFiles
		.map((file) => file.localPath)
		.sort((a, b) => a - b)
		.join('');

const FileImportDialog = ({ editorChangeObject, updateLocalData, isOpen, onClose }) => {
	const { addFile, getFiles, deleteFileById, labelFileById } = useFileManager();
	const currentFiles = getFiles();
	const hasPendingUploads = currentFiles.some((file) => file.state !== 'complete');
	const hasDocumentToImport = currentFiles.some((file) => file.label === 'document');
	const [importResult, setImportResult] = useState({});
	const [isImporting, setIsImporting] = useState(false);
	const [lastImportedFiles, setLastImportedFiles] = useState('');
	const importedFilesMatchCurrentFiles =
		!!importResult && lastImportedFiles === getFingerprintOfImportedFiles(currentFiles);
	const isImportDisabled = !hasDocumentToImport || hasPendingUploads || isImporting;
	const { doc, warnings = [], error } = importResult;

	const handleFinishImport = () => {
		importDocToEditor(editorChangeObject.view, doc, updateLocalData);
		onClose();
	};

	const handleStartImportTask = () => {
		setIsImporting(true);
		apiFetch('/api/import', {
			method: 'POST',
			body: JSON.stringify({
				sourceFiles: currentFiles,
				useNewImporter: true,
			}),
		})
			.then((taskId) => pingTask(taskId, 1000))
			.then((result) => {
				setIsImporting(false);
				setImportResult(result);
				setLastImportedFiles(getFingerprintOfImportedFiles(currentFiles));
			});
	};

	const renderContentInDropzone = (fn) => {
		return (
			<Dropzone
				accept={acceptedFileTypes}
				onDrop={(files) => files.map(addFile)}
				children={fn}
			/>
		);
	};

	const renderImportResult = () => {
		if (error) {
			return (
				<Callout className="import-result" title="Import error" intent="danger">
					{error.toString()}
				</Callout>
			);
		}
		if (doc) {
			const missingImages = warnings
				.filter((w) => w.type === 'missingImage')
				.map((w) => w.path);
			const missingCitations = warnings
				.filter((w) => w.type === 'missingCitation')
				.map((w) => w.id);

			if (missingImages.length > 0 || missingCitations.length > 0) {
				return (
					<Callout className="import-result" title="Import warnings" intent="warning">
						<ul>
							{missingImages.length > 0 && (
								<li>
									<i>
										Your document contains references to these images, which you
										may wish to upload:
									</i>{' '}
									{missingImages.join(', ')}.
								</li>
							)}
							{missingCitations.length > 0 && (
								<li>
									<i>
										Your document contains references to bibliography entries
										with these IDs:
									</i>{' '}
									{missingCitations.join(', ')}. You may wish to upload a .bib
									file.
								</li>
							)}
						</ul>
					</Callout>
				);
			}
			return <Callout className="import-result" title="Import succeeded" intent="success" />;
		}
		return null;
	};

	return (
		<Drawer
			className="file-import-dialog-component"
			title="Import to Pub"
			isOpen={isOpen}
			onClose={onClose}
			canOutsideClickClose={false}
		>
			<div className={Classes.DRAWER_BODY}>
				<div className={Classes.DIALOG_BODY}>
					{!isImporting &&
						renderContentInDropzone(({ getRootProps, getInputProps }) => (
							<div {...getRootProps()} className="drop-area">
								<Icon icon="paperclip" iconSize={50} className="drop-area-icon" />
								Click here or drag in files to upload them
								<div className="supported-documents">
									Supports documents as .docx, .epub, .html, .md, .odt, .txt,
									.xml, or .tex files.
								</div>
								<input {...getInputProps()} multiple />
							</div>
						))}
					{!isImporting &&
						renderContentInDropzone(({ getRootProps, getInputProps }) => (
							<div {...getRootProps()} className="drop-area directory-drop-area">
								Or, click here to upload an entire directory
								<input {...getInputProps()} webkitdirectory="" />
							</div>
						))}
					{isImporting && (
						<div className="drop-area in-progress">
							<Spinner size={50} className="drop-area-icon" />
							Importing your document...
						</div>
					)}
					{renderImportResult()}
					<div className="files-listing">
						{currentFiles.map((file, index) => (
							<FileImportEntry
								// eslint-disable-next-line react/no-array-index-key
								key={index}
								file={file}
								onDelete={() => deleteFileById(file.id)}
								onSelectAsDocument={() => labelFileById(file.id, 'document')}
							/>
						))}
					</div>
				</div>
			</div>
			<div className={Classes.DRAWER_FOOTER}>
				<ButtonGroup>
					<Button onClick={onClose}>Cancel</Button>
					{(!doc || !importedFilesMatchCurrentFiles) && (
						<Button
							intent="primary"
							icon={doc ? 'refresh' : 'import'}
							onClick={handleStartImportTask}
							disabled={isImportDisabled}
						>
							{doc ? 'Retry import' : 'Import'}
						</Button>
					)}
					{doc && importedFilesMatchCurrentFiles && (
						<Button
							intent="success"
							icon="tick"
							onClick={handleFinishImport}
							disabled={isImporting}
						>
							Complete import
						</Button>
					)}
				</ButtonGroup>
			</div>
		</Drawer>
	);
};

FileImportDialog.propTypes = propTypes;
export default FileImportDialog;
