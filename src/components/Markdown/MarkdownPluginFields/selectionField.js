import React, {PropTypes} from 'react';

const SelectionField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.object
	},
	value: function() {
		return this.props.selectedValue;
	},
	render: function() {
		const selectionData = this.props.selectedValue;

		if (!selectionData || !selectionData.text) {
			return <span>None</span>;
		}

		const highlightStyle = {
			backgroundColor: 'rgba(111, 232, 111, 0.45)',
			borderRadius: '2px',
		};

		return (<div>
			<span>{selectionData.context.substring(0, selectionData.context.indexOf(selectionData.text))}</span>
			<span style={highlightStyle}>{selectionData.text}</span>
			<span>{selectionData.context.substring(selectionData.context.indexOf(selectionData.text) + selectionData.text.length, selectionData.context.length)}</span>
		</div>);
	}
});

export default SelectionField;
