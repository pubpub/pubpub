export default {
	'.katex-display': {
		display: 'block',
		// margin: '1em 0',
		textAlign: 'center'
	},
	'.katex-display>.katex': {
		display: 'inline-block',
		textAlign: 'initial'
	},
	'.katex': {
		fontSize: '1.21em',
		fontWeight: '400',
		fontFamily: 'KaTeX_Main',
		lineHeight: 1.2,
		whiteSpace: 'nowrap',
		textIndent: 0
	},
	'.katex .katex-html': {
		display: 'inline-block'
	},
	'.katex .katex-mathml': {
		position: 'absolute',
		clip: NaN,
		padding: 0,
		border: 0,
		height: 1,
		width: 1,
		overflow: 'hidden'
	},
	'.katex .base,.katex .strut': {
		display: 'inline-block'
	},
	'.katex .mathit': {
		fontFamily: 'KaTeX_Math',
		fontStyle: 'italic'
	},
	'.katex .mathbf': {
		fontFamily: 'KaTeX_Main',
		fontWeight: 700
	},
	'.katex .amsrm,.katex .mathbb': {
		fontFamily: 'KaTeX_AMS'
	},
	'.katex .mathcal': {
		fontFamily: 'KaTeX_Caligraphic'
	},
	'.katex .mathfrak': {
		fontFamily: 'KaTeX_Fraktur'
	},
	'.katex .mathtt': {
		fontFamily: 'KaTeX_Typewriter'
	},
	'.katex .mathscr': {
		fontFamily: 'KaTeX_Script'
	},
	'.katex .mathsf': {
		fontFamily: 'KaTeX_SansSerif'
	},
	'.katex .mainit': {
		fontFamily: 'KaTeX_Main',
		fontStyle: 'italic'
	},
	'.katex .textstyle>.mord+.mop': {
		marginLeft: '.16667em'
	},
	'.katex .textstyle>.mord+.mbin': {
		marginLeft: '.22222em'
	},
	'.katex .textstyle>.mord+.mrel': {
		marginLeft: '.27778em'
	},
	'.katex .textstyle>.mop+.mop,.katex .textstyle>.mop+.mord,.katex .textstyle>.mord+.minner': {
		marginLeft: '.16667em'
	},
	'.katex .textstyle>.mop+.mrel': {
		marginLeft: '.27778em'
	},
	'.katex .textstyle>.mop+.minner': {
		marginLeft: '.16667em'
	},
	'.katex .textstyle>.mbin+.minner,.katex .textstyle>.mbin+.mop,.katex .textstyle>.mbin+.mopen,.katex .textstyle>.mbin+.mord': {
		marginLeft: '.22222em'
	},
	'.katex .textstyle>.mrel+.minner,.katex .textstyle>.mrel+.mop,.katex .textstyle>.mrel+.mopen,.katex .textstyle>.mrel+.mord': {
		marginLeft: '.27778em'
	},
	'.katex .textstyle>.mclose+.mop': {
		marginLeft: '.16667em'
	},
	'.katex .textstyle>.mclose+.mbin': {
		marginLeft: '.22222em'
	},
	'.katex .textstyle>.mclose+.mrel': {
		marginLeft: '.27778em'
	},
	'.katex .textstyle>.mclose+.minner,.katex .textstyle>.minner+.mop,.katex .textstyle>.minner+.mord,.katex .textstyle>.mpunct+.mclose,.katex .textstyle>.mpunct+.minner,.katex .textstyle>.mpunct+.mop,.katex .textstyle>.mpunct+.mopen,.katex .textstyle>.mpunct+.mord,.katex .textstyle>.mpunct+.mpunct,.katex .textstyle>.mpunct+.mrel': {
		marginLeft: '.16667em'
	},
	'.katex .textstyle>.minner+.mbin': {
		marginLeft: '.22222em'
	},
	'.katex .textstyle>.minner+.mrel': {
		marginLeft: '.27778em'
	},
	'.katex .mclose+.mop,.katex .minner+.mop,.katex .mop+.mop,.katex .mop+.mord,.katex .mord+.mop,.katex .textstyle>.minner+.minner,.katex .textstyle>.minner+.mopen,.katex .textstyle>.minner+.mpunct': {
		marginLeft: '.16667em'
	},
	'.katex .reset-textstyle.textstyle': {
		fontSize: '1em'
	},
	'.katex .reset-textstyle.scriptstyle': {
		fontSize: '.7em'
	},
	'.katex .reset-textstyle.scriptscriptstyle': {
		fontSize: '.5em'
	},
	'.katex .reset-scriptstyle.textstyle': {
		fontSize: '1.42857em'
	},
	'.katex .reset-scriptstyle.scriptstyle': {
		fontSize: '1em'
	},
	'.katex .reset-scriptstyle.scriptscriptstyle': {
		fontSize: '.71429em'
	},
	'.katex .reset-scriptscriptstyle.textstyle': {
		fontSize: '2em'
	},
	'.katex .reset-scriptscriptstyle.scriptstyle': {
		fontSize: '1.4em'
	},
	'.katex .reset-scriptscriptstyle.scriptscriptstyle': {
		fontSize: '1em'
	},
	'.katex .style-wrap': {
		position: 'relative'
	},
	'.katex .vlist': {
		display: 'inline-block'
	},
	'.katex .vlist>span': {
		display: 'block',
		height: 0,
		position: 'relative'
	},
	'.katex .vlist>span>span': {
		display: 'inline-block'
	},
	'.katex .vlist .baseline-fix': {
		display: 'inline-table',
		tableLayout: 'fixed'
	},
	'.katex .msupsub': {
		textAlign: 'left'
	},
	'.katex .mfrac>span>span': {
		textAlign: 'center'
	},
	'.katex .mfrac .frac-line': {
		width: '100%'
	},
	'.katex .mfrac .frac-line:before': {
		borderBottomStyle: 'solid',
		borderBottomWidth: 1,
		content: '""',
		display: 'block'
	},
	'.katex .mfrac .frac-line:after': {
		borderBottomStyle: 'solid',
		borderBottomWidth: '.04em',
		content: '""',
		display: 'block',
		marginTop: -1
	},
	'.katex .mspace': {
		display: 'inline-block'
	},
	'.katex .mspace.negativethinspace': {
		marginLeft: '-.16667em'
	},
	'.katex .mspace.thinspace': {
		width: '.16667em'
	},
	'.katex .mspace.mediumspace': {
		width: '.22222em'
	},
	'.katex .mspace.thickspace': {
		width: '.27778em'
	},
	'.katex .mspace.enspace': {
		width: '.5em'
	},
	'.katex .mspace.quad': {
		width: '1em'
	},
	'.katex .mspace.qquad': {
		width: '2em'
	},
	'.katex .llap,.katex .rlap': {
		width: 0,
		position: 'relative'
	},
	'.katex .llap>.inner,.katex .rlap>.inner': {
		position: 'absolute'
	},
	'.katex .llap>.fix,.katex .rlap>.fix': {
		display: 'inline-block'
	},
	'.katex .llap>.inner': {
		right: 0
	},
	'.katex .rlap>.inner': {
		left: 0
	},
	'.katex .katex-logo .a': {
		fontSize: '.75em',
		marginLeft: '-.32em',
		position: 'relative',
		top: '-.2em'
	},
	'.katex .katex-logo .t': {
		marginLeft: '-.23em'
	},
	'.katex .katex-logo .e': {
		marginLeft: '-.1667em',
		position: 'relative',
		top: '.2155em'
	},
	'.katex .katex-logo .x': {
		marginLeft: '-.125em'
	},
	'.katex .rule': {
		display: 'inline-block',
		border: '0 solid',
		position: 'relative'
	},
	'.katex .overline .overline-line,.katex .underline .underline-line': {
		width: '100%'
	},
	'.katex .overline .overline-line:before,.katex .underline .underline-line:before': {
		borderBottomStyle: 'solid',
		borderBottomWidth: 1,
		content: '""',
		display: 'block'
	},
	'.katex .overline .overline-line:after,.katex .underline .underline-line:after': {
		borderBottomStyle: 'solid',
		borderBottomWidth: '.04em',
		content: '""',
		display: 'block',
		marginTop: -1
	},
	'.katex .sqrt>.sqrt-sign': {
		position: 'relative'
	},
	'.katex .sqrt .sqrt-line': {
		width: '100%'
	},
	'.katex .sqrt .sqrt-line:before': {
		borderBottomStyle: 'solid',
		borderBottomWidth: 1,
		content: '""',
		display: 'block'
	},
	'.katex .sqrt .sqrt-line:after': {
		borderBottomStyle: 'solid',
		borderBottomWidth: '.04em',
		content: '""',
		display: 'block',
		marginTop: -1
	},
	'.katex .sqrt>.root': {
		marginLeft: '.27777778em',
		marginRight: '-.55555556em'
	},
	'.katex .fontsize-ensurer,.katex .sizing': {
		display: 'inline-block'
	},
	'.katex .fontsize-ensurer.reset-size1.size1,.katex .sizing.reset-size1.size1': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size1.size2,.katex .sizing.reset-size1.size2': {
		fontSize: '1.4em'
	},
	'.katex .fontsize-ensurer.reset-size1.size3,.katex .sizing.reset-size1.size3': {
		fontSize: '1.6em'
	},
	'.katex .fontsize-ensurer.reset-size1.size4,.katex .sizing.reset-size1.size4': {
		fontSize: '1.8em'
	},
	'.katex .fontsize-ensurer.reset-size1.size5,.katex .sizing.reset-size1.size5': {
		fontSize: '2em'
	},
	'.katex .fontsize-ensurer.reset-size1.size6,.katex .sizing.reset-size1.size6': {
		fontSize: '2.4em'
	},
	'.katex .fontsize-ensurer.reset-size1.size7,.katex .sizing.reset-size1.size7': {
		fontSize: '2.88em'
	},
	'.katex .fontsize-ensurer.reset-size1.size8,.katex .sizing.reset-size1.size8': {
		fontSize: '3.46em'
	},
	'.katex .fontsize-ensurer.reset-size1.size9,.katex .sizing.reset-size1.size9': {
		fontSize: '4.14em'
	},
	'.katex .fontsize-ensurer.reset-size1.size10,.katex .sizing.reset-size1.size10': {
		fontSize: '4.98em'
	},
	'.katex .fontsize-ensurer.reset-size2.size1,.katex .sizing.reset-size2.size1': {
		fontSize: '.71428571em'
	},
	'.katex .fontsize-ensurer.reset-size2.size2,.katex .sizing.reset-size2.size2': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size2.size3,.katex .sizing.reset-size2.size3': {
		fontSize: '1.14285714em'
	},
	'.katex .fontsize-ensurer.reset-size2.size4,.katex .sizing.reset-size2.size4': {
		fontSize: '1.28571429em'
	},
	'.katex .fontsize-ensurer.reset-size2.size5,.katex .sizing.reset-size2.size5': {
		fontSize: '1.42857143em'
	},
	'.katex .fontsize-ensurer.reset-size2.size6,.katex .sizing.reset-size2.size6': {
		fontSize: '1.71428571em'
	},
	'.katex .fontsize-ensurer.reset-size2.size7,.katex .sizing.reset-size2.size7': {
		fontSize: '2.05714286em'
	},
	'.katex .fontsize-ensurer.reset-size2.size8,.katex .sizing.reset-size2.size8': {
		fontSize: '2.47142857em'
	},
	'.katex .fontsize-ensurer.reset-size2.size9,.katex .sizing.reset-size2.size9': {
		fontSize: '2.95714286em'
	},
	'.katex .fontsize-ensurer.reset-size2.size10,.katex .sizing.reset-size2.size10': {
		fontSize: '3.55714286em'
	},
	'.katex .fontsize-ensurer.reset-size3.size1,.katex .sizing.reset-size3.size1': {
		fontSize: '.625em'
	},
	'.katex .fontsize-ensurer.reset-size3.size2,.katex .sizing.reset-size3.size2': {
		fontSize: '.875em'
	},
	'.katex .fontsize-ensurer.reset-size3.size3,.katex .sizing.reset-size3.size3': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size3.size4,.katex .sizing.reset-size3.size4': {
		fontSize: '1.125em'
	},
	'.katex .fontsize-ensurer.reset-size3.size5,.katex .sizing.reset-size3.size5': {
		fontSize: '1.25em'
	},
	'.katex .fontsize-ensurer.reset-size3.size6,.katex .sizing.reset-size3.size6': {
		fontSize: '1.5em'
	},
	'.katex .fontsize-ensurer.reset-size3.size7,.katex .sizing.reset-size3.size7': {
		fontSize: '1.8em'
	},
	'.katex .fontsize-ensurer.reset-size3.size8,.katex .sizing.reset-size3.size8': {
		fontSize: '2.1625em'
	},
	'.katex .fontsize-ensurer.reset-size3.size9,.katex .sizing.reset-size3.size9': {
		fontSize: '2.5875em'
	},
	'.katex .fontsize-ensurer.reset-size3.size10,.katex .sizing.reset-size3.size10': {
		fontSize: '3.1125em'
	},
	'.katex .fontsize-ensurer.reset-size4.size1,.katex .sizing.reset-size4.size1': {
		fontSize: '.55555556em'
	},
	'.katex .fontsize-ensurer.reset-size4.size2,.katex .sizing.reset-size4.size2': {
		fontSize: '.77777778em'
	},
	'.katex .fontsize-ensurer.reset-size4.size3,.katex .sizing.reset-size4.size3': {
		fontSize: '.88888889em'
	},
	'.katex .fontsize-ensurer.reset-size4.size4,.katex .sizing.reset-size4.size4': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size4.size5,.katex .sizing.reset-size4.size5': {
		fontSize: '1.11111111em'
	},
	'.katex .fontsize-ensurer.reset-size4.size6,.katex .sizing.reset-size4.size6': {
		fontSize: '1.33333333em'
	},
	'.katex .fontsize-ensurer.reset-size4.size7,.katex .sizing.reset-size4.size7': {
		fontSize: '1.6em'
	},
	'.katex .fontsize-ensurer.reset-size4.size8,.katex .sizing.reset-size4.size8': {
		fontSize: '1.92222222em'
	},
	'.katex .fontsize-ensurer.reset-size4.size9,.katex .sizing.reset-size4.size9': {
		fontSize: '2.3em'
	},
	'.katex .fontsize-ensurer.reset-size4.size10,.katex .sizing.reset-size4.size10': {
		fontSize: '2.76666667em'
	},
	'.katex .fontsize-ensurer.reset-size5.size1,.katex .sizing.reset-size5.size1': {
		fontSize: '.5em'
	},
	'.katex .fontsize-ensurer.reset-size5.size2,.katex .sizing.reset-size5.size2': {
		fontSize: '.7em'
	},
	'.katex .fontsize-ensurer.reset-size5.size3,.katex .sizing.reset-size5.size3': {
		fontSize: '.8em'
	},
	'.katex .fontsize-ensurer.reset-size5.size4,.katex .sizing.reset-size5.size4': {
		fontSize: '.9em'
	},
	'.katex .fontsize-ensurer.reset-size5.size5,.katex .sizing.reset-size5.size5': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size5.size6,.katex .sizing.reset-size5.size6': {
		fontSize: '1.2em'
	},
	'.katex .fontsize-ensurer.reset-size5.size7,.katex .sizing.reset-size5.size7': {
		fontSize: '1.44em'
	},
	'.katex .fontsize-ensurer.reset-size5.size8,.katex .sizing.reset-size5.size8': {
		fontSize: '1.73em'
	},
	'.katex .fontsize-ensurer.reset-size5.size9,.katex .sizing.reset-size5.size9': {
		fontSize: '2.07em'
	},
	'.katex .fontsize-ensurer.reset-size5.size10,.katex .sizing.reset-size5.size10': {
		fontSize: '2.49em'
	},
	'.katex .fontsize-ensurer.reset-size6.size1,.katex .sizing.reset-size6.size1': {
		fontSize: '.41666667em'
	},
	'.katex .fontsize-ensurer.reset-size6.size2,.katex .sizing.reset-size6.size2': {
		fontSize: '.58333333em'
	},
	'.katex .fontsize-ensurer.reset-size6.size3,.katex .sizing.reset-size6.size3': {
		fontSize: '.66666667em'
	},
	'.katex .fontsize-ensurer.reset-size6.size4,.katex .sizing.reset-size6.size4': {
		fontSize: '.75em'
	},
	'.katex .fontsize-ensurer.reset-size6.size5,.katex .sizing.reset-size6.size5': {
		fontSize: '.83333333em'
	},
	'.katex .fontsize-ensurer.reset-size6.size6,.katex .sizing.reset-size6.size6': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size6.size7,.katex .sizing.reset-size6.size7': {
		fontSize: '1.2em'
	},
	'.katex .fontsize-ensurer.reset-size6.size8,.katex .sizing.reset-size6.size8': {
		fontSize: '1.44166667em'
	},
	'.katex .fontsize-ensurer.reset-size6.size9,.katex .sizing.reset-size6.size9': {
		fontSize: '1.725em'
	},
	'.katex .fontsize-ensurer.reset-size6.size10,.katex .sizing.reset-size6.size10': {
		fontSize: '2.075em'
	},
	'.katex .fontsize-ensurer.reset-size7.size1,.katex .sizing.reset-size7.size1': {
		fontSize: '.34722222em'
	},
	'.katex .fontsize-ensurer.reset-size7.size2,.katex .sizing.reset-size7.size2': {
		fontSize: '.48611111em'
	},
	'.katex .fontsize-ensurer.reset-size7.size3,.katex .sizing.reset-size7.size3': {
		fontSize: '.55555556em'
	},
	'.katex .fontsize-ensurer.reset-size7.size4,.katex .sizing.reset-size7.size4': {
		fontSize: '.625em'
	},
	'.katex .fontsize-ensurer.reset-size7.size5,.katex .sizing.reset-size7.size5': {
		fontSize: '.69444444em'
	},
	'.katex .fontsize-ensurer.reset-size7.size6,.katex .sizing.reset-size7.size6': {
		fontSize: '.83333333em'
	},
	'.katex .fontsize-ensurer.reset-size7.size7,.katex .sizing.reset-size7.size7': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size7.size8,.katex .sizing.reset-size7.size8': {
		fontSize: '1.20138889em'
	},
	'.katex .fontsize-ensurer.reset-size7.size9,.katex .sizing.reset-size7.size9': {
		fontSize: '1.4375em'
	},
	'.katex .fontsize-ensurer.reset-size7.size10,.katex .sizing.reset-size7.size10': {
		fontSize: '1.72916667em'
	},
	'.katex .fontsize-ensurer.reset-size8.size1,.katex .sizing.reset-size8.size1': {
		fontSize: '.28901734em'
	},
	'.katex .fontsize-ensurer.reset-size8.size2,.katex .sizing.reset-size8.size2': {
		fontSize: '.40462428em'
	},
	'.katex .fontsize-ensurer.reset-size8.size3,.katex .sizing.reset-size8.size3': {
		fontSize: '.46242775em'
	},
	'.katex .fontsize-ensurer.reset-size8.size4,.katex .sizing.reset-size8.size4': {
		fontSize: '.52023121em'
	},
	'.katex .fontsize-ensurer.reset-size8.size5,.katex .sizing.reset-size8.size5': {
		fontSize: '.57803468em'
	},
	'.katex .fontsize-ensurer.reset-size8.size6,.katex .sizing.reset-size8.size6': {
		fontSize: '.69364162em'
	},
	'.katex .fontsize-ensurer.reset-size8.size7,.katex .sizing.reset-size8.size7': {
		fontSize: '.83236994em'
	},
	'.katex .fontsize-ensurer.reset-size8.size8,.katex .sizing.reset-size8.size8': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size8.size9,.katex .sizing.reset-size8.size9': {
		fontSize: '1.19653179em'
	},
	'.katex .fontsize-ensurer.reset-size8.size10,.katex .sizing.reset-size8.size10': {
		fontSize: '1.43930636em'
	},
	'.katex .fontsize-ensurer.reset-size9.size1,.katex .sizing.reset-size9.size1': {
		fontSize: '.24154589em'
	},
	'.katex .fontsize-ensurer.reset-size9.size2,.katex .sizing.reset-size9.size2': {
		fontSize: '.33816425em'
	},
	'.katex .fontsize-ensurer.reset-size9.size3,.katex .sizing.reset-size9.size3': {
		fontSize: '.38647343em'
	},
	'.katex .fontsize-ensurer.reset-size9.size4,.katex .sizing.reset-size9.size4': {
		fontSize: '.43478261em'
	},
	'.katex .fontsize-ensurer.reset-size9.size5,.katex .sizing.reset-size9.size5': {
		fontSize: '.48309179em'
	},
	'.katex .fontsize-ensurer.reset-size9.size6,.katex .sizing.reset-size9.size6': {
		fontSize: '.57971014em'
	},
	'.katex .fontsize-ensurer.reset-size9.size7,.katex .sizing.reset-size9.size7': {
		fontSize: '.69565217em'
	},
	'.katex .fontsize-ensurer.reset-size9.size8,.katex .sizing.reset-size9.size8': {
		fontSize: '.83574879em'
	},
	'.katex .fontsize-ensurer.reset-size9.size9,.katex .sizing.reset-size9.size9': {
		fontSize: '1em'
	},
	'.katex .fontsize-ensurer.reset-size9.size10,.katex .sizing.reset-size9.size10': {
		fontSize: '1.20289855em'
	},
	'.katex .fontsize-ensurer.reset-size10.size1,.katex .sizing.reset-size10.size1': {
		fontSize: '.20080321em'
	},
	'.katex .fontsize-ensurer.reset-size10.size2,.katex .sizing.reset-size10.size2': {
		fontSize: '.2811245em'
	},
	'.katex .fontsize-ensurer.reset-size10.size3,.katex .sizing.reset-size10.size3': {
		fontSize: '.32128514em'
	},
	'.katex .fontsize-ensurer.reset-size10.size4,.katex .sizing.reset-size10.size4': {
		fontSize: '.36144578em'
	},
	'.katex .fontsize-ensurer.reset-size10.size5,.katex .sizing.reset-size10.size5': {
		fontSize: '.40160643em'
	},
	'.katex .fontsize-ensurer.reset-size10.size6,.katex .sizing.reset-size10.size6': {
		fontSize: '.48192771em'
	},
	'.katex .fontsize-ensurer.reset-size10.size7,.katex .sizing.reset-size10.size7': {
		fontSize: '.57831325em'
	},
	'.katex .fontsize-ensurer.reset-size10.size8,.katex .sizing.reset-size10.size8': {
		fontSize: '.69477912em'
	},
	'.katex .fontsize-ensurer.reset-size10.size9,.katex .sizing.reset-size10.size9': {
		fontSize: '.8313253em'
	},
	'.katex .fontsize-ensurer.reset-size10.size10,.katex .sizing.reset-size10.size10': {
		fontSize: '1em'
	},
	'.katex .delimsizing.size1': {
		fontFamily: 'KaTeX_Size1'
	},
	'.katex .delimsizing.size2': {
		fontFamily: 'KaTeX_Size2'
	},
	'.katex .delimsizing.size3': {
		fontFamily: 'KaTeX_Size3'
	},
	'.katex .delimsizing.size4': {
		fontFamily: 'KaTeX_Size4'
	},
	'.katex .delimsizing.mult .delim-size1>span': {
		fontFamily: 'KaTeX_Size1'
	},
	'.katex .delimsizing.mult .delim-size4>span': {
		fontFamily: 'KaTeX_Size4'
	},
	'.katex .nulldelimiter': {
		display: 'inline-block',
		width: '.12em'
	},
	'.katex .op-symbol': {
		position: 'relative'
	},
	'.katex .op-symbol.small-op': {
		fontFamily: 'KaTeX_Size1'
	},
	'.katex .op-symbol.large-op': {
		fontFamily: 'KaTeX_Size2'
	},
	'.katex .accent>.vlist>span,.katex .op-limits>.vlist>span': {
		textAlign: 'center'
	},
	'.katex .accent .accent-body>span': {
		width: 0
	},
	'.katex .accent .accent-body.accent-vec>span': {
		position: 'relative',
		// left: '.326em' // This left was causing the vector to show over the wrong portion
		left: '-.25em',
	},
	'.katex .mtable .vertical-separator': {
		display: 'inline-block',
		margin: '0 -.025em',
		borderRight: '.05em solid #000'
	},
	'.katex .mtable .arraycolsep': {
		display: 'inline-block'
	},
	'.katex .mtable .col-align-c>.vlist': {
		textAlign: 'center'
	},
	'.katex .mtable .col-align-l>.vlist': {
		textAlign: 'left'
	},
	'.katex .mtable .col-align-r>.vlist': {
		textAlign: 'right'
	}
};
