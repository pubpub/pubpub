import {globalStyles} from '../../utils/styleConstants';

export const baseStyles = {
	pubModalContainer: {
		padding: '15px',
	},
	pubModalTitle: {
		fontSize: '30px',
		marginBottom: 30,
		color: globalStyles.sideText,
	},
	pubModalContentWrapper: {
		margin: '0px 20px',
		'@media screen and (min-resolution: 3dppx), @media screen and(max-width: 767px)': {
			margin: '0px 10px',
		},
	},
};
