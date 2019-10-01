import React, { useState, useRef } from 'react';
import Dropzone from 'react-dropzone';
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
import { s3Upload } from '../../utils';

require('./fileImport.scss');

const acceptedFileTypes = [
	'.bib',
	'.md',
	'.txt',
	'.xml',
	'.odt',
	'.html',
	'.docx',
	'.epub',
	'image/*',
].join(',');

const usePubPubS3Uploader = () => {
	const [filesMap, updateFilesMap] = useState(new Map());

	const updateMap = (file, value) => {
		updateFilesMap((currentMap) => {
			const nextMap = new Map(currentMap);
			nextMap.set(file, value);
			return nextMap;
		});
	};

	const onProgress = (file) => ({ loaded, total }) =>
		updateMap(file, { state: 'uploading', loaded: loaded, total: total });

	const onComplete = (file) => (_, __, ___, filename) =>
		updateMap(file, { state: 'uploaded', filename: filename });

	const addFile = (file) => {
		s3Upload(file, onProgress(file), onComplete(file));
		updateMap(file, { state: 'pending' });
	};

	const getFiles = () => Array.from(filesMap.entries());

	return { addFile: addFile, getFiles: getFiles };
};

const deriveMediaFileMapping = (importedFiles, internalPaths) => {
	const pathToFileMap = new Map();
	const usedFiles = [];
	// First do a pass to scoop up files that have _identical_ paths
	internalPaths.forEach((path) => {
		const matchingFile = importedFiles.find(
			(file) => file.webkitRelativePath === path && !usedFiles.includes(file),
		);
		if (matchingFile) {
			usedFiles.push(matchingFile);
			pathToFileMap.set(path, matchingFile);
		}
	});
};

const getFilesFromEvent = (evt) => {
	return getDroppedOrSelectedFiles(evt).then((list) => {
		return list.map(({ fileObject }) => fileObject);
	});
};

const FileImport = () => {
	const { addFile, getFiles } = usePubPubS3Uploader();
	console.log(getFiles());
	return (
		<div className="file-import-component">
			<Dropzone
				accept={acceptedFileTypes}
				getDataTransferItems={getFilesFromEvent}
				onDrop={(files) => files.map(addFile)}
			>
				{({ getRootProps, getInputProps }) => (
					<div {...getRootProps()} className="drop-area">
						Throw some files in here lad
						<input {...getInputProps()} webkitdirectory="" />
					</div>
				)}
			</Dropzone>
		</div>
	);
};

export default FileImport;
