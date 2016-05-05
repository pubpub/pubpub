// CodeMirror styles function can be
// used to dynamically change font, size, color, etc
import Plugins from 'components/Markdown/MarkdownPlugins';

export function codeMirrorStyles(loginData, parentClass) {
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
		editorStyles.color = '#2C2A2B';
		editorStyles.colorHeader = '#474747';
		// editorStyles.colorTitle = '#575757';
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
		editorStyles.colorPagebreak = '#333';
		break;
	default:
		editorStyles.cursorColor = '#000';
		editorStyles.color = '#2C2A2B';
		editorStyles.colorHeader = '#474747';
		// editorStyles.colorTitle = '#575757';
		editorStyles.colorPPM = '#474747';
		editorStyles.colorCite = '#171717';
		editorStyles.colorPagebreak = '#aaa';
		break;
	}

	const pluginStyles = {};

	for (const pluginKey in Plugins) {
		if (Plugins.hasOwnProperty(pluginKey)) {
			const plugin = Plugins[pluginKey];
			if (plugin.Config.color) {
				pluginStyles[`.cm-plugin-${pluginKey}`] = { backgroundColor: plugin.Config.color };
			}
		}
	}

	const output = {
		...pluginStyles,
		'.CodeMirror': {
			backgroundColor: 'transparent',
			// backgroundColor: 'white',
			fontSize: editorStyles.fontSize,
			color: editorStyles.color,
			fontFamily: editorStyles.fontFamily,
			padding: '0px 20px',
			width: 'calc(100% - 40px)',
			lineHeight: '1.75',
		},

		// '.editor-container.editor-preview .CodeMirror': {
		// 	backgroundColor: '#F3F3F4',
		// 	marginTop: '0px',
		// 	padding: '20px 20px 0px 20px',
		// },
		// '.editor-container .CodeMirror-scroll': {
		// 	overflow: 'hidden !important',
		// },
		'.CodeMirror-cursors': {
			pointerEvents: 'none',
		},
		'.CodeMirror-cursor': {
			borderLeft: parentClass ? '1px solid ' + editorStyles.cursorColor : '3px solid ' + editorStyles.cursorColor,
		},
		'.CodeMirror .cm-spell-error': {
			borderBottom: '1px dotted red',
		},
		'.CodeMirror .cm-comment': {
			color: 'inherit',
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
		'.cm-pubheadertitle': {
			fontSize: '26px',
			color: editorStyles.colorHeader,
			fontWeight: 'bold',
		},
		'.cm-pubheaderkey': {
			fontSize: '15px',
			color: editorStyles.colorHeader,
			fontWeight: 'bold',
		},
		// '.cm-ppm-abstract': {
		// 	fontSize: '16px',
		// },
		// '.cm-ppm-authorsNote': {
		// 	fontSize: '16px',
		// },
		'.cm-ppm-math': {
			fontStyle: 'italic',
		},
		'.cm-plugin': {
			cursor: 'pointer',
			borderRadius: '2px',
			color: '#333',
			fontFamily: 'Courier',
		},
		'.cm-ppm-pagebreak': {
			color: editorStyles.colorPagebreak,
			fontSize: '16px',
		},
		'.cm-plugin-audio': {
			backgroundColor: 'rgba(233, 201, 153, 0.5)',
		},
		'.cm-plugin-table': {
			backgroundColor: 'rgba(211, 172, 223, 0.5)',
		},
		'.cm-plugin-iframe': {
			backgroundColor: 'rgba(233, 201, 153, 0.5);',
		},
	};

	if (parentClass) {
		for (const key in output) {
			if (output.hasOwnProperty(key)) {
				output[parentClass + ' ' + key] = output[key];
				delete output[key];
			}
		}
	}

	return output;
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
		bottom: '-21px',
		height: '20px',
		lineHeight: '20px',
		backgroundColor: '#F5F5F5',
	},
	// 'body div #editor-text-wrapper .CodeMirror-code pre:first-of-type': {
	// 	borderBottom: '1px solid rgba(0,0,0,0.2)',
	// 	fontSize: '33px',
	// 	fontWeight: 'bold',
	// },
	'.menuItem-saveStatus': {
		fontFamily: 'Courier',
		fontSize: '15px',
		paddingTop: '2px !important',
		color: '#AAA',
	},
};
