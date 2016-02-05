import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';
import {DiscussionPreview, PubPreview} from '../ItemPreviews';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const UserDiscussions = React.createClass({
	propTypes: {
		profileData: PropTypes.object,
		ownProfile: PropTypes.string,
	},

	getDefaultProps: function() {
		return {
			profileData: {
				discussions: [],
				pubs: [],
			},
		};
	},

	getInitialState: function() {
		return {
			mode: 'pubs',
		};
	},



	render: function() {
		// console.log(this.props.profileData);
		return (
			<div style={styles.container}>
				DISCUSSIONS
			</div>
		);
	}
});

export default Radium(UserDiscussions);

styles = {
	profileDetail: {
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textAlign: 'center',
			fontSize: '20px',
		},
	},

	statsWrapper: {
		borderWidth: '1px 0px 1px 0px',
		borderColor: '#CCC',
		borderStyle: 'solid',
		margin: '20px 0px',
		padding: '10px 0px',
		// clear: 'both',
		// height: 100,
		// backgroundColor: globalStyles.sideBackground,
		// backgroundColor: '#F0F0F0',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// height: 300
			margin: '30px 0px',
		},
	},
	statsList: {
		listStyle: 'none',
		margin: 0,
		padding: 0,
	},
	statParenthese: {
		display: 'inline',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',	
		}
	},
	statsItem: {
		// backgroundColor: 'rgba(200,200,100,0.3)',

		height: '30px',
		width: 'calc(100% / 3)',
		margin: '10px 0px',
		display: 'inline-block',

		// whiteSpace: 'nowrap',
		overflow: 'hidden',
		// textOverflow: 'ellipsis',

		textDecoration: 'none',
		color: globalStyles.sideText,
		userSelect: 'none',

		':hover': {
			color: globalStyles.sideHover,
			cursor: 'pointer',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '50%',
			height: 70,
			margin: '20px 0px',
		},
		
	},

	statsTitle: {
		// backgroundColor: 'rgba(255,0,0,0.2)',
		// textAlign: 'center',
		height: 30,
		lineHeight: '30px',
		fontSize: '18px',
		display: 'inline-block',
		// backgroundColor: 'rgba(70,250,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			height: 25,
			lineHeight: '25px',
			fontSize: '25px',
			textAlign: 'center',
		},

	},
	statsCount: {
		// backgroundColor: 'rgba(0,92,0,0.2)',
		height: 30,
		paddingLeft: 10,
		// textAlign: 'center',
		lineHeight: '30px',
		fontSize: '18px',
		display: 'inline-block',
		// backgroundColor: 'rgba(190,70,89,0.4)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			height: 45,
			lineHeight: '40px',
			textAlign: 'center',
			fontSize: '35px',
		},
	},
	profileContent: {
		// width: 'calc(100% - 40px)',
		// margin: '0px 20px',
	},
	sectionHeader: {
		fontSize: '30px',
		margin: '25px 0px 20px 0px',
	},
	pubBlock: {
		// margin: 15,
		// float: 'left',
		// backgroundColor: '#EAEAEA',
		// fontFamily: 'Lora',
		// width: 'calc(100% - 30px)',
		// width: 'calc(100% / 3 - 30px)',
		// height: 175,
		// overflow: 'hidden',
		// position: 'relative',
		// ':hover': {
			// backgroundColor: '#E5E5E5',
		// },
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// width: 'calc(100% - 30px)'
		// },

	},
	pubTextWrapper: {
		width: '100%',
		height: '100%',
	},
	pubTitle: {
		color: '#333',
		padding: '10px 10px 20px 10px',
		fontSize: '20px',
	},
	pubAbstract: {
		color: '#888',
		padding: '5px 15px 0px 15px',
	},
	pubEdit: {
		backgroundColor: '#FCFCFC',
		textAlign: 'center',
		position: 'absolute',
		bottom: 2,
		left: 2,
		height: '30px',
		lineHeight: '30px',
		color: '#555',
		width: 'calc(100% - 4px)',
		':hover': {
			cusror: 'pointer',
			color: '#111',

		},
	},
};
