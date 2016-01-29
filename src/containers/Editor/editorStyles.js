import {globalStyles} from '../../utils/styleConstants';


export const styles = {
	editorContainer: {
		position: 'relative',
		color: globalStyles.sideText,
		fontFamily: globalStyles.headerFont,
		backgroundColor: globalStyles.sideBackground,
		height: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(100vh - ' + globalStyles.headerHeightMobile + ')',
		},
	},
	editorContainerDark: {
		backgroundColor: '#272727',

	},
	errorTitle: {
		textAlign: 'center',
		fontSize: '45px',
		padding: 40,
	},
	// isMobile: {
	// 	display: 'none',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'block',
	// 	},
	// },
	// mobileHeader: {
	// 	textAlign: 'center',
	// 	fontSize: '3em',
	// 	paddingTop: 50,
	// 	margin: '.66em 0em',
	// },
	// mobileImageWrapper: {
	// 	width: 100,
	// 	margin: '0 auto',
	// },
	// mobileImage: {
	// 	width: '100%',
	// },
	// mobileText: {
	// 	textAlign: 'center',
	// 	fontSize: '1.5em',
	// 	padding: 20,
	// 	margin: 0,
	// },
	// notMobile: {
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'none',
	// 	},
	// },

	editorLoadBar: {
		position: 'fixed',
		top: 60,
		width: '100%',
		zIndex: 10,
	},
	// alignRight: {
	// 	textAlign: 'right',
	// },
	// floatRight: {
	// 	float: 'right',
	// },
	hiddenMainEditor: {
		height: 0,
		overflow: 'hidden',
		pointerEvents: 'none',
	},
	// showAll: {
	// 	padding: '0px 5px',
	// 	display: 'none',
	// 	color: globalStyles.veryLight,
	// 	position: 'absolute',
	// 	top: -1,
	// 	left: 135,
	// 	height: '30px',
	// 	lineHeight: '30px',
	// 	width: 73,
	// 	':hover': {
	// 		cursor: 'pointer',
	// 		color: 'black',
	// 	}
	// },
	// showAllVisible: {
	// 	pointerEvents: 'auto',
	// 	display: 'inline-block',
	// },

	// showCommentsToggle: {
	// 	backgroundColor: '#F5F5F5',
	// 	cursor: 'pointer',
	// 	width: '300px',
	// 	height: '30px',
	// 	lineHeight: '30px',
	// 	margin: '0 auto',
	// 	borderRadius: '1px',
	// 	userSelect: 'none',
	// 	textAlign: 'center',
	// 	':hover': {
	// 		color: 'black'
	// 	}
	// },
	bodyNavBar: {
		width: '100%',
		height: '29px',
		color: 'white',
		borderBottom: '1px solid #CCC',
		marginBottom: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 1px)',
		},
	},
	bodyNavItem: {
		
		float: 'right',
		padding: '0px 10px',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		cursor: 'pointer',
		color: '#888',
		userSelect: 'none',
		':hover': {
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
			fontSize: '20px',
		},
	},
	bodyNavSeparator: {
		float: 'right',
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		userSelect: 'none',
		padding: '0px 2px',
		color: '#888',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
			lineHeight: globalStyles.headerHeightMobile,
			fontSize: '20px',
		},
	},
	mobileOnlySeparator: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	bodyNavDiscussionBlock: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
	previewBlockWrapper: {
		width: 'calc(100% - 20px)',
		height: 'calc(100vh - 91px - 20px)',
		padding: '10px',
		overflow: 'hidden',
		overflowY: 'scroll',
		position: 'absolute',
		opacity: '0',
		pointerEvents: 'none',
	},
	previewBlockWrapperShow: {
		opacity: '1',
		pointerEvents: 'auto',
	},
	previewBlockHeader: {
		fontSize: '30px',
		margin: '10px 0px',
	},
	previewBlockText: {
		fontSize: '15px',
		margin: '5px 0px 35px 0px',
	},
	// readerViewBlock: {
	// 	width: 'calc(50% - 20px)',
	// 	height: 'calc(100vh - 31px - 20px)',
	// 	padding: '10px',
	// 	overflow: 'hidden',
	// 	overflowY: 'scroll',
	// 	float: 'left',
	// },
	// readerViewBlockBody: {
	// 	backgroundColor: 'white',
	// 	boxShadow: 'rgba(0,0,0,0.25) 0px 3px 9px 1px',
	// },
	// hiddenCodeMirror: {
	// 	opacity: 0,
	// 	pointerEvents: 'none',
	// 	position: 'absolute',
	// },
	// editorDisabledMessage: {
	// 	width: '90%',
	// 	backgroundColor: '#373737',
	// 	display: 'block',
	// 	margin: '0 auto',
	// 	color: 'white',
	// 	textAlign: 'center',
	// 	padding: '5px',

	// },
	editorMarkdown: {
		margin: '30px 0px',
		width: '50vw',
		zIndex: 5,

		position: 'fixed',
		height: 'calc(100vh - 60px - 2*' + globalStyles.headerHeight + ')',
		overflow: 'hidden',
		overflowY: 'scroll',
	},
	editorPreview: {
		width: 'calc(50% - 0px)',
		backgroundColor: '#fff',
		boxShadow: 'rgba(0,0,0,0.25) 0px 3px 9px 1px',
		position: 'fixed',
		right: 0,
		top: 61,
		height: 'calc(100vh - 61px)',
		overflow: 'hidden',
		zIndex: 20,
		padding: 0
	},

	edit: {
		editorMarkdown: {
			transition: '.352s linear transform, .3s linear opacity .25s, 0s linear padding .352s, 0s linear left .352s',
			transform: 'translateX(0%)',
			padding: globalStyles.headerHeight + ' 25vw',
			left: 0,
		},
		editorPreview: {
			transition: '.352s linear transform',
			transform: 'translateX(110%)',
		},

	},

	preview: {
		editorBottomNav: {
			pointerEvents: 'none',
		},
		editorMarkdown: {
			transition: '.352s linear transform, .3s linear opacity .25s',
			transform: 'translateX(-50%)',
			padding: globalStyles.headerHeight + ' 0px',
			left: '25vw'
		},
		editorPreview: {
			transition: '.352s linear transform',
			transform: 'translateX(0%)',
		},
		
	},

};

