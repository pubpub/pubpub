import {globalStyles} from '../../utils/styleConstants';

export const styles = {
	editorContainer: {
		position: 'relative',
		color: globalStyles.sideText,
		fontFamily: globalStyles.headerFont,
	},
	isMobile: {
		display: 'none',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'block',
		},
	},
	mobileHeader: {
		textAlign: 'center',
		fontSize: '3em',
		paddingTop: 50,
	},
	mobileText: {
		textAlign: 'center',
		fontSize: '1.5em',
		padding: 20,
	},
	notMobile: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	hiddenUntilLoad: {
		transition: '.3s linear opacity .25s',
	},
	editorTopNav: {
		position: 'fixed',
		top: 30,
		width: '100%',
		backgroundColor: 'white',
		zIndex: 10,
	},
	editorLoadBar: {
		position: 'fixed',
		top: 60,
		width: '100%',
		zIndex: 10,
	},
	editorBottomNav: {
		position: 'fixed',
		top: 60,
		width: '100%',
		zIndex: 10,
	},
	editorBottomNav_preview: {
		pointerEvents: 'none',
	},
	editorNav: {
		listStyle: 'none',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,
		
	},
	editorNavItem: {
		height: '100%',
		padding: '0px 20px',
		lineHeight: globalStyles.headerHeight,
		float: 'left',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
	},
	editorNavSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'left',
	},
	editorNavRight: {
		float: 'right',
	},
	editorMarkdown: {
		marginTop: 60,
		padding: '20px 0px',
		width: '50%',
		zIndex: 5,
	},
	editorMarkdown_edit: {
		transition: '.2s linear transform',
		transform: 'translateX(50%)',
	},
	editorMarkdown_preview: {
		transition: '.2s linear transform',
		transform: 'translateX(0%)',
		height: 300,
		overflow: 'hidden',
		overflowY: 'scroll',
	},
	editorPreview: {
		width: '50%',
		backgroundColor: 'rgba(89,89,200,0.4)',
		position: 'fixed',
		right: 0,
		top: 60,
		height: 'calc(100vh - 60px)',
		overflow: 'hidden',
		overflowY: 'scroll',
		zIndex: 20,
	},
	editorPreview_edit: {
		transition: '.2s linear transform',
		transform: 'translateX(100%)',
	},
	editorPreview_preview: {
		transition: '.2s linear transform',
		transform: 'translateX(0%)',
	},

	bottomNavLeft: {
		// backgroundColor: 'rgba(100,200,85, 0.4)',
		width: '20%',
		// height: 'calc(100vh - 60px)',
		float: 'left',
	},
	// bottomNavLeft_preview: {
		
	// },
	bottomNavRight: {
		// backgroundColor: 'rgba(200,100,85, 0.4)',
		width: '20%',
		// height: 'calc(100vh - 60px)',
		float: 'right',
	},
	bottomNavRight_edit: {
		transition: '.2s linear transform',
		transform: 'translateX(0%)',
	},
	bottomNavRight_preview: {
		transition: '.2s linear transform',
		transform: 'translateX(-250%)',
	},
	alignRight: {
		textAlign: 'right',
	},
	floatRight: {
		float: 'right',
	},
	bottomNavTitle: {
		height: globalStyles.headerHeight,
		lineHeight: globalStyles.headerHeight,
		padding: '0px 20px',
		color: globalStyles.veryLight,
		fontSize: '.9em',
	},
	bottomNavTitle_preview: {
		pointerEvents: 'auto',
		':hover': {
			color: globalStyles.sideText,
			cursor: 'pointer',
		}
	},
	bottomNavDivider: {
		width: '100%',
		height: '1px',
		position: 'relative',
	},
	bottomNavDividerSmall: {
		backgroundColor: globalStyles.veryLight,
		width: '50%',
		height: '100%',
		margin: '0px 20px',
		position: 'absolute',
		top: 0,
	},
	bottomNavDividerRight: {
		right: 0,
	},
	bottomNavDividerLarge: {
		backgroundColor: globalStyles.veryLight,
		width: 'calc(25vw + 1px)',
		height: '100%',
		margin: '0px 0px',
		position: 'absolute',
		top: 0,
	},
	bottomNavDividerLarge_edit: {
		transition: '.2s linear opacity',
		opacity: 0,
	},
	bottomNavDividerLarge_preview: {
		transition: '.2s linear opacity',
		opacity: 1,
	},
	bottomNavDividerLargeRight: {
		right: 0,
	},
	bottomNavList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
		overflow: 'hidden',
		overflowY: 'scroll',
		height: 'calc(100vh - 90px)',
		opacity: 1,
		transition: '.2s linear opacity',
	},
	bottomNavList_preview: {
		opacity: 0,
	},
	bottomNavListItem: {
		margin: '0px 20px',
		padding: '3px 0px',
		float: 'left',
		clear: 'both',
		color: globalStyles.veryLight,
		fontSize: '.8em',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},


};
