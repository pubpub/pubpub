import React from 'react';

var d3 = require("d3"); //requires npm install d3

//Uses d3 to render an axis for the data set
//Inherits scaling functions to generate axis

export default class Axis extends React.Component {
	componentDidMount() {
		this.renderAxis();
	}

	componentDidUpdate() {
		this.renderAxis();
	}

	renderAxis() {
		//Uses conditionals as these are no longer axis settings (to my knowledge)
		var htmlref = this.refs.axis;
		if(this.props.orient == 'left')
		{
			d3.select(htmlref).call(d3.axisLeft(this.props.scale).ticks(5))
		}
		if(this.props.orient == 'bottom')
		{
			d3.select(htmlref).call(d3.axisBottom(this.props.scale).ticks(5))
		}
		if(this.props.orient == 'right')
		{
			d3.select(htmlref).call(d3.axisRight(this.props.scale).ticks(5))
		}
		if(this.props.orient == 'top')
		{
			d3.select(htmlref).call(d3.axisTop(this.props.scale).ticks(5))
		}

		//Old D3 version
		//var axis = d3.svg.axis().orient(this.props.orient).ticks(5).scale(this.props.scale);
		//d3.select(node).call(axis);
		//console.log(axis)
	}

	render() {
		return <g className="axis" ref="axis" transform={this.props.translate}></g>
	}
}