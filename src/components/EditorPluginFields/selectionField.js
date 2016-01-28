import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const AssetField = React.createClass({
	propTypes: {
		selections: PropTypes.array,
		selectedValue: PropTypes.string
	},
	statics: {
		// Transform is called by PPMComponent.js to transform
		// 'prop' -- the text value of the asset into the asset object
		transform: function(prop, params, assets, references, selections) {
			if (selections.length >= prop) {
				return selections[prop - 1];
			}
			return new Error('Could not find selection');
		}
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {
		const selections = this.props.selections.map( function(selection, index) { return {'value': index, 'label': selection.text};});
		const val = (this.props.selectedValue) ? {'label': this.props.selectedValue, 'value': this.props.selectedValue} : undefined;
		return <DropdownField ref="val" choices={selections} selectedValue={val}/>;
	}
});

export default AssetField;
