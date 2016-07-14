import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';

var d3 = require("d3"); //requires npm install d3
import {LineGraphDataCircles, LineGraphLine, XYAxis} from 'components';

//This uses REACT to render dots and D3 to render axis and scale

//Data should be an array of pairs
//Line props are settings

let styles = {};

const LineGraph = React.createClass({
	propTypes: {
		data: PropTypes.array,
		lineProps: PropTypes.object,
	},

	getInitialState() {
		return {};
	},

	//Returns the largest & smallest X coordinate from the data set
	xMax: function(data) {return d3.max(data, (d) => d[0])},
	xMin: function(data) {return d3.min(data, (d) => d[0])},

	//Returns the largest & smallest y coordinate from the data set
	yMax: function(data) {return d3.max(data, (d) => d[1])},
	yMin: function(data) {return d3.min(data, (d) => d[1])},

	//Returns a scale function that "scales" X coordinates from the data to fit the chart
	xScale: function(lineProps) {
		return d3.scaleTime()
			.domain([this.xMin(lineProps.data), this.xMax(lineProps.data)])
			.range([lineProps.widthPadL, lineProps.width - lineProps.widthPadH]);
			//For reference, domain is the upper and lower for data
			//Range is the desired pixel display
	},

	//Returns a scale function that "scales" Y coordinates from the data to fit the chart
	yScale: function(lineProps) {
		return d3.scaleLinear()
			.domain([0, this.yMax(lineProps.data)])
			.range([lineProps.height - lineProps.heightPadL, lineProps.heightPadH]);
	},

	//Typical render return function
	render: function() {
		const lineProps = this.props.lineProps;
		const scales = { xScale: this.xScale(lineProps), yScale: this.yScale(lineProps) };
		return (
			<svg width={lineProps.width} height={lineProps.height}>
				<LineGraphLine {...lineProps} {...scales} />
				<XYAxis {...lineProps} {...scales} />
			</svg>
		);
		//Datacircles is not needed for the current display, but could be used to add hover snap features
	}
});

export default Radium(LineGraph);