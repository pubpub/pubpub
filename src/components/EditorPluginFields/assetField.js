import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const AssetField = React.createClass({
	propTypes: {
		assetType: PropTypes.string,
		assets: PropTypes.array,
		selectedValue: PropTypes.string
	},
	statics: {
		// Transform is called by PPMComponent.js to transform
		// 'prop' -- the text value of the asset into the asset object
		transform: function(prop, params, assets, references) {
			const asset = assets[prop];
			if (asset && asset.assetType === params.assetType) {
				return asset;
			}
			return new Error('Could not find asset');
		}
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const assets = this.props.assets.filter((asset) => (asset.assetType === this.props.assetType))
		.map( function(asset) { return {'value': asset.refName, 'label': asset.refName};});
		const val = (this.props.selectedValue) ? {'label': this.props.selectedValue, 'value': this.props.selectedValue} : undefined;
		return <DropdownField ref="val" choices={assets} selectedValue={val}/>;
	}
});

export default AssetField;
