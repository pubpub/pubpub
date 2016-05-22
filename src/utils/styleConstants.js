export const globalStyles = {
	// headerBackground: '#373737',
	headerBackground: '#2A2A2A',
	headerHeight: '30px',
	headerHeightMobile: '60px',
	headerText: '#F4F4F4',
	headerHover: '#FFFFFF',
	// headerFont: "'Lato', sans-serif",
	headerFont: '"ClearSans", Helvetica Neue, Arial, sans-serif',
	// sideBackground: '#F5F5F5',
	sideBackground: '#EBEBEB',
	// sideText: '#666',
	sideTextDisabled: '#808284',
	sideText: '#222',
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
	h1: {
		fontFamily: 'Lato',
		fontSize: '42px',
		fontWeight: '300',
		padding: '20px',
		color: '#333',
	},

	// Used by the asset uploading modal
	mediumModal: {
		width: '50vw',
		height: '85vh',
		overflow: 'hidden',
		overflowY: 'scroll',
		margin: '0 auto',
		position: 'fixed',
		top: '10vh',
		left: '25vw',
		backgroundColor: 'white',
		boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
		'@media screen and (min-width: 1395px)': {
			width: 1200,
			left: 'calc(50vw - 600px)',
		},
	},

	largeModal: {
		width: '86vw',
		height: '100vh',
		overflow: 'hidden',
		overflowY: 'scroll',
		margin: '0 auto',
		position: 'fixed',
		top: 0,
		left: '7vw',
		backgroundColor: 'white',
		boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.25)',
		'@media screen and (min-width: 1395px)': {
			width: 1200,
			left: 'calc(50vw - 600px)',
		},
	},
	subMenu: {
		margin: '0px 20px',
		border: '1px solid #EEE',
		// fontWeight: '400',
		// backgroundColor: '#f3f3f3',
	},
	left: {
		float: 'left',
	},
	right: {
		float: 'right',
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

	defaultLeftWidth: 'calc(140px + 1vh)',
	defaultRightWidth: 'calc(100% - (140px + 1vh) - 55vw)',

	xSmallLeft: '140px + 1vh',
	xSmallPub: '60vw',
	xSmallRight: 'calc(100% - 50vw - 140px - 1vh - 30px)',
	xSmallPubMeta: 'calc(100% - 140px - 1vh)',
	xSmallPadding: 5,
	xSmallLeftBarPadding: 10,
	xSmallMinContainer: 768,
	xSmallMaxContainer: 1023,

	smallLeft: '140px + 1vh',
	smallPub: '55vw',
	smallRight: 'calc(100% - 50vw - 140px - 1vh - 30px)',
	smallPubMeta: 'calc(100% - 140px - 1vh)',
	smallPadding: 10,
	smallLeftBarPadding: 10,
	smallMinContainer: 1024,
	smallMaxContainer: 1300,

	mediumLeft: '140px + 1vh',
	mediumPub: '55vw',
	mediumRight: 'calc(100% - 50vw - 140px - 1vh - 30px)',
	mediumPubMeta: 'calc(100% - 140px - 1vh)',
	mediumPadding: 15,
	mediumLeftBarPadding: 10,
	mediumMinContainer: 1301,
	mediumMaxContainer: 1600,

	largeLeft: '140px + 1vh',
	largePub: '55vw',
	largeRight: 'calc(100% - 50vw - 140px - 1vh - 30px)',
	largePubMeta: 'calc(100% - 140px - 1vh)',
	largePadding: 20,
	largeLeftBarPadding: 15,
	largeMinContainer: 1601,
	largeMaxContainer: 2000,

	xLargeLeft: '140px + 1vh',
	xLargePub: '55vw',
	xLargeRight: 'calc(100% - 50vw - 140px - 1vh - 30px)',
	xLargePubMeta: 'calc(100% - 140px - 1vh)',
	xLargePadding: 25,
	xLargeLeftBarPadding: 15,
	xLargeMinContainer: 2001,
	xLargeMaxContainer: 2600,

};
