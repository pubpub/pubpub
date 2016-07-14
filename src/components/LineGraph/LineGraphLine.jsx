import React, {PropTypes} from 'react';

var d3 = require("d3");
//Uses d3 to render a line from the data set
//Takes data set (array of pairs) and generates connected point for each pair
//Inherits scaling functions that take data and return the position of the point

//Note that there is no clearing for the line. This is done by react on each re render.
//+ Can be used multiple times on the same webpage safely
//- Will regenerate on webpack hotload

export default class Line extends React.Component {
	componentDidMount() {
		this.renderLine();
	}

	componentDidUpdate() {
		this.renderLine();
	}

	renderLine() {
		let xScale = this.props.xScale;
		let yScale = this.props.yScale;
		//Line point functions
		var line = d3.line()
			.x(function(d) { return xScale(d[0]); })
			.y(function(d) { return yScale(d[1]); });
		//Where in the html the line is generated
		var htmlref = this.refs.line;
		//Actual generation and display settings
		d3.select(htmlref).append('path')
			.datum(this.props.data)
			.attr('class','line')
			.attr('d',line)
			.attr('fill','none')
			.attr('stroke','#58585B');
	}

	render() {
		return <g className="line" ref="line"></g>
	}
}