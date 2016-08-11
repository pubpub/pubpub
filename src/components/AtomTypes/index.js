import ImageEditor from './Image/ImageEditor';
import ImageViewer from './Image/ImageViewer';

import DocumentEditor from './Document/DocumentEditor';
import DocumentViewer from './Document/DocumentViewer';

import JupyterEditor from './Jupyter/JupyterEditor';
import JupyterViewer from './Jupyter/JupyterViewer';

import VideoEditor from './Video/VideoEditor';
import VideoViewer from './Video/VideoViewer';

import IFrameEditor from './IFrame/IFrameEditor';
import IFrameViewer from './IFrame/IFrameViewer';

import LaTeXEditor from './LaTeX/LaTeXEditor';
import LaTeXViewer from './LaTeX/LaTeXViewer';

import TableEditor from './Table/TableEditor';
import TableViewer from './Table/TableViewer';

import ReferenceEditor from './Reference/ReferenceEditor';
import ReferenceViewer from './Reference/ReferenceViewer';

import HighlightEditor from './Highlight/HighlightEditor';
import HighlightViewer from './Highlight/HighlightViewer';

import PDFEditor from './PDF/PDFEditor';
import PDFViewer from './PDF/PDFViewer';

import EmbedEditor from './Embed/EmbedEditor';
import EmbedViewer from './Embed/EmbedViewer';

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
	},
	iframe: {
		editor: IFrameEditor,
		viewer: IFrameViewer
	},
	latex: {
		editor: LaTeXEditor,
		viewer: LaTeXViewer
	},
	table: {
		editor: TableEditor,
		viewer: TableViewer
	},
	reference: {
		editor: ReferenceEditor,
		viewer: ReferenceViewer
	},
	highlight: {
		editor: HighlightEditor,
		viewer: HighlightViewer
	},
	pdf: {
		editor: PDFEditor,
		viewer: PDFViewer
	},
	embed: {
		editor: EmbedEditor,
		viewer: EmbedViewer
	}
};
