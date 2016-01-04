import React from 'react';
import {SimpleSelect} from 'react-selectize';
import Radios from './radioButton';
import DropdownProp from './dropdownProp';

// import {openModal} from '../../actions/editor';

export function propSrc(assetType) {

	const filterAssets = function(asset) {
		return (asset.assetType === assetType);
	};

	return {
		title: 'src',
		default: '',
		defaultValue: '',
		defaultString: '',
		valueFunction: function(thisRef) {
			return thisRef.value();
		},
		component: function(pluginProp, value, componentProps, styles) {
			const title = pluginProp.title;
			const assets = (componentProps.assets) ? Object.values(componentProps.assets).filter(filterAssets).map( function(asset) { return {'value': asset.refName, 'label': asset.refName};}) : [];
			// assets.push({'value': 'upload', 'label': 'Upload New'});
			const val = (value) ? {'value': value, 'label': value } : undefined;
			return <DropdownProp ref={'pluginInput-' + title} choices={assets} selectedValue={val}/>;
		}
	};
}

export const propAlign = {
	title: 'align',
	default: '',
	defaultValue: '',
	defaultString: '',
	valueFunction: function(thisRef) {
		return thisRef.value();
	},
	component: function(pluginProp, value, componentProps, styles) {
		const title = pluginProp.title;
		const choices = ['left', 'full', 'right'];
		return (<Radios ref={'pluginInput-' + title} selectedValue={value}  choices={choices}/>);
	}
};

export const propSize = {
	title: 'size',
	default: '',
	defaultValue: '',
	defaultString: '',
	valueFunction: function(thisRef) {
		return thisRef.value();
	},
	component: function(pluginProp, value, componentProps, styles) {
		const title = pluginProp.title;
		const choices = ['small', 'medium', 'large'];
		return (<Radios ref={'pluginInput-' + title} selectedValue={value} choices={choices}/>);
	}
};

export const propSrcRef = {
	title: 'srcRef',
	default: '',
	defaultValue: '',
	defaultString: '',
	valueFunction: function(thisRef) {
		return thisRef.value();
	},
	component: function(pluginProp, value, componentProps, styles) {
		const title = pluginProp.title;
		const refs = (componentProps.references) ? Object.values(componentProps.references).map( function(ref) { return {'value': ref.refName, 'label': ref.refName};}) : [];
		// assets.push({'value': 'upload', 'label': 'Upload New'});
		const val = (value) ? {'value': value, 'label': value } : {};

		return <DropdownProp ref={'pluginInput-' + title} choices={refs} selectedValue={val}/>;
	}
};
