import {globalStyles} from '../../utils/styleConstants';


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
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
};
