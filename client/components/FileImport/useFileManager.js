import { useState } from 'react';

import { s3Upload } from '../../utils';

let fileIdCounter = 0;

export const extensionToPandocFormat = {
	docx: 'docx',
	epub: 'epub',
	html: 'html',
	md: 'markdown_strict',
	odt: 'odt',
	txt: 'plain',
	xml: 'jats',
	tex: 'latex',
};

const extensionOf = (fileName) => {
	const pieces = fileName.split('.');
	return pieces[pieces.length - 1];
};

const fileIsValidDocument = (file) =>
	Object.keys(extensionToPandocFormat).includes(extensionOf(file.localPath));

const labelFiles = (files) => {
	const bibliography =
		files.find((file) => file.label === 'bibliography') ||
		files.find((file) => extensionOf(file.localPath) === 'bib');
	const target =
		files.find((file) => file.label === 'document') || files.find(fileIsValidDocument);
	return files.map((file) => {
		if (file === target) {
			return { ...file, label: 'document' };
		}
		if (fileIsValidDocument(file)) {
			return { ...file, label: 'potential-document' };
		}
		if (file === bibliography) {
			return { ...file, label: 'bibliography' };
		}
		return file;
	});
};

export const useFileManager = () => {
	const [files, setFiles] = useState([]);

	const updateFileById = (fileId, value) =>
		setFiles((currentFiles) =>
			labelFiles(
				currentFiles.some((file) => file.id === fileId)
					? currentFiles.map((file) => {
							if (file.id === fileId) {
								return { ...file, ...value };
							}
							return file;
					  })
					: [...currentFiles, value],
			),
		);

	const labelFileById = (fileId, newLabel) =>
		setFiles((currentFiles) =>
			labelFiles(
				currentFiles.map((file) => {
					const { label } = file;
					const nextLabel =
						fileId === file.id ? newLabel : label === newLabel ? null : label;
					return { ...file, label: nextLabel };
				}),
			),
		);

	const deleteFileById = (fileId) =>
		setFiles((currentFiles) => labelFiles(currentFiles.filter((file) => file.id !== fileId)));

	const onProgress = (fileId) => ({ loaded, total }) =>
		updateFileById(fileId, { state: 'uploading', loaded: loaded, total: total });

	const onComplete = (fileId) => (_, __, ___, url) =>
		updateFileById(fileId, { state: 'complete', url: url });

	const addFile = (file) => {
		const fileId = fileIdCounter;
		const localPath = file.path || file.name;
		fileIdCounter += 1;
		s3Upload(file, onProgress(fileId), onComplete(fileId));
		updateFileById(fileId, { id: fileId, state: 'waiting', localPath: localPath });
	};

	const getFiles = () => files;

	return {
		addFile: addFile,
		getFiles: getFiles,
		deleteFileById: deleteFileById,
		labelFileById: labelFileById,
	};
};
