export const globalStyles = {
	headerBackground: '#373737',
	headerHeight: '30px',
	headerHeightMobile: '60px',
	headerText: '#E0E0E0',
	headerHover: '#FFFFFF',
	headerFont: "'Lato', sans-serif",
	sideBackground: '#F5F5F5',
	sideText: '#666',
	sideHover: '#000',
	veryLight: '#BBB',
	clearFix: {
		display: 'table',
		clear: 'both',
	},
	link: {
		textDecoration: 'none',
		color: 'inherit',
	},
	loading: {
		opacity: 0,
		pointerEvents: 'none',
		transition: '0s linear opacity .25s',
	},
	loaded: {
		opacity: 1,
		transition: '.3s linear opacity .25s',
	},
	invisible: {
		opacity: 0,
		pointerEvents: 'none',
	},
	hidden: {
		display: 'none',
	},
	button: {
		color: '#666',
		fontSize: '20px',
		padding: '15px',
		cursor: 'pointer',
		':hover': {
			color: '#000'
		}
	},
	paragraph: {
		lineHeight: '1.58',
		padding: '20px 0px'
	},
	hiddenUntilLoad: {
		// transition: '.3s linear opacity .25s',
	},
	ellipsis: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	emptyBlock: {
		backgroundColor: '#f6f6f6',
		width: '75%',
		margin: '0px auto',
		height: '85px',
		lineHeight: '85px',
		textAlign: 'center',
		border: '1px solid rgba(0,0,0,0.05)',
		borderRadius: '2px',
	},
};

export const profileStyles = {
	profilePage: {
		backgroundColor: globalStyles.sideBackground,
		color: globalStyles.sideText,
		fontFamily: globalStyles.headerFont,
	},
	profileWrapper: {
		maxWidth: 1024,
		margin: '0 auto 0 auto',
		overflow: 'hidden',
		backgroundColor: 'white',
		boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.4)',
		minHeight: 'calc(100vh - ' + globalStyles.headerHeight + ')',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			maxWidth: '100%',
			minHeight: 'calc(100vh - ' + globalStyles.headerHeightMobile + ')',
		},
	},
};

export const navStyles = {
	navList: {
		listStyle: 'none',
		height: globalStyles.headerHeight,
		width: '100%',
		margin: 0,
		padding: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: globalStyles.headerHeightMobile,
		},
	},
	navItem: {
		height: '100%',
		padding: '0px 20px',
		lineHeight: globalStyles.headerHeight,
		float: 'right',
		display: 'none',
		color: globalStyles.sideText,
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(33% - 1px)',
			lineHeight: globalStyles.headerHeightMobile,
			padding: 0,
			textAlign: 'center',
			fontSize: '20px'
		},
	},
	left: {
		float: 'left',
	},
	right: {
		float: 'right',
	},
	navSeparator: {
		width: 1,
		backgroundColor: '#999',
		height: 'calc(' + globalStyles.headerHeight + ' - 16px)',
		margin: '8px 0px',
		display: 'none',
		float: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(' + globalStyles.headerHeightMobile + ' - 30px)',
			margin: '15px 0px',
		},
	},
	navItemShow: {
		display: 'block',
	},
	noMobile: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		},
	},
};

export const pubSizes = {
	mobileLeft: null,
	mobilePub: '100%',
	mobileRight: null,
	mobileMinContainer: null,
	mobileMaxContainer: '767px',

	xSmallLeft: 150,
	xSmallPub: '60vw',
	xSmallRight: 'calc(100% - 50vw - 150px - 30px)',
	xSmallPubMeta: 'calc(100% -  150px)',
	xSmallPadding: 5,
	xSmallLeftBarPadding: 10,
	xSmallMinContainer: 768,
	xSmallMaxContainer: 1023,

	smallLeft: 150,
	smallPub: '55vw',
	smallRight: 'calc(100% - 50vw - 150px - 30px)',
	smallPubMeta: 'calc(100% -  150px)',
	smallPadding: 10,
	smallLeftBarPadding: 10,
	smallMinContainer: 1024,
	smallMaxContainer: 1300,

	mediumLeft: 150,
	mediumPub: '55vw',
	mediumRight: 'calc(100% - 50vw - 150px - 30px)',
	mediumPubMeta: 'calc(100% -  150px)',
	mediumPadding: 15,
	mediumLeftBarPadding: 10,
	mediumMinContainer: 1301,
	mediumMaxContainer: 1600,

	largeLeft: 200,
	largePub: '55vw',
	largeRight: 'calc(100% - 50vw - 200px - 30px)',
	largePubMeta: 'calc(100% -  200px)',
	largePadding: 20,
	largeLeftBarPadding: 15,
	largeMinContainer: 1601,
	largeMaxContainer: 2000,

	xLargeLeft: 200,
	xLargePub: '55vw',
	xLargeRight: 'calc(100% - 50vw - 200px - 30px)',
	xLargePubMeta: 'calc(100% -  200px)',
	xLargePadding: 25,
	xLargeLeftBarPadding: 15,
	xLargeMinContainer: 2001,
	xLargeMaxContainer: 2600,

};
