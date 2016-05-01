import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const ReferenceField = React.createClass({
	propTypes: {
		assets: PropTypes.array,
		selectedValue: PropTypes.object,
		saveChange: PropTypes.func,
		requestAssetUpload: PropTypes.func,
		requestedAsset: PropTypes.object,
	},
	getDefaultProps: function() {
		return {
			assets: []
		};
	},
	componentWillReceiveProps(nextProps) {
		if (!nextProps.requestedAsset) {
			return;
		}
		const oneExists = (!this.props.requestedAsset && nextProps.requestedAsset);
		const bothExist = (!oneExists && this.props.requestedAsset && nextProps.requestedAsset && this.props.requestedAsset._id !== nextProps.requestedAsset._id);

		if (oneExists || bothExist) {
			const requestedVal = {'value': nextProps.requestedAsset, 'label': nextProps.requestedAsset.label.substring(0, 15) };
			this.refs.val.setValue(requestedVal);
		}
	},
	value: function() {
		return this.refs.val.value();
	},
	requestUpload: function() {
		this.props.requestAssetUpload('reference');
	},
	render: function() {

		const references = this.props.assets.filter((asset) => (asset.assetType === 'reference' && asset.label))
		.map( function(asset) { return {'value': asset, 'label': asset.label.substring(0, 15) };});

		const selectedRef = (this.props.selectedValue) ? this.props.assets.find((asset) => (asset._id === this.props.selectedValue._id)) : null;
		const selectedVal = (selectedRef) ? {'value': selectedRef, 'label': selectedRef.label.substring(0, 15) } : null;

		const uploadStyle = {
			fontSize: '0.75em',
			textDecoration: 'underline',
			marginTop: '3px',
			float: 'right',
			cursor: 'pointer',
		};

		// return <DropdownField saveChange={this.props.saveChange} ref="val" choices={references} selectedValue={selectedVal}/>;
		return (<span>
				<DropdownField ref="val" choices={references} selectedValue={selectedVal} saveChange={this.props.saveChange}/>
				{(this.props.requestAssetUpload) ? <span style={uploadStyle} onClick={this.requestUpload}>Upload Reference</span> : null}
			</span>);

	}
});

export default ReferenceField;
