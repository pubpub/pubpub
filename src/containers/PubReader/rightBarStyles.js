export const rightBarStyles = {
	sectionWrapper: {
		margin: '10px 0px 30px 0px',
	},
	sectionHeader: {
		fontSize: '20px',
		fontWeight: '400',
		color: '#666',
		margin: 0,
		padding: 0,
		width: '100%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			fontSize: '30px',
		},

	},
	sectionSubHeaderInline: {
		margin: '0px 0px 0px 15px',
	},
	sectionSubHeader: {
		margin: '3px 0px',
		fontSize: '14px',
		color: '#777',
		width: '100%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	sectionSubHeaderSpan: {
		fontSize: '14px',
		color: '#777',
		':hover': {
			cursor: 'pointer',
			color: '#222',
		},
	},
	reviewsWrapper: {
		padding: '10px 0px',
	},
	reviewScore: {
		border: '1px solid #ccc',
		borderRadius: '1px',
		padding: '1px 8px',
		margin: '3px 3px',
		float: 'left',
		fontSize: '13px',
		// width: 'calc(33% - 14px)',
	},
	scorethingDivider: {
		padding: '0px 5px',
		color: '#aaa',
	}
};
