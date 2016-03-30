import React, {PropTypes} from 'react';
import DropdownField from './baseDropdownField';

const ReferenceField = React.createClass({
	propTypes: {
		assets: PropTypes.array,
		selectedValue: PropTypes.object,
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

		const selectedRef = (this.props.selectedValue) ? this.props.assets.find((asset) => (asset._id === this.props.selectedValue._id)) : null;

		return <DropdownField saveChange={this.props.saveChange} ref="val" choices={references} selectedValue={selectedRef}/>;
	}
});

export default ReferenceField;
