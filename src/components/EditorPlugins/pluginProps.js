import React from 'react';
import {SimpleSelect} from 'react-selectize';

export const src = {
	title: 'src',
	default: '',
	defaultValue: '',
	defaultString: '',
	valueFunction: function(ref) {
		const val = ref.value();
		return (val) ? val.value : null;
	},
	component: function(pluginProp, value, props, styles) {
		const title = pluginProp.title;
		const defaultString = pluginProp.defaultString;

		const assets = (props.assets) ? Object.values(props.assets).map( function(asset) { return {'value': asset.refName, 'label': asset.refName};}) : [];
		const val = (value) ? {'value': value, 'label': value } : undefined;

		let elem;
		if (val) {
			elem = <SimpleSelect ref={'pluginInput-' + title} name={title} id={title} options={assets} value={val}/>;
		} else {
			elem = <SimpleSelect ref={'pluginInput-' + title} name={title} id={title} options={assets}/>;
		}

		return (<div key={'pluginVal-' + title} style={styles.pluginOptionWrapper}>
			<label htmlFor={title} style={styles.pluginOptionLabel}>{title}</label>
			{elem}
			<div style={[styles.pluginOptionDefault, defaultString && styles.pluginOptionDefaultVisible]}>default: {defaultString}</div>
			<div style={styles.clearfix}></div>
		</div>);
	}
};

export const width = {
	title: 'width',
	defaultValue: '100%',
	defaultString: '100%',
	value: '',
};


export const height = {
	title: 'height',
	defaultValue: 'auto',
	defaultString: 'auto',
	value: '',
};

export const align = {
	title: 'align',
	defaultValue: 'center',
	defaultString: 'center',
	value: '',
};
