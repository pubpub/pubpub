import ImageEditor from './Image/ImageEditor';
import ImageViewer from './Image/ImageViewer';

import DocumentEditor from './Document/DocumentEditor';
import DocumentViewer from './Document/DocumentViewer';

import JupyterEditor from './Jupyter/JupyterEditor';
import JupyterViewer from './Jupyter/JupyterViewer';

import VideoEditor from './Video/VideoEditor';
import VideoViewer from './Video/VideoViewer';

export default {
	image: {
		editor: ImageEditor,
		viewer: ImageViewer
	},
	document: {
		editor: DocumentEditor,
		viewer: DocumentViewer
	},
	jupyter: {
		editor: JupyterEditor,
		viewer: JupyterViewer
	},
	video: {
		editor: VideoEditor,
		viewer: VideoViewer
	}
};
