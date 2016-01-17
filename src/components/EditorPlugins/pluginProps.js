import React from 'react';
import {SimpleSelect} from 'react-selectize';
import Radios from './radioButton';
import DropdownProp from './dropdownProp';
import TextInput from './textProp';

// import {openModal} from '../../actions/editor';

export function propSrc(assetType) {

	const filterAssets = function(asset) {
		return (asset.assetType === assetType);
	};

	return {
		title: 'source',
		default: '',
		defaultValue: '',
		defaultString: '',
		component: function(pluginProp, value, componentProps) {
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
	component: function(pluginProp, value, componentProps) {
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
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		const choices = ['small', 'medium', 'large','number'];
		return (<Radios ref={'pluginInput-' + title} selectedValue={value} choices={choices}/>);
	}
};


export const propCaption = {
	title: 'caption',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		return (<TextInput placeholder="Enter Caption" ref={'pluginInput-' + title} selectedValue={value}/>);
	}
};

export const propQuote = {
	title: 'quote',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		return (<TextInput placeholder="Enter Quote" ref={'pluginInput-' + title} selectedValue={value}/>);
	}
};

export const propUrl = {
	title: 'url',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		return (<TextInput placeholder="Enter Url" ref={'pluginInput-' + title} selectedValue={value}/>);
	}
};

export const propWidth = {
	title: 'width',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		return (<TextInput placeholder="Enter width" ref={'pluginInput-' + title} selectedValue={value}/>);
	}
};

export const propHeight = {
	title: 'height',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		return (<TextInput placeholder="Enter height" ref={'pluginInput-' + title} selectedValue={value}/>);
	}
};

export const propAttribution = {
	title: 'attribution',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		return (<TextInput placeholder="Who said it?" ref={'pluginInput-' + title} selectedValue={value}/>);
	}
};


export const propSrcRef = {
	title: 'reference',
	default: '',
	defaultValue: '',
	defaultString: '',
	component: function(pluginProp, value, componentProps) {
		const title = pluginProp.title;
		const refs = (componentProps.references) ? Object.values(componentProps.references).map( function(ref) { return {'value': ref.refName, 'label': ref.refName};}) : [];
		// assets.push({'value': 'upload', 'label': 'Upload New'});
		const val = (value) ? {'value': value, 'label': value } : {};

		return <DropdownProp ref={'pluginInput-' + title} choices={refs} selectedValue={val}/>;
	}
};
