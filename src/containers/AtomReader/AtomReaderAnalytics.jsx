import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {safeGetInToJS} from 'utils/safeParse';
import request from 'superagent';
import Helmet from 'react-helmet';

import {GoogleCharts} from 'components';


const styles = {};

export const AtomReaderAnalytics = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},
	getInitialState() {
		return {
			data: {},
		};
	},
	componentDidMount() {
		// const slug = safeGetInToJS(this.props.atomData, ['atomData', 'slug']);
		request.post('/api/analytics').send({
			// 'input': slug,
			'input': 'hello',
			'item': 'pub'
		}).end((err, response)=>{
			console.log(response);
			console.log(response.body);
			this.setState({data: response.body});
		});
	},

	// handleAnalyticsSubmit: function(evt) {
	// 	evt.preventDefault();
	// 	this.props.dispatch(analytics(this.refs.input.value, this.refs.item.value));
	// },

	dataMax: function(data, ind) {
		const newArray = [];
		data.map(function(index) { newArray.push(index[ind]); });
		return Math.max(newArray);
	},

	dataMin: function(data, ind) {
		const newArray = [];
		data.map(function(index) { newArray.push(index[ind]); });
		return Math.min(newArray);
	},

	// Analytics display planning
	// Words/ Comments/ Journals/ Pages. Pub info that sort of shows the size and effect of the pub.
	// 		Possible inclusions: Percent views to comments/rating (pub interactivity).
	// 		Showing these over time (small graph).
	//		Following 
	//		Pub Date (days online or whatever)
	// Webpage info that has more to do with viewership and display than interactivity.
	//		Views, Returning Views, Demographics (locations), Read time
	//		Breakdown into cumulative, last month, last week
	// Author info
	//		Author views, words, comments, journal feats, pages, views, pretty much all the same data

	// Display
	// TITLE
	// (	Views 	)(Read Time	)(Interactions		)(		Pub Date		)
	// (New + Return)(Ave		)(Comments + Ratings)(#Versions + Rec Date	)
	// 
	// (#1 Country + Views	)(#1 City + Views	)
	// (#2 + Views			)(#2 + Views		)
	// (#3 + Views			)(#3 + Views		)
	//
	// (feat stuff)

	render: function() {

		const metaData = {
			title: 'PubPub Analytics',
		};

		const isData = Object.keys(this.state.data).length !== 0;

		const data = this.state.data;

		const gChartProps = isData && {
			options: {
				title: 'Views vs Time Comparison',
				hAxis: {title: 'Time', minValue: this.dataMin(data.dateViewsArray, 0), maxValue: this.dataMax(data.dateViewsArray, 0)},
				vAxis: {title: 'Views', minValue: this.dataMin(data.dateViewsArray, 1), maxValue: this.dataMax(data.dateViewsArray, 1)},
				legend: 'none'},
			rows: data.dateViewsArray,
			columns: [
				{'type': 'number', 'label': 'Time'},
				{'type': 'number', 'label': 'Views'}
			],
			chartType: 'LineChart',
			graph_id: 'LineChart',
			width: '100%',
			height: '400px',
			legend_toggle: true
		};
		return (
			<div className={'login-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h2 className={'normalWeight'}>Analytics</h2>

				{!isData && <div>Loading Analytics...</div>}

				{isData && <div>
					<label htmlFor={'data'}>
						Totals
					</label>
					<label htmlFor={'data'}>
						Total Views: {data.totalViews}
					</label>
					<label htmlFor={'data'}>
						Unique Views: {data.totalUniqueViews}
					</label>
					<label htmlFor={'data'}>
						Returning Readers: {data.totalReturnViews}
					</label>
					<label htmlFor={'data'}>
						Average Read Time: {Math.round(data.averageReadTime * 100) / 100}s
					</label>
					<label htmlFor={'data'}>
						Total Read Time: {Math.round(data.totalReadTime / 36) / 100}hrs
					</label>

					<br/>
		
					<label htmlFor={'input'}>GCharts Views vs Time Graph</label>
					<GoogleCharts {...gChartProps} />

					<br/>

					<label htmlFor={'data'}>
						Countries by Views
					</label>

					{data.countryOrder.slice(0, 5).map((item, index)=>{
						return (
							<label htmlFor={'data'}>
								#{index + 1}: {item}: {data.countryTotalViews[item]}
							</label>
						);
					})}

					<br/>

					<label htmlFor={'data'}>
						Cities by Views
					</label>

					{data.cityOrder.slice(0, 3).map((item, index)=>{
						return (
							<label htmlFor={'data'}>
								#{index + 1}: {item}: {data.cityTotalViews[item]}
							</label>
						);
					})}

					<br/>

					<label htmlFor={'data'}>
						Continents by Views
					</label>

					{data.continentOrder.slice(0, 3).map((item, index)=>{
						return (
							<label htmlFor={'data'}>
								#{index + 1}: {item}: {data.continentTotalViews[item]}
							</label>
						);
					})}
				</div>}
				
			</div>
		);
	}
});

export default Radium(AtomReaderAnalytics);
