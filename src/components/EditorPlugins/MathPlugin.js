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
		console.log(equation);
		const urlRequest = 'http://localhost:3030/mathtest?equation=' + encodeURI(equation);
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
