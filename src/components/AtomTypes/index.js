// export ImageEditor from './Image/ImageEditor';
// export ImageViewer from './Image/ImageViewer';
//
// export MarkdownEditor from './Markdown/MarkdownEditor';
// export MarkdownViewer from './Markdown/MarkdownViewer';
//
// export JupyterEditor from './Jupyter/JupyterEditor';
// export JupyterViewer from './Jupyter/JupyterViewer';
//
// export VideoEditor from './Video/VideoEditor';
// export VideoViewer from './Video/VideoViewer';

import ImageEditor from './Image/ImageEditor';
import ImageViewer from './Image/ImageViewer';

import MarkdownEditor from './Markdown/MarkdownEditor';
import MarkdownViewer from './Markdown/MarkdownViewer';

import JupyterEditor from './Jupyter/JupyterEditor';
import JupyterViewer from './Jupyter/JupyterViewer';

import VideoEditor from './Video/VideoEditor';
import VideoViewer from './Video/VideoViewer';

export default {
	image: {
		editor: ImageEditor,
		viewer: ImageViewer
	},
	markdown: {
		editor: MarkdownEditor,
		viewer: MarkdownViewer
	},
	jupyter: {
		editor: JupyterEditor,
		viewer: JupyterViewer
	},
	video: {
		editor: VideoEditor,
		viewer: VideoViewer
	}
}