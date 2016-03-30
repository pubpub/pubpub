import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const ReferenceField = React.createClass({
	propTypes: {
		assets: PropTypes.array,
		selectedValue: PropTypes.string,
		saveChange: PropTypes.func,
	},
	getDefaultProps: function() {
		return {
			assets: []
		};
	},
	value: function() {
		return this.refs.val.value();
	},
	render: function() {

		const references = this.props.assets.filter((asset) => (asset.assetType === 'reference' && asset.label))
		.map( function(asset) { return {'value': asset, 'label': asset.label};});

		const val = (this.props.selectedValue) ? {'label': this.props.selectedValue, 'value': this.props.selectedValue} : undefined;
		return <DropdownField saveChange={this.props.saveChange} ref="val" choices={references} selectedValue={val}/>;
	}
});

export default ReferenceField;
