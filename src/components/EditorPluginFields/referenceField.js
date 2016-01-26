import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const ReferenceField = React.createClass({
	propTypes: {
		references: PropTypes.array,
		selectedValue: PropTypes.string
	},
	statics: {
		// Transform is called by PPMComponent.js to transform
		// 'prop' -- the text value of the asset into the asset object
		transform: function(prop, params, assets, references) {
			const reference = references[prop];
			if (reference) {
				return reference;
			}
			return new Error('Could not find reference');
		}
	},
	getDefaultProps: function() {
		return {
			references: []
		};
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const references = this.props.references.map( function(reference) { return {'value': reference.refName, 'label': reference.refName};});
		const val = (this.props.selectedValue) ? {'label': this.props.selectedValue, 'value': this.props.selectedValue} : undefined;
		return <DropdownField ref="val" choices={references} selectedValue={val}/>;
	}
});

export default ReferenceField;
