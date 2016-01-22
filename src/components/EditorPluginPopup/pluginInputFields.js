import React, {PropTypes} from 'react';
import {SimpleSelect} from 'react-selectize';
import Radios from './radioField';
import DropdownField from './dropdownField';
import TextField from './textField';

// import {openModal} from '../../actions/editor';

const PropAsset = React.createClass({
	propTypes: {
		assetType: PropTypes.string,
		assets: PropTypes.array,
		selectedValue: PropTypes.string
	},
	statics: {
		transform: function(prop, params, assets, references) {
			const asset = assets[prop];
			debugger;
			if (asset && asset.assetType === params.assetType) {
				return asset;
			}
			return 'error';
		}
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		console.log(this.props.assetType);
		console.log(this.props.assets);
		const assets = this.props.assets.filter((asset) => (asset.assetType === this.props.assetType))
		.map( function(asset) { return {'value': asset.refName, 'label': asset.refName};});
		// assets.push({'value': 'upload', 'label': 'Upload New'});
		const val = (this.props.selectedValue) ? {'value': this.props.selectedValue, 'label': value } : undefined;
		return <DropdownField ref="val" choices={assets} selectedValue={val}/>;
	}
});

export default {
	'asset': PropAsset
};
