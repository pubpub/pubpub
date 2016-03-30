import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const AssetField = React.createClass({
	propTypes: {
		assetType: PropTypes.string,
		assets: PropTypes.array,
		selectedValue: PropTypes.object,
		saveChange: PropTypes.func,
	},
	statics: {
		// Transform is called by PPMComponent.js to transform
		// 'prop' -- the text value of the asset into the asset object
		/*
		transform: function(prop, params, assets, references) {
			const asset = assets[prop];
			if (asset && asset.assetType === params.assetType) {
				return asset;
			}
			return new Error('Could not find asset');
		}
		*/
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const assets = this.props.assets.filter((asset) => (asset.assetType === this.props.assetType && asset.label))
		.map( function(asset) { return {'value': asset, 'label': asset.label.substring(0, 15) };});

		const selectedAsset = (this.props.selectedValue) ? this.props.assets.find((asset) => (asset._id === this.props.selectedValue._id)) : null;
		const selectedVal = (selectedAsset) ? {'value': selectedAsset, 'label': selectedAsset.label.substring(0, 15) } : null;

		return <DropdownField ref="val" choices={assets} selectedValue={selectedVal} saveChange={this.props.saveChange}/>;
	}
});

export default AssetField;
