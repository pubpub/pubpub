import React, {PropTypes} from 'react';
import Radium from 'radium';

// let styles = {};

const MathPlugin = React.createClass({
	propTypes: {
		svg: PropTypes.string,
		children: PropTypes.string
	},
	render: function() {
		const equation = this.props.children;
		const urlRequest = 'https://dry-retreat-1640.herokuapp.com/mathtest?equation=' + encodeURIComponent(equation) + '&cache=true';
		return (
      <img src={urlRequest}></img>
		);
	}
});

/*
styles = function() {
	return {
	};
};
*/

export default Radium(MathPlugin);
