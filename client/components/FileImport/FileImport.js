import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Drawer, Classes, Icon, Callout, Button, Spinner, ButtonGroup } from '@blueprintjs/core';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';

import { apiFetch } from 'utils';
import { pingTask } from 'utils/pingTask';

import FileImportEntry from './FileImportEntry';
import { useFileManager, extensionToPandocFormat } from './useFileManager';
import { importDocToEditor } from './importDocToEditor';

require('./fileImport.scss');

const propTypes = {
	editorChangeObject: PropTypes.shape({
		view: PropTypes.shape({}),
	}).isRequired,
	updateLocalData: PropTypes.func.isRequired,
};

const acceptedFileTypes = [
	...Object.keys(extensionToPandocFormat).map((ext) => `.${ext}`),
	'.bib',
	'image/*',
].join(',');

const getFilesFromEvent = (evt) => {
	return getDroppedOrSelectedFiles(evt).then((list) => {
		return list.map(({ fileObject }) => fileObject);
	});
};

const FileImport = ({ editorChangeObject, updateLocalData }) => {
	const { addFile, getFiles, deleteFileById, labelFileById } = useFileManager();
	const currentFiles = getFiles();
	const hasPendingUploads = currentFiles.some((file) => file.state !== 'complete');
	const hasDocumentToImport = currentFiles.some((file) => file.label === 'document');
	const [importResult, setImportResult] = useState({});
	const [isVisible, setIsVisible] = useState(true);
	const [isImporting, setIsImporting] = useState(false);
	const isImportDisabled = !hasDocumentToImport || hasPendingUploads || isImporting;
	const { doc, warnings = [] } = importResult;

	const handleFinishImport = () => {
		importDocToEditor(editorChangeObject.view, doc, updateLocalData);
		setIsVisible(false);
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
			});
	};

	const renderWarningsOrSuccess = () => {
		if (!doc) {
			return null;
		}
		const missingImages = warnings.filter((w) => w.type === 'missingImage').map((w) => w.path);
		const missingCitations = warnings
			.filter((w) => w.type === 'missingCitation')
			.map((w) => w.id);
		if (missingImages || missingCitations) {
			return (
				<Callout className="import-result" title="Import warnings" intent="warning">
					<ul>
						{missingImages.length > 0 && (
							<li>
								<i>
									Your document contains references to these images, which you may
									wish to upload:
								</i>{' '}
								{missingImages.join(', ')}.
							</li>
						)}
						{missingCitations.length > 0 && (
							<li>
								<i>
									Your document contains references to bibliography entries with
									these IDs:
								</i>{' '}
								{missingCitations.join(', ')}. You may wish to upload a .bib file.
							</li>
						)}
					</ul>
				</Callout>
			);
		}
		return (
			<Callout className="import-result" title="Import succeeded" intent="success">
				You can choose to preview the imported document or complete the import now.
			</Callout>
		);
	};

	return (
		<Drawer
			className="file-import-component"
			title="Import to Pub"
			isOpen={isVisible}
			onClose={() => setIsVisible(false)}
			canOutsideClickClose={false}
		>
			<div className={Classes.DRAWER_BODY}>
				<div className={Classes.DIALOG_BODY}>
					{!isImporting && (
						<Dropzone
							accept={acceptedFileTypes}
							getDataTransferItems={getFilesFromEvent}
							onDrop={(files) => files.map(addFile)}
						>
							{({ getRootProps, getInputProps }) => (
								<div {...getRootProps()} className="drop-area">
									<Icon
										icon="paperclip"
										iconSize={50}
										className="drop-area-icon"
									/>
									Drag files here to upload them (or click to choose)
									<input {...getInputProps()} webkitdirectory="" />
								</div>
							)}
						</Dropzone>
					)}
					{isImporting && (
						<div className="drop-area in-progress">
							<Spinner size={50} className="drop-area-icon" />
							Pandoc is working its magic...
						</div>
					)}
					{renderWarningsOrSuccess()}
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
					<Button large onClick={() => setIsVisible(false)}>
						Cancel
					</Button>
					<Button
						intent={doc ? 'none' : 'primary'}
						icon={doc ? 'refresh' : 'import'}
						large
						onClick={handleStartImportTask}
						disabled={isImportDisabled}
					>
						{doc ? 'Retry import' : 'Import'}
					</Button>
					{doc && (
						<Button
							intent="success"
							icon="tick"
							large
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

FileImport.propTypes = propTypes;
export default FileImport;
