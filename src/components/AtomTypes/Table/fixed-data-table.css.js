export default {
	'.fixedDataTableCellGroupLayout_cellGroup': {
		WebkitBackfaceVisibility: 'hidden',
		backfaceVisibility: 'hidden',
		left: 0,
		overflow: 'hidden',
		position: 'absolute',
		top: 0,
		whiteSpace: 'nowrap'
	},
	'.fixedDataTableCellGroupLayout_cellGroup>.public_fixedDataTableCell_main': {
		display: 'inline-block',
		verticalAlign: 'top',
		whiteSpace: 'normal'
	},
	'.fixedDataTableCellGroupLayout_cellGroupWrapper': {
		position: 'absolute',
		top: 0
	},
	'.fixedDataTableCellLayout_main': {
		borderRightStyle: 'solid',
		borderWidth: '0 1px 0 0',
		boxSizing: 'border-box',
		display: 'block',
		overflow: 'hidden',
		position: 'absolute',
		whiteSpace: 'normal'
	},
	'.fixedDataTableCellLayout_lastChild': {
		borderWidth: '0 1px 1px 0'
	},
	'.fixedDataTableCellLayout_alignRight': {
		textAlign: 'right'
	},
	'.fixedDataTableCellLayout_alignCenter': {
		textAlign: 'center'
	},
	'.fixedDataTableCellLayout_wrap1': {
		display: 'table'
	},
	'.fixedDataTableCellLayout_wrap2': {
		display: 'table-row'
	},
	'.fixedDataTableCellLayout_wrap3': {
		display: 'table-cell',
		verticalAlign: 'middle'
	},
	'.fixedDataTableCellLayout_columnResizerContainer': {
		position: 'absolute',
		right: 0,
		width: 6,
		zIndex: 1
	},
	'.fixedDataTableCellLayout_columnResizerContainer:hover': {
		cursor: 'ew-resize'
	},
	'.fixedDataTableCellLayout_columnResizerContainer:hover .fixedDataTableCellLayout_columnResizerKnob': {
		visibility: 'visible'
	},
	'.fixedDataTableCellLayout_columnResizerKnob': {
		position: 'absolute',
		right: 0,
		visibility: 'hidden',
		width: 4
	},
	'.fixedDataTableColumnResizerLineLayout_mouseArea': {
		cursor: 'ew-resize',
		position: 'absolute',
		right: -5,
		width: 12
	},
	'.fixedDataTableColumnResizerLineLayout_main': {
		borderRightStyle: 'solid',
		borderRightWidth: 1,
		boxSizing: 'border-box',
		position: 'absolute',
		zIndex: 10
	},
	'body[dir="rtl"] .fixedDataTableColumnResizerLineLayout_main,.fixedDataTableColumnResizerLineLayout_hiddenElem': {
		display: 'none'
	},
	'.fixedDataTableLayout_main': {
		borderStyle: 'solid',
		borderWidth: 1,
		boxSizing: 'border-box',
		overflow: 'hidden',
		position: 'relative'
	},
	'.fixedDataTableLayout_header,.fixedDataTableLayout_hasBottomBorder': {
		borderBottomStyle: 'solid',
		borderBottomWidth: 1
	},
	'.fixedDataTableLayout_footer .public_fixedDataTableCell_main': {
		borderTopStyle: 'solid',
		borderTopWidth: 1
	},
	'.fixedDataTableLayout_topShadow,.fixedDataTableLayout_bottomShadow': {
		height: 4,
		left: 0,
		position: 'absolute',
		right: 0,
		zIndex: 1
	},
	'.fixedDataTableLayout_bottomShadow': {
		marginTop: -4
	},
	'.fixedDataTableLayout_rowsContainer': {
		overflow: 'hidden',
		position: 'relative'
	},
	'.fixedDataTableLayout_horizontalScrollbar': {
		bottom: 0,
		position: 'absolute'
	},
	'.fixedDataTableRowLayout_main': {
		boxSizing: 'border-box',
		overflow: 'hidden',
		position: 'absolute',
		top: 0
	},
	'.fixedDataTableRowLayout_body': {
		left: 0,
		position: 'absolute',
		top: 0
	},
	'.fixedDataTableRowLayout_fixedColumnsDivider': {
		WebkitBackfaceVisibility: 'hidden',
		backfaceVisibility: 'hidden',
		borderLeftStyle: 'solid',
		borderLeftWidth: 1,
		left: 0,
		position: 'absolute',
		top: 0,
		width: 0
	},
	'.fixedDataTableRowLayout_columnsShadow': {
		width: 4
	},
	'.fixedDataTableRowLayout_rowWrapper': {
		position: 'absolute',
		top: 0
	},
	'.ScrollbarLayout_main': {
		boxSizing: 'border-box',
		outline: 'none',
		overflow: 'hidden',
		position: 'absolute',
		WebkitTransitionDuration: '250ms',
		transitionDuration: '250ms',
		WebkitTransitionTimingFunction: 'ease',
		transitionTimingFunction: 'ease',
		WebkitUserSelect: 'none',
		MozUserSelect: 'none',
		msUserSelect: 'none',
		userSelect: 'none'
	},
	'.ScrollbarLayout_mainVertical': {
		bottom: 0,
		right: 0,
		top: 0,
		WebkitTransitionProperty: 'background-color width',
		transitionProperty: 'background-color width',
		width: 15
	},
	'.ScrollbarLayout_mainVertical.public_Scrollbar_mainActive,.ScrollbarLayout_mainVertical:hover': {
		width: 17
	},
	'.ScrollbarLayout_mainHorizontal': {
		bottom: 0,
		height: 15,
		left: 0,
		WebkitTransitionProperty: 'background-color height',
		transitionProperty: 'background-color height'
	},
	'.ScrollbarLayout_mainHorizontal.public_Scrollbar_mainActive,.ScrollbarLayout_mainHorizontal:hover': {
		height: 17
	},
	'.ScrollbarLayout_face': {
		left: 0,
		overflow: 'hidden',
		position: 'absolute',
		zIndex: 1
	},
	'.ScrollbarLayout_face:after': {
		borderRadius: 6,
		content: '\'\'',
		display: 'block',
		position: 'absolute',
		WebkitTransition: 'background-color 250ms ease',
		transition: 'background-color 250ms ease'
	},
	'.ScrollbarLayout_faceHorizontal': {
		bottom: 0,
		left: 0,
		top: 0
	},
	'.ScrollbarLayout_faceHorizontal:after': {
		bottom: 4,
		left: 0,
		top: 4,
		width: '100%'
	},
	'.ScrollbarLayout_faceVertical': {
		left: 0,
		right: 0,
		top: 0
	},
	'.ScrollbarLayout_faceVertical:after': {
		height: '100%',
		left: 4,
		right: 4,
		top: 0
	},
	'.public_fixedDataTable_main,.public_fixedDataTable_header,.public_fixedDataTable_hasBottomBorder': {
		borderColor: '#d3d3d3'
	},
	'.public_fixedDataTable_header .public_fixedDataTableCell_main': {
		fontWeight: 700
	},
	'.public_fixedDataTable_header,.public_fixedDataTable_header .public_fixedDataTableCell_main': {
		backgroundColor: '#f6f7f8',
		backgroundImage: 'linear-gradient(#fff,#efefef)'
	},
	'.public_fixedDataTable_footer .public_fixedDataTableCell_main': {
		backgroundColor: '#f6f7f8',
		borderColor: '#d3d3d3'
	},
	'.public_fixedDataTable_topShadow': {
		background: '0 0 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAECAYAAABP2FU6AAAAF0lEQVR4AWPUkNeSBhHCjJoK2twgFisAFagCCp3pJlAAAAAASUVORK5CYII=) repeat-x'
	},
	'.public_fixedDataTable_bottomShadow': {
		background: '0 0 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAECAYAAABP2FU6AAAAHElEQVQI12MwNjZmZdAT1+Nm0JDWEGZQk1GTBgAWkwIeAEp52AAAAABJRU5ErkJggg==) repeat-x'
	},
	'.public_fixedDataTable_horizontalScrollbar .public_Scrollbar_mainHorizontal': {
		backgroundColor: '#fff'
	},
	'.public_fixedDataTableCell_main': {
		backgroundColor: '#fff',
		borderColor: '#d3d3d3'
	},
	'.public_fixedDataTableCell_highlighted': {
		backgroundColor: '#f4f4f4'
	},
	'.public_fixedDataTableCell_cellContent': {
		padding: 8
	},
	'.public_fixedDataTableCell_columnResizerKnob': {
		backgroundColor: '#0284ff'
	},
	'.public_fixedDataTableColumnResizerLine_main': {
		borderColor: '#0284ff'
	},
	'.public_fixedDataTableRow_main': {
		backgroundColor: '#fff'
	},
	'.public_fixedDataTableRow_highlighted,.public_fixedDataTableRow_highlighted .public_fixedDataTableCell_main': {
		backgroundColor: '#f6f7f8'
	},
	'.public_fixedDataTableRow_fixedColumnsDivider': {
		borderColor: '#d3d3d3'
	},
	'.public_fixedDataTableRow_columnsShadow': {
		background: '0 0 url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABCAYAAAD5PA/NAAAAFklEQVQIHWPSkNeSBmJhTQVtbiDNCgASagIIuJX8OgAAAABJRU5ErkJggg==) repeat-y'
	},
	'.public_Scrollbar_main.public_Scrollbar_mainActive,.public_Scrollbar_main:hover': {
		backgroundColor: 'rgba(255,255,255,.8)'
	},
	'.public_Scrollbar_mainOpaque,.public_Scrollbar_mainOpaque.public_Scrollbar_mainActive,.public_Scrollbar_mainOpaque:hover': {
		backgroundColor: '#fff'
	},
	'.public_Scrollbar_face:after': {
		backgroundColor: '#c2c2c2'
	},
	'.public_Scrollbar_main:hover .public_Scrollbar_face:after,.public_Scrollbar_mainActive .public_Scrollbar_face:after,.public_Scrollbar_faceActive:after': {
		backgroundColor: '#7d7d7d'
	}
};
