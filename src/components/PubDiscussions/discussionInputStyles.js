const editorStyles = {};
editorStyles.fontFamily = 'Arial';
editorStyles.fontSize = '15px';
editorStyles.cursorColor = '#000';
editorStyles.color = '#555';
editorStyles.colorHeader = '#676767';
editorStyles.colorTitle = '#575757';
editorStyles.colorPPM = '#474747';
editorStyles.colorCite = '#171717';


export const codeMirrorStyles = {
	'.CodeMirror': {
		backgroundColor: 'transparent',
		fontSize: editorStyles.fontSize,
		color: editorStyles.color,
		fontFamily: editorStyles.fontFamily,
		padding: '0px 20px',
		width: 'calc(100% - 40px)',
		// fontFamily: 'Alegreya',
	},
	'.CodeMirror-measure': {
		position: 'absolute',
		width: '100%',
		height: '0',
		overflow: 'hidden',
		visibility: 'hidden',
	},
	'.CodeMirror-cursors': {
		pointerEvents: 'none',
	},
	'.CodeMirror-cursor': {
		borderLeft: '1px solid ' + editorStyles.cursorColor,
	},
	'.cm-s-default .cm-header': {
		color: editorStyles.colorHeader,
	},
	'.cm-header-1': {
		fontSize: '20px',
	},
	'.cm-header-2': {
		fontSize: '18px',
	},
	'.cm-header-3': {
		fontSize: '16px',
	},
	'.cm-ppm': {
		color: editorStyles.colorPPM,
	},
	'.cm-ppm-title': {
		fontSize: '23px',
		color: editorStyles.colorTitle,
		fontWeight: 'bold',
	},
	'.cm-ppm-abstract': {
		fontSize: '16px',
	},
	'.cm-ppm-authorsNote': {
		fontSize: '14px',
	},
	'.cm-ppm-cite': {
		color: editorStyles.colorCite,
	},
	'.cm-plugin': {
		cursor: 'pointer',
		borderRadius: '2px',
		color: '#555',
	},
	'.cm-plugin-image': {
		backgroundColor: '#DAE8F8',
	},
	'.cm-plugin-video': {
		backgroundColor: '#DAF8E3',
	},
	'.cm-plugin-audio': {
		backgroundColor: '#F8ECDA',
	},
	'.cm-plugin-table': {
		backgroundColor: '#F1DAF8',
	},
};
