import React, {PropTypes} from 'react';

const ExplainerField = React.createClass({
	propTypes: {
		selectedValue: PropTypes.object,
		explainerText: PropTypes.string
	},
	value: function() {
		return '';
	},
	render: function() {
		return (<div>
			<span>{this.props.explainerText}</span>
		</div>);
	}
});

export default ExplainerField;
