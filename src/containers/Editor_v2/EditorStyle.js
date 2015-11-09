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
	}
};
