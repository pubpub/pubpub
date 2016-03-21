import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {LoaderDeterminate, LoaderIndeterminate, Reference} from 'components';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const ReferenceRow = React.createClass({
	propTypes: {
		assetObject: PropTypes.object,

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

		return (
			
			<div style={[styles.assetRowContainer]}>
				
				{/* label */}
				<div style={[styles.filename]}>{assetObject.label}</div>
				
				{/* Type */}
				<div style={[styles.type]}>
					<Reference citationObject={assetData} />
				</div>

				{/* Insert Button */}
				<div key={'insertButton-' + assetObject._id} style={[styles.delete]} onClick={this.props.insertHandler(assetObject)}>
					insert
				</div>

				{/* Edit Button */}
				<div key={'editButton-' + assetObject._id} style={[styles.delete]} onClick={this.props.editHandler(assetObject)}>
					<FormattedMessage {...globalMessages.edit} />
				</div>
				
				{/* Remove Button */}
				<div key={'removeButton-' + assetObject._id} style={[styles.delete]} onClick={this.props.removeHandler(assetObject)}>
					<FormattedMessage {...globalMessages.delete} />
				</div>


			</div>
							
		);
	}
});

export default Radium(ReferenceRow);

const rowHeight = '30px';
styles = {
	assetRowContainer: {
		height: rowHeight,
		width: 'calc(100% - 40px)',
		margin: '5px 20px',
		fontFamily: 'Courier',
		fontSize: '14px',

	},
	filename: {
		width: 'calc(22% - 8%)',
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
		width: 'calc(36% - 4%)',
		padding: '0px 2%',
		borderRadius: 2,
		float: 'left',
		textAlign: 'center',
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
		width: '70%',
		float: 'left',
		overflow: 'hidden',
		marginTop: 15, 
	},
};
