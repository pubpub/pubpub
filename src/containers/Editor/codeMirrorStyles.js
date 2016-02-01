// CodeMirror styles function can be
// used to dynamically change font, size, color, etc
export function codeMirrorStyles(loginData) {
	const editorFont = loginData ? loginData.getIn(['userData', 'settings', 'editorFont']) : undefined;
	const editorFontSize = loginData ? loginData.getIn(['userData', 'settings', 'editorFontSize']) : undefined;
	const editorColor = loginData ? loginData.getIn(['userData', 'settings', 'editorColor']) : undefined;

	const editorStyles = {};

	switch (editorFont) {
	case 'serif':
		editorStyles.fontFamily = 'Helvetica Neue,Helvetica,Arial,sans-serif';
		break;
	case 'sans-serif':
		editorStyles.fontFamily = 'Lato';
		break;
	case 'mono':
		editorStyles.fontFamily = 'Courier';
		break;
	default:
		editorStyles.fontFamily = 'Courier';
		break;
	}

	switch (editorFontSize) {
	case 'small':
		editorStyles.fontSize = '11px';
		break;
	case 'medium':
		editorStyles.fontSize = '15px';
		break;
	case 'large':
		editorStyles.fontSize = '19px';
		break;
	default:
		editorStyles.fontSize = '15px';
		break;
	}

	switch (editorColor) {
	case 'light':
		editorStyles.cursorColor = '#000';
		editorStyles.color = '#555';
		editorStyles.colorHeader = '#676767';
		editorStyles.colorTitle = '#575757';
		editorStyles.colorPPM = '#474747';
		editorStyles.colorCite = '#171717';
		editorStyles.colorPagebreak = '#aaa';
		break;
	case 'dark':
		editorStyles.cursorColor = '#fff';
		editorStyles.color = '#ddd';
		editorStyles.colorHeader = '#bbb';
		editorStyles.colorTitle = '#ccc';
		editorStyles.colorPPM = '#eee';
		editorStyles.colorCite = '#fff';
		editorStyles.colorPagebreak = '#555';
		break;
	default:
		editorStyles.cursorColor = '#000';
		editorStyles.color = '#555';
		editorStyles.colorHeader = '#676767';
		editorStyles.colorTitle = '#575757';
		editorStyles.colorPPM = '#474747';
		editorStyles.colorCite = '#171717';
		editorStyles.colorPagebreak = '#aaa';
		break;
	}

	return {
		'.CodeMirror': {
			backgroundColor: 'transparent',
			fontSize: editorStyles.fontSize,
			color: editorStyles.color,
			fontFamily: editorStyles.fontFamily,
			padding: '0px 20px',
			width: 'calc(100% - 40px)',
			// fontFamily: 'Alegreya',
		},
		'.CodeMirror-cursors': {
			pointerEvents: 'none',
		},
		'.CodeMirror-cursor': {
			borderLeft: '1px solid ' + editorStyles.cursorColor,
		},
		'.CodeMirror .cm-spell-error': {
			borderBottom: '1px dotted red',
		},
		'.CodeMirror pre.CodeMirror-placeholder': {
			color: '#999',
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
			fontSize: '16px',
		},
		'.cm-ppm-math': {
			fontStyle: 'italic',
		},
		'.cm-plugin': {
			cursor: 'pointer',
			borderRadius: '2px',
			color: '#555',
		},
		'.cm-ppm-pagebreak': {
			color: editorStyles.colorPagebreak,
			fontSize: '16px',
		},
		'.cm-plugin-image': {
			backgroundColor: 'rgba(185, 215, 249, 0.5)',
		},
		'.cm-plugin-video': {
			backgroundColor: 'rgba(158, 219, 176, 0.5)',
		},
		'.cm-plugin-audio': {
			backgroundColor: 'rgba(233, 201, 153, 0.5)',
		},
		'.cm-plugin-table': {
			backgroundColor: 'rgba(211, 172, 223, 0.5)',
		},
		'.cm-plugin-cite': {
			backgroundColor: 'rgba(245, 245, 169, 0.5)',
		},
		'.cm-plugin-quote': {
			backgroundColor: 'rgba(245, 245, 169, 0.5)',
		},
		'.cm-plugin-iframe': {
			backgroundColor: 'rgba(233, 201, 153, 0.5);',
		},
	};
}

export const codeMirrorStyleClasses = {
	'.pagebreak': {
		opacity: '1', // Alternatively, instead of using !important, we could pass a variable to PubBody that differentiates whether we're in the Reader or Editor and toggle the pagebreak opacity accordingly.
	},
	'.firepad-userlist-user': {
		height: '30px',
		overflow: 'hidden',
		display: 'inline-block',
		position: 'relative',
	},
	'.firepad-userlist-user:hover': {
		overflow: 'visible',
	},
	'.firepad-userlist-image': {
		height: '20px',
		padding: '5px',
	},
	'.firepad-userlist-color-indicator': {
		position: 'absolute',
		height: '3px',
		bottom: '2px',
		left: '5px',
		width: '20px',
	},
	'.firepad-userlist-name': {
		position: 'absolute',
		width: '250px',
		left: '-110px',
		textAlign: 'center',
		bottom: '-20px',
		height: '20px',
		lineHeight: '20px',
		backgroundColor: '#F5F5F5',
	},
};
