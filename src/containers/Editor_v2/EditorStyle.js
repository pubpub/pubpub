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
	alignRight: {
		textAlign: 'right',
	},
	floatRight: {
		float: 'right',
	},

	common: {
		editorBottomNav: {
			position: 'fixed',
			top: 60,
			width: '100%',
			pointerEvents: 'none',
			zIndex: 10,
		},
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
			width: 'calc(50% - 20px)',
			// backgroundColor: 'rgba(89,89,200,0.4)',
			boxShadow: '#909090 4px 9px 5px 6px',
			position: 'fixed',
			right: 0,
			top: 60,
			height: 'calc(100vh - 60px)',
			overflow: 'hidden',
			overflowY: 'scroll',
			zIndex: 20,
			padding: 10
		},
		bottomNavBackground: {
			position: 'absolute',
			height: globalStyles.headerHeight,
			backgroundColor: 'white',
			transition: '.352s linear opacity',
			opacity: 0,
			top: 1,
			width: '50%',
		},
		bottomNavLeft: {
			// backgroundColor: 'rgba(100,200,85, 0.4)',
			// width: '20%',
			// height: 'calc(100vh - 60px)',
			position: 'relative',
			float: 'left',
		},
		bottomNavRight: {
			// backgroundColor: 'rgba(200,100,85, 0.4)',
			// width: '20%',
			// height: 'calc(100vh - 60px)',
			float: 'right',
			position: 'relative',
		},
		bottomNavTitle: {
			height: globalStyles.headerHeight,
			lineHeight: globalStyles.headerHeight,
			padding: '0px 20px',
			color: globalStyles.veryLight,
			fontSize: '.9em',
		},
		bottomNavDivider: {
			width: '20vw',
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
		bottomNavDividerLargeRight: {
			right: 0,
		},
		bottomNavList: {
			listStyle: 'none',
			margin: 0,
			padding: 0,
			overflow: 'hidden',
			overflowY: 'scroll',
			maxHeight: 'calc(100vh - 90px)',
			opacity: 1,
			transition: '.352s linear opacity',
		},
		bottomNavListItem: {
			margin: '0px 20px',
			padding: '3px 0px',
			float: 'left',
			clear: 'both',
			color: globalStyles.veryLight,
			fontSize: '.8em',
			pointerEvents: 'auto',
			':hover': {
				cursor: 'pointer',
				color: globalStyles.sideText,
			}
		},
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
		bottomNavRight: {
			transition: '.352s linear transform',
			transform: 'translateX(0%)',
		},
		bottomNavDividerLarge: {
			transition: '.352s linear opacity',
			opacity: 0,
		},
		bottomNavBackground: {
			opacity: 0,
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
		bottomNavRight: {
			transition: '.352s linear transform',
			transform: 'translateX(-250%)',
		},
		bottomNavTitle: {
			pointerEvents: 'auto',
			':hover': {
				color: globalStyles.sideText,
				cursor: 'pointer',
			}
		},
		bottomNavDividerLarge: {
			transition: '.352s linear opacity',
			opacity: 1,
		},
		bottomNavBackground: {
			opacity: 1,
		},
		bottomNavList: {
			opacity: 0,
			backgroundColor: 'white',
			transition: '.1s linear opacity, 0s linear box-shadow 0.352s',
			boxShadow: '3px 3px 3px 0px rgba(0,0,0,0.3)',
			
		},
		bottomNavListRight: {
			boxShadow: '-3px 3px 3px 0px rgba(0,0,0,0.3)',
		},
		bottomNavListItem: {
			pointerEvents: 'none',
		},
		listActive: {
			opacity: 1,	
		},
		listItemActive: {
			pointerEvents: 'auto',
			width: '100%',
		},
		listTitleActive: {
			color: globalStyles.sideText,
		}
	},


};

