import {globalStyles} from 'utils/styleConstants';

export const baseStyles = {
	modalContentContainer: {
		position: 'relative',
	},
	topHeader: {
		margin: 0,
		fontSize: 35,
		color: globalStyles.sideText,
		padding: 15
	},
	rightCornerAction: {
		position: 'absolute',
		padding: 15,
		top: 15,
		right: 0,
		fontSize: 20,
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
	rightCornerSearch: {
		position: 'absolute',
		padding: 15,
		top: 15,
		right: 0,
		fontSize: 20,
		width: '325px',
	},
	rightCornerSearchInput: {
		textAlign: 'right',
		fontSize: 20,
		fontFamily: 'Lato',
		width: '100%',
		borderWidth: '0px 0px 1px 0px',
		borderColor: '#aaa',
		outline: 'none',
	},
	rightCornerSearchAdvanced: {
		textAlign: 'right',
		fontSize: '13px',
		userSelect: 'none',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
	noContentBlock: {
		textAlign: 'center',
		padding: '40px 0px',
		fontSize: '20px',
		fontFamily: 'Courier',
		backgroundColor: globalStyles.sideBackground,
		width: '60%',
		margin: '0px auto',
		position: 'relative',
		top: 50,
	},

	rowHeaderFontSize: '25px',
	rowHeaderFontFamily: 'Lato',
	rowTextFontSize: '15px',
	rowTextFontFamily: 'Courier',
};
