import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {LoaderDeterminate, LoaderIndeterminate} from 'components';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const AssetRow = React.createClass({
	propTypes: {
		assetObject: PropTypes.object,

		isLoading: PropTypes.bool,
		percentLoaded: PropTypes.number,

		insertHandler: PropTypes.func,
		editHandler: PropTypes.func,
		removeHandler: PropTypes.func,
	},
	getDefaultProps: function() {
		return {
			insertHandler: ()=>{},
			editHandler: ()=>{},
			removeHandler: ()=>{},
		};
	},

	render: function() {
		const assetObject = this.props.assetObject || {};
		const assetData = assetObject.assetData || {};
		const isLoading = this.props.isLoading || false;
		return (

			<div style={[styles.assetRowContainer]}>

				{/* Thumbnail */}
				<div style={styles.thumbnail}>
					<div style={styles.inlineBlockHelper}></div>
					<img style={styles.thumbnailImg} src={assetData.thumbnail} />
				</div>

				{/* label */}
				<div style={[styles.filename]}>{assetObject.label}</div>

				{/* Type */}
				<div style={[styles.hideOnLoad[isLoading], styles.type, styles.typeColors[assetObject.assetType]]}>{assetObject.assetType}</div>

				{/* Create Date */}
				<div style={[styles.hideOnLoad[isLoading], styles.date]}>{assetObject.createDate}</div>


				{/* Insert Button */}
				<div key={'insertButton-' + assetObject._id} style={[styles.hideOnLoad[isLoading], styles.delete]} onClick={this.props.insertHandler(assetObject)}>
					<FormattedMessage {...globalMessages.insert} />
				</div>

				{/* Edit Button */}
				<div key={'editButton-' + assetObject._id} style={[styles.hideOnLoad[isLoading], styles.delete]} onClick={this.props.editHandler(assetObject)}>
					<FormattedMessage {...globalMessages.edit} />
				</div>

				{/* Remove Button */}
				{/* <div key={'removeButton-' + assetObject._id} style={[styles.hideOnLoad[isLoading], styles.delete]} onClick={this.props.removeHandler(assetObject)}>
					<FormattedMessage {...globalMessages.delete} />
				</div> */}

				{/*	Loading Bar.
				 	Only shown when file is uploading */}
				<div style={[styles.showOnLoad[isLoading], styles.loadingBarWrapper]}>

					{/*	If it's fully uploaded, show the indeterminate processing bar,
						otherwise, show the determinate loader */}
					{ this.props.percentLoaded === 100
						? <LoaderIndeterminate color="#999"/>
						: <LoaderDeterminate value={this.props.percentLoaded}/>
					}

				</div>

			</div>

		);
	}
});

export default Radium(AssetRow);

const rowHeight = '30px';
styles = {
	assetRowContainer: {
		height: rowHeight,
		width: 'calc(100% - 40px)',
		margin: '5px 20px',
		fontFamily: 'Courier',
		fontSize: '14px',

	},
	thumbnail: {
		height: 'calc(' + rowHeight + ' - 4px)',
		width: '26px',
		marginRight: 'calc(5% - 30px)',
		padding: '2px',
		float: 'left',
		position: 'relative',
		textAlign: 'center',
	},
	thumbnailImg: {
		display: 'inline-block',
		verticalAlign: 'middle',
		maxHeight: 'calc(' + rowHeight + ' - 4px)',
		maxWidth: 'calc(' + rowHeight + ' - 4px)',
	},
	inlineBlockHelper: {
		display: 'inline-block',
		verticalAlign: 'middle',
		height: '100%',
	},
	filename: {
		width: 'calc(22% - 8% + 14%)',
		padding: '0px 4%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	type: {
		lineHeight: '16px',
		height: 16,
		width: 50,
		padding: '2px 5px',
		margin: '3px calc(7.5% - 30px)',
		borderRadius: 2,
		float: 'left',
		textAlign: 'center',
	},
	typeColors: {
		data: {
			backgroundColor: 'rgba(249, 172, 172, 0.5)',
		},
		image: {
			backgroundColor: 'rgba(185, 215, 249, 0.5)',
		},
		video: {
			backgroundColor: 'rgba(158, 219, 176, 0.5)',
		},
	},
	date: {
		width: 'calc(16% - 4%)',
		padding: '0px 2%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	author: {
		width: '16%',
		padding: '0px 2%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
	},
	delete: {
		width: '10%',
		padding: '0px 2%',
		textAlign: 'center',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		lineHeight: rowHeight,
		height: rowHeight,
		float: 'left',
		color: globalStyles.veryLight,
		textTransform: 'lowercase',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideText,
		}
	},
	headeRowContainer: {
		padding: '15px 15px 15px 15px',
	},
	hideOnLoad: {
		true: {
			display: 'none',
		}
	},
	showOnLoad: {
		false: {
			display: 'none'
		}
	},
	loadingBarWrapper: {
		height: 15,
		width: '51%',
		float: 'left',
		overflow: 'hidden',
		marginTop: 15,
	},
};
