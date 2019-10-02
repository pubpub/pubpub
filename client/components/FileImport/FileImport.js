import React, { useEffect } from 'react';
import Dropzone from 'react-dropzone';
import { Drawer, Classes, Icon, Callout } from '@blueprintjs/core';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';

import { apiFetch } from 'utils';
import { pingTask } from 'utils/pingTask';

import FileImportEntry from './FileImportEntry';
import { useFileManager, extensionToPandocFormat } from './useFileManager';

require('./fileImport.scss');

const acceptedFileTypes = [
	...Object.keys(extensionToPandocFormat).map((ext) => `.${ext}`),
	'image/*',
].join(',');

const getFilesFromEvent = (evt) => {
	return getDroppedOrSelectedFiles(evt).then((list) => {
		return list.map(({ fileObject }) => fileObject);
	});
};

const FileImport = () => {
	const { addFile, getFiles, deleteFileById, labelFileById } = useFileManager();
	const currentFiles = getFiles();
	const readyToAutoStart =
		currentFiles.length > 0 && currentFiles.every((file) => file.state === 'complete');

	useEffect(() => {
		if (readyToAutoStart) {
			apiFetch('/api/import', {
				method: 'POST',
				body: JSON.stringify({
					sourceFiles: currentFiles,
					useNewImporter: true,
				}),
			}).then((taskId) => pingTask(taskId, 1000));
		}
	}, [currentFiles, readyToAutoStart]);

	return (
		<Drawer className="file-import-component" title="Import to Pub" isOpen={true}>
			<div className={Classes.DRAWER_BODY}>
				<div className={Classes.DIALOG_BODY}>
					<Dropzone
						accept={acceptedFileTypes}
						getDataTransferItems={getFilesFromEvent}
						onDrop={(files) => files.map(addFile)}
					>
						{({ getRootProps, getInputProps }) => (
							<div {...getRootProps()} className="drop-area">
								<Icon icon="paperclip" iconSize={50} className="drop-area-icon" />
								Drag files here to upload them (or click to choose)
								<input {...getInputProps()} webkitdirectory="" />
							</div>
						)}
					</Dropzone>
					<Callout className="import-warnings" title="Import warnings" intent="warning">
						<ul>
							<li>You're bad</li>
							<li>You should feel bad</li>
						</ul>
					</Callout>
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
		</Drawer>
	);
};

export default FileImport;
