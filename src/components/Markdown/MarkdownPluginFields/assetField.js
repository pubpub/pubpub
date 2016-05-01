import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const AssetField = React.createClass({
	propTypes: {
		assetType: PropTypes.string,
		assets: PropTypes.array,
		selectedValue: PropTypes.object,
		saveChange: PropTypes.func,
		requestAssetUpload: PropTypes.func,
		requestedAsset: PropTypes.object,
	},
	statics: {
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
		this.props.requestAssetUpload(this.props.assetType);
	},
	render: function() {

		const assets = this.props.assets.filter((asset) => (asset.assetType === this.props.assetType && asset.label))
		.map( function(asset) { return {'value': asset, 'label': asset.label.substring(0, 15) };});

		const defVal = this.props.requestedAsset || this.props.selectedValue;

		const selectedAsset = (defVal) ? this.props.assets.find((asset) => (asset._id === defVal._id)) : null;
		const selectedVal = (selectedAsset) ? {'value': selectedAsset, 'label': selectedAsset.label.substring(0, 15) } : null;

		// assets.push({value: 'REQUEST_UPLOAD', label: 'Upload New'});

		const uploadStyle = {
			fontSize: '0.75em',
			textDecoration: 'underline',
			marginTop: '3px',
			float: 'right',
			cursor: 'pointer',
		};

		return (<span>
				<DropdownField ref="val" choices={assets} selectedValue={selectedVal} saveChange={this.props.saveChange}/>
				{(this.props.requestAssetUpload) ? <span style={uploadStyle} onClick={this.requestUpload}>Upload Asset</span> : null}
			</span>);
	}
});

export default AssetField;
