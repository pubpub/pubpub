import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {analytics} from './actions';
import {Link} from 'react-router';
import {safeGetInToJS} from 'utils/safeParse';

import {globalStyles} from 'utils/styleConstants'; //These are global styles, accessed from utilities.
import {globalMessages} from 'utils/globalMessages'; //These are global messages, accessed from utilities.
import {FormattedMessage} from 'react-intl'; //Used for international language functionality.


import {LineGraph} from 'components';
import {ReactGoogleCharts} from 'components';
import {GoogleCharts} from 'components';


let styles = {};

export const Analytics = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
	},

	handleAnalyticsSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(analytics(this.refs.input.value, this.refs.item.value));
	},

	dataMax: function(data, ind) {
		var newArray = [];
		data.map(function(d){newArray.push(d[ind])})
		return Math.max(newArray)
	},

	dataMin: function(data, ind) {
		var newArray = [];
		data.map(function(d){newArray.push(d[ind])})
		return Math.min(newArray)
	},

	render: function() {
		const metaData = {
			title: 'PubPub Analytics',
		};
		const isData = this.props.data && this.props.data != undefined;

		const data = safeGetInToJS(this.props.data, []) || {};

		const lineProps = isData && {
			width: 360,
			widthPadH: 40, //Padding values (high, low)
			widthPadL: 40,
			height: 160,
			heightPadH: 20,
			heightPadL: 20,
			data: data.dateViewsArray
		}
		const gChartProps = isData && {
			options: {
				title: 'Views vs Time Comparison',
				hAxis: {title: 'Time', minValue: this.dataMin(data.dateViewsArray,0), maxValue: this.dataMax(data.dateViewsArray,0)},
				vAxis: {title: 'Views', minValue: this.dataMin(data.dateViewsArray,1), maxValue: this.dataMax(data.dateViewsArray,1)},
				legend: 'none'},
			rows: data.dateViewsArray,
			columns: [{'type': 'number','label':'Time'},
				{'type': 'number','label':'Views'}],
			chartType: 'LineChart',
			graph_id: 'LineChart',
			width: '400px',
			height: '180px',
			legend_toggle: true
		}
		return (
			<div className={'login-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h1>Analytics</h1>

				<form onSubmit={this.handleAnalyticsSubmit}>
					<div>
						<label style={styles.label} htmlFor={'input'}>
							Slug of Desired
						</label>
						<input ref={'input'} id={'input'} name={'input'} type="text" style={styles.input}/>
					</div>

					<select className={'button'} ref={'item'}>
						<option value='pub'>Pub</option>
						<option value='journal'>Journal</option>
					</select>

					<br/><br/>

					<button className={'button'} onClick={this.handleAnalyticsSubmit}>
						Submit
					</button>

				</form>

				<br/>

				{isData && <div>
					<label style={styles.label} htmlFor={'data'}>
						Totals
					</label>
					<label style={styles.input} htmlFor={'data'}>
						Total Views: {data.totalViews}
					</label>
					<label style={styles.input} htmlFor={'data'}>
						Unique Views: {data.totalUniqueViews}
					</label>
					<label style={styles.input} htmlFor={'data'}>
						Returning Readers: {data.totalReturnViews}
					</label>
					<label style={styles.input} htmlFor={'data'}>
						Average Read Time: {Math.round(data.averageReadTime*100)/100}s
					</label>
					<label style={styles.input} htmlFor={'data'}>
						Total Read Time: {Math.round(data.totalReadTime/36)/100}hrs
					</label>

					<br/>
		
					<label style={styles.label} htmlFor={'input'}>D3 Views vs Time Graph</label>
					<LineGraph lineProps={lineProps} />

					<br/>

					<label style={styles.label} htmlFor={'input'}>GCharts Views vs Time Graph</label>
					<ReactGoogleCharts {...gChartProps} />

					<br/>

					<label style={styles.label} htmlFor={'input'}>GCharts Views vs Time Graph</label>
					<GoogleCharts {...gChartProps} />

					<br/>

					<label style={styles.label} htmlFor={'data'}>
						Countries by Views
					</label>

					{data.countryOrder.slice(0,5).map((item, index)=>{
						return (
							<label style={styles.input} htmlFor={'data'}>
								#{index+1}: {item}: {data.countryTotalViews[item]}
							</label>
						);
					})}

					<br/>

					<label style={styles.label} htmlFor={'data'}>
						Cities by Views
					</label>

					{data.cityOrder.slice(0,3).map((item, index)=>{
						return (
							<label style={styles.input} htmlFor={'data'}>
								#{index+1}: {item}: {data.cityTotalViews[item]}
							</label>
						);
					})}

					<br/>

					<label style={styles.label} htmlFor={'data'}>
						Continents by Views
					</label>

					{data.continentOrder.slice(0,3).map((item, index)=>{
						return (
							<label style={styles.input} htmlFor={'data'}>
								#{index+1}: {item}: {data.continentTotalViews[item]}
							</label>
						);
					})}
				</div>}
				
			</div>
		);
	}

});

//NOTE add graphics
export default connect( state => {
	return {
		data: state.analytics.get('data'),
	};
})( Radium(Analytics) );

styles = {
	container: {
		width: '500px',
		padding: '0px 15px',
		margin: '0 auto',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 30px)',
		}
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
		color: 'black'
	}
};