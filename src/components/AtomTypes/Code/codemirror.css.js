export default {
	'.CodeMirror': {
		fontFamily: 'monospace',
		height: 'auto',
		color: 'black',
		position: 'relative',
		overflow: 'hidden',
		background: 'white'
	},
	'.CodeMirror-lines': {
		padding: '4px 0',
		cursor: 'text',
		minHeight: 1
	},
	'.CodeMirror pre': {
		padding: '0 4px',
		MozBorderRadius: 0,
		WebkitBorderRadius: 0,
		borderRadius: 0,
		borderWidth: 0,
		background: 'transparent',
		fontFamily: 'inherit',
		fontSize: 'inherit',
		margin: 0,
		whiteSpace: 'pre',
		wordWrap: 'normal',
		lineHeight: 'inherit',
		color: 'inherit',
		zIndex: 2,
		position: 'relative',
		overflow: 'visible',
		WebkitTapHighlightColor: 'transparent',
		WebkitFontVariantLigatures: 'none',
		fontVariantLigatures: 'none'
	},
	'.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler': {
		backgroundColor: 'white'
	},
	'.CodeMirror-gutters': {
		borderRight: '1px solid #ddd',
		backgroundColor: '#f7f7f7',
		whiteSpace: 'nowrap',
		position: 'absolute',
		left: 0,
		top: 0,
		minHeight: '100%',
		zIndex: 3
	},
	'.CodeMirror-linenumbers': {},
	'.CodeMirror-linenumber': {
		padding: '0 3px 0 5px',
		minWidth: 20,
		textAlign: 'right',
		color: '#999',
		whiteSpace: 'nowrap'
	},
	'.CodeMirror-guttermarker': {
		color: 'black'
	},
	'.CodeMirror-guttermarker-subtle': {
		color: '#999'
	},
	'.CodeMirror-cursor': {
		borderLeft: '1px solid black',
		borderRight: 'none',
		width: 0,
		position: 'absolute',
		pointerEvents: 'none'
	},
	'.CodeMirror div.CodeMirror-secondarycursor': {
		borderLeft: '1px solid silver'
	},
	'.cm-fat-cursor .CodeMirror-cursor': {
		width: 'auto',
		border: 0,
		background: '#7e7'
	},
	'.cm-fat-cursor div.CodeMirror-cursors': {
		zIndex: 1
	},
	'.cm-animate-fat-cursor': {
		width: 'auto',
		border: 0,
		WebkitAnimation: 'blink 1.06s steps(1) infinite',
		MozAnimation: 'blink 1.06s steps(1) infinite',
		animation: 'blink 1.06s steps(1) infinite',
		backgroundColor: '#7e7'
	},
	'.CodeMirror-overwrite .CodeMirror-cursor': {},
	'.cm-tab': {
		display: 'inline-block',
		textDecoration: 'inherit'
	},
	'.CodeMirror-rulers': {
		position: 'absolute',
		left: 0,
		right: 0,
		top: -50,
		bottom: -20,
		overflow: 'hidden'
	},
	'.CodeMirror-ruler': {
		borderLeft: '1px solid #ccc',
		top: 0,
		bottom: 0,
		position: 'absolute'
	},
	'.cm-s-default .cm-header': {
		color: 'blue'
	},
	'.cm-s-default .cm-quote': {
		color: '#090'
	},
	'.cm-negative': {
		color: '#d44'
	},
	'.cm-positive': {
		color: '#292'
	},
	'.cm-header, .cm-strong': {
		fontWeight: 'bold'
	},
	'.cm-em': {
		fontStyle: 'italic'
	},
	'.cm-link': {
		textDecoration: 'underline'
	},
	'.cm-strikethrough': {
		textDecoration: 'line-through'
	},
	'.cm-s-default .cm-keyword': {
		color: '#708'
	},
	'.cm-s-default .cm-atom': {
		color: '#219'
	},
	'.cm-s-default .cm-number': {
		color: '#164'
	},
	'.cm-s-default .cm-def': {
		color: '#00f'
	},
	'.cm-s-default .cm-variable, .cm-s-default .cm-punctuation, .cm-s-default .cm-property, .cm-s-default .cm-operator': {},
	'.cm-s-default .cm-variable-2': {
		color: '#05a'
	},
	'.cm-s-default .cm-variable-3': {
		color: '#085'
	},
	'.cm-s-default .cm-comment': {
		color: '#a50'
	},
	'.cm-s-default .cm-string': {
		color: '#a11'
	},
	'.cm-s-default .cm-string-2': {
		color: '#f50'
	},
	'.cm-s-default .cm-meta': {
		color: '#555'
	},
	'.cm-s-default .cm-qualifier': {
		color: '#555'
	},
	'.cm-s-default .cm-builtin': {
		color: '#30a'
	},
	'.cm-s-default .cm-bracket': {
		color: '#997'
	},
	'.cm-s-default .cm-tag': {
		color: '#170'
	},
	'.cm-s-default .cm-attribute': {
		color: '#00c'
	},
	'.cm-s-default .cm-hr': {
		color: '#999'
	},
	'.cm-s-default .cm-link': {
		color: '#00c'
	},
	'.cm-s-default .cm-error': {
		color: '#f00'
	},
	'.cm-invalidchar': {
		color: '#f00'
	},
	'.CodeMirror-composing': {
		borderBottom: '2px solid'
	},
	'div.CodeMirror span.CodeMirror-matchingbracket': {
		color: '#0f0'
	},
	'div.CodeMirror span.CodeMirror-nonmatchingbracket': {
		color: '#f22'
	},
	'.CodeMirror-matchingtag': {
		background: 'rgba(255, 150, 0, .3)'
	},
	'.CodeMirror-activeline-background': {
		background: '#e8f2ff'
	},
	'.CodeMirror-scroll': {
		overflow: 'scroll',
		marginBottom: -30,
		marginRight: -30,
		paddingBottom: 30,
		height: '100%',
		outline: 'none',
		position: 'relative'
	},
	'.CodeMirror-sizer': {
		position: 'relative',
		borderRight: '30px solid transparent'
	},
	'.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler': {
		position: 'absolute',
		zIndex: 6,
		display: 'none'
	},
	'.CodeMirror-vscrollbar': {
		right: 0,
		top: 0,
		overflowX: 'hidden',
		overflowY: 'scroll'
	},
	'.CodeMirror-hscrollbar': {
		bottom: 0,
		left: 0,
		overflowY: 'hidden',
		overflowX: 'scroll'
	},
	'.CodeMirror-scrollbar-filler': {
		right: 0,
		bottom: 0
	},
	'.CodeMirror-gutter-filler': {
		left: 0,
		bottom: 0
	},
	'.CodeMirror-gutter': {
		whiteSpace: 'normal',
		height: '100%',
		display: 'inline',
		verticalAlign: 'top',
		marginBottom: -30,
		zoom: 1
	},
	'.CodeMirror-gutter-wrapper': {
		position: 'absolute',
		zIndex: 4,
		background: 'none',
		border: 'none',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		userSelect: 'none'
	},
	'.CodeMirror-gutter-background': {
		position: 'absolute',
		top: 0,
		bottom: 0,
		zIndex: 4
	},
	'.CodeMirror-gutter-elt': {
		position: 'absolute',
		cursor: 'default',
		zIndex: 4
	},
	'.CodeMirror-wrap pre': {
		wordWrap: 'break-word',
		whiteSpace: 'pre-wrap',
		wordBreak: 'normal'
	},
	'.CodeMirror-linebackground': {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		zIndex: 0
	},
	'.CodeMirror-linewidget': {
		position: 'relative',
		zIndex: 2,
		overflow: 'auto'
	},
	'.CodeMirror-widget': {},
	'.CodeMirror-code': {
		outline: 'none'
	},
	'.CodeMirror-scroll, .CodeMirror-sizer, .CodeMirror-gutter, .CodeMirror-gutters, .CodeMirror-linenumber': {
		MozBoxSizing: 'content-box',
		boxSizing: 'content-box'
	},
	'.CodeMirror-measure': {
		position: 'absolute',
		width: '100%',
		height: 0,
		overflow: 'hidden',
		visibility: 'hidden'
	},
	'.CodeMirror-measure pre': {
		position: 'static'
	},
	'div.CodeMirror-cursors': {
		visibility: 'hidden',
		position: 'relative',
		zIndex: 3
	},
	'div.CodeMirror-dragcursors': {
		visibility: 'visible'
	},
	'.CodeMirror-focused div.CodeMirror-cursors': {
		visibility: 'visible'
	},
	'.CodeMirror-selected': {
		background: '#d9d9d9'
	},
	'.CodeMirror-focused .CodeMirror-selected': {
		background: '#d7d4f0'
	},
	'.CodeMirror-crosshair': {
		cursor: 'crosshair'
	},
	'.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection': {
		background: '#d7d4f0'
	},
	'.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection': {
		background: '#d7d4f0'
	},
	'.cm-searching': {
		background: 'rgba(255, 255, 0, .4)'
	},
	'.CodeMirror span': {
		verticalAlign: 'text-bottom'
	},
	'.cm-force-border': {
		paddingRight: NaN
	},
	mediaQueries: {
		print: {
			'.CodeMirror div.CodeMirror-cursors': {
				visibility: 'hidden'
			}
		}
	},
	'.cm-tab-wrap-hack:after': {
		content: '\'\''
	},
	'span.CodeMirror-selectedtext': {
		background: 'none'
	}
}