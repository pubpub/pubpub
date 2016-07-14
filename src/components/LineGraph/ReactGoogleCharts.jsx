import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';

//Requires npm install react-google-charts
//Note that GCharts cannot be hosted locally, as stated in GCharts ToS.

//Data should be an array of pairs
//gChartProps are settings for this chart

let Chart;
let styles = {};

const ReactGoogleCharts = React.createClass({
	propTypes: {
		options: PropTypes.object,
		rows: PropTypes.array,
		columns: PropTypes.array,
		chartType: PropTypes.string,
		graph_id: PropTypes.string,
		width: PropTypes.string,
		height: PropTypes.string,
		legend_toggle: PropTypes.bool,
	},

	componentWillMount() {
		Chart = require('react-google-charts').Chart;
	},

	componentDidMount() {
		var chart_events = [{
			eventName: 'onmouseover',
			callback: function(Chart){
				console.log('Mouseover Event')
			}
		}];
	},

	render: function() {
		if (!Chart) {
			return <span>React-Google-Charts not functional.</span>
		}
		return <Chart chartType = {this.props.chartType}
		rows = {this.props.rows}
		columns = {this.props.columns}
		options = {this.props.options}
		graph_id = {this.props.graph_id + '1'}
		width = {this.props.width}
		height = {this.props.height}
		legend_toggle = {this.props.legend_toggle} />
	}
});

export default Radium(ReactGoogleCharts);