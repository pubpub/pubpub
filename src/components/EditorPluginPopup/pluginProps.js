import React from 'react';
import {SimpleSelect} from 'react-selectize';
import Radios from './radioProp';
import DropdownProp from './dropdownProp';
import TextInput from './textProp';

// import {openModal} from '../../actions/editor';

const propSource = {
	title: 'source',
	transform: function(prop, params, assets, references) {
		const asset = assets[prop];
		if (asset && asset.assetType === assetType) {
			return asset;
		} else {
			return 'error';
		}
	},
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		const assets = (componentProps.assets) ? Object.values(componentProps.assets).filter(filterAssets).map( function(asset) { return {'value': asset.refName, 'label': asset.refName};}) : [];
		// assets.push({'value': 'upload', 'label': 'Upload New'});
		const val = (value) ? {'value': value, 'label': value } : undefined;
		return <DropdownProp ref={'pluginInput-' + title} choices={assets} selectedValue={val}/>;
	}
};

export default {
	'source': propSource
}
