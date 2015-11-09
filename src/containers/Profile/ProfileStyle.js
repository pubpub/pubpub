import {globalStyles} from '../../utils/styleConstants';

export const styles = {
	profilePage: {
		backgroundColor: globalStyles.sideBackground,
		color: globalStyles.sideText,
		fontFamily: globalStyles.headerFont,
	},
	other: {
		display: 'none'
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
	profileWrapper: {
		maxWidth: 1024,
		margin: '0 auto',
		overflow: 'hidden',
		backgroundColor: 'white',
		boxShadow: '0px 10px 4px 0px rgba(0,0,0,0.4)',
		minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: '100%',
			maxWidth: '100%',
			minHeight: 'calc(100vh - ' + globalStyles.headerHeightMobile + ')',
		},
	},
	profileNav: {
		listStyle: 'none',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
		},
	},
	profileNavItem: {
		height: '100%',
		padding: '0px 20px',
		lineHeight: globalStyles.headerHeight,
		float: 'right',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: 'calc(33% - 1px)',
			lineHeight: globalStyles.headerHeightMobile,
			padding: 0,
			textAlign: 'center',
			fontSize: '20px'
		},
	},
	profileNavSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		float: 'right',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 30px)',
			margin: '15px 0px',
		},
	},
	userImageWrapper: {
		margin: 30,
		width: 150,
		height: 150,
		border: '1px solid rgba(0,0,0,0.1)',
		borderRadius: '1px',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			float: 'none',
			margin: '30px auto',
		},
	},
	userImage: {
		width: '100%',
		height: '100%',
		
	},
	detailsWrapper: {
		margin: '30px 0px',
		width: 'calc(100% - 212px)',
		height: '152px',
		overflow: 'hidden',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			float: 'none',
			width: '100%',
		},
	},
	profileName: {
		margin: 0,
		fontSize: '40px',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			fontSize: '50px',
			textAlign: 'center',
		},
	},
	profileDetail: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			textAlign: 'center',
			fontSize: '20px',
		},
	},

	statsWrapper: {
		clear: 'both',
		height: 100,
		// backgroundColor: globalStyles.sideBackground,
		backgroundColor: '#F0F0F0',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			height: 300
		},
	},
	statsList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
	statsItem: {
		width: 'calc(20% - 1px)',
		float: 'left',
		height: '100%',
		textDecoration: 'none',
		color: globalStyles.sideText,
		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: 'calc(50% - 1px)',
			height: 99,
			borderRight: '1px solid rgba(0,0,0,0.4)',
			borderBottom: '1px solid rgba(0,0,0,0.4)',
		},
		
	},
	pointsItem: {
		width: '20%',
		borderLeft: '0px solid black',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			width: '100%',
			borderBottom: '1px solid rgba(0,0,0,0.1)',
		},
	},
	noRightMobile: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			borderRight: '0px solid black',
			width: '50%',
		},
	},
	noBottomMobile: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			borderBottom: '0px solid black',
			height: 100,
		},
	},
	statsSeparator: {
		width: 1,
		height: '60px',
		margin: '20px 0px',
		backgroundColor: 'rgba(0,0,0,0.4)',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			display: 'none',
		},
	},

	statsTitle: {
		// backgroundColor: 'rgba(255,0,0,0.2)',
		textAlign: 'center',
		height: 30,
		lineHeight: '50px',
		fontSize: '20px',

	},
	statsCount: {
		// backgroundColor: 'rgba(0,92,0,0.2)',
		height: 70,
		textAlign: 'center',
		lineHeight: '70px',
		fontSize: '35px',
	},
	profileContent: {
		width: 'calc(100% - 40px)',
		margin: '0px 20px',
	}


};
