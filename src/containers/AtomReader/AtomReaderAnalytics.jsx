import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {safeGetInToJS} from 'utils/safeParse';
import {safeGetInToJS} from 'utils/safeParse';
import request from 'superagent';
import Helmet from 'react-helmet';
import {Loader} from 'components';
import {GoogleCharts} from 'components';


let styles = {};

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
		const slug = safeGetInToJS(this.props.atomData, ['atomData', 'slug']);
		request.post('/api/analytics').send({
			'input': slug,
			// 'input': 'hello',
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
	// (New + Return)(Ave		)(Response#+ Ratings)(#Versions + Rec Date	)
	// 
	// (#1 Country + Views	)(#1 City + Views	)
	// (#2 + Views			)(#2 + Views		)
	// (#3 + Views			)(#3 + Views		)
	//
	// (Journals Feat 	)(Words # 	)(Pages #	)
	//
	// (VIEW GRAPH HERE)
	//
	// (Views Year) (Views Month) (Views Week) (Views 24hrs)

	render: function() {

		const metaData = {
			title: 'PubPub Analytics',
		};
		const isData = Object.keys(this.state.data).length !== 0;
		const gData = this.state.data;
		const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const convDateViewsArray = [];
		if (isData) {
			gData.dateViewsArray.forEach( function(item) {
				convDateViewsArray.push([new Date(item[0]), item[1]])
			})
		}
		const gChartProps = isData && {
			options: {
				title: '',
				hAxis: {title: '', minValue: this.dataMin(gData.dateViewsArray, 0), maxValue: this.dataMax(gData.dateViewsArray, 0), gridlines: {color: '#fff'}},
				vAxis: {title: '', minValue: this.dataMin(convDateViewsArray, 1), maxValue: this.dataMax(convDateViewsArray, 1)},
				legend: 'none'},
			rows: convDateViewsArray,
			columns: [
				{'type': 'datetime', 'label': 'Time'},
				{'type': 'number', 'label': 'Views'},
			],
			chartType: 'LineChart',
			graph_id: 'LineChart',
			width: '100%',
			height: '300px',
			legend_toggle: true
		};

		return (
			<div className={'login-container'} style={styles.container}>
				<Helmet {...metaData} />

				<h2 className={'normalWeight'}>Analytics</h2>

				{!isData && <div style={styles.headWd100}><div style={styles.loadingWrapper}><Loader loading={true} showCompletion={false}/></div></div>}

				{isData && <div>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispL}>{gData.totalViews}</div>
						<div style={styles.blockUnderL}>Total Views</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispL}>{Math.round(gData.totalReadTime / 36) / 100}hrs</div>
						<div style={styles.blockUnderL}>Total Read Time</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispL}>{Math.round(gData.averageReadTime * 100) / 100}s</div>
						<div style={styles.blockUnderL}>Average Read Time</div>
					</div></div>

					<div style={styles.wideContainer}><div style={styles.graphTitle}>Views vs. Time</div>
					<GoogleCharts {...gChartProps} /></div>

					<br/>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsYear}</div>
						<div style={styles.blockUnderS}>Views Past Year</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsMonth}</div>
						<div style={styles.blockUnderS}>Views Past Month</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsWeek}</div>
						<div style={styles.blockUnderS}>Views Past Week</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsDay}</div>
						<div style={styles.blockUnderS}>Views Past Day</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsAveYear}</div>
						<div style={styles.blockUnderS}>Views Ave. Year</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsAveMonth}</div>
						<div style={styles.blockUnderS}>Views Ave. Month</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsAveWeek}</div>
						<div style={styles.blockUnderS}>Views Ave. Week</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispS}>{gData.totalViewsAveDay}</div>
						<div style={styles.blockUnderS}>Views Ave. Day</div>
					</div></div>
					
					<br/>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(100% - 16px)'}]}>
						<div style={styles.blockDispL}>Countries by Views</div>
					</div>
					{gData.countryOrder.slice(0, 5).map((item, index)=>{
						return (
							<div style={[styles.block, {width: 'calc(100% - 16px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px'}]}>
							<div style={[styles.block, {width: 'calc(55% - 36px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 20%', 'textAlign': 'left'}]}>
								<div style={styles.listItem}>#{index+1}: {item}</div>
							</div>
							<div style={[styles.block, {width: 'calc(10% - 16px)', 'textAlign': 'right'}]}>
								<div style={styles.listItem}>{gData.countryTotalViews[item]}</div>
							</div>
							</div>
						);
					})}</div>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(100% - 16px)'}]}>
						<div style={styles.blockDispL}>Cities by Views</div>
					</div>
					{gData.cityOrder.slice(0, 5).map((item, index)=>{
						return (
							<div style={[styles.block, {width: 'calc(100% - 16px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px'}]}>
							<div style={[styles.block, {width: 'calc(55% - 36px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 20%', 'textAlign': 'left'}]}>
								<div style={styles.listItem}>#{index+1}: {item}</div>
							</div>
							<div style={[styles.block, {width: 'calc(10% - 16px)', 'textAlign': 'right'}]}>
								<div style={styles.listItem}>{gData.cityTotalViews[item]}</div>
							</div>
							</div>
						);
					})}</div>

					<br/>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispM}>89</div>
						<div style={styles.blockUnderM}>Interactions</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispM}>13</div>
						<div style={styles.blockUnderM}>Responses</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispM}>76</div>
						<div style={styles.blockUnderM}>Ratings</div>
					</div>
					<div style={[styles.block, {width: 'calc(25% - 16px)'}]}>
						<div style={styles.blockDispM}>2</div>
						<div style={styles.blockUnderM}>Journal Features</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispM}>{Math.round(100 * 89 / gData.totalUniqueViews)}%</div>
						<div style={styles.blockUnderM}>Interactivity</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispM}>{gData.totalUniqueViews}</div>
						<div style={styles.blockUnderM}>Unique Views</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispM}>{gData.totalReturnViews}</div>
						<div style={styles.blockUnderM}>Returning Readers</div>
					</div></div>

					<br/>

				</div>}
				
			</div>
		);
	}
});

export default Radium(AtomReaderAnalytics);

styles = {
	loadingWrapper: {
		margin: '0 auto',
		width: '40px',
	},
	wideContainer: {
		width: '100%',
		overflow: 'hidden'
	},
	graphTitle: {
		width: '100%',
		margin: '16px 0px -6px 0px',
		'fontSize': '24px',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	block: {
		margin: '0px 4px 4px 4px',
		padding: '4px 4px 4px 4px',
		float: 'left',
	},
	blockDispL: {
		width: '100%',
		float: 'left',
		'fontSize': '30px',
		'line-height': '34px',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	blockUnderL: {
		width: '100%',
		float: 'left',
		'fontSize': '19px',
		'line-height': '18px',
		'textAlign': 'center',
		margin: '0px 0px 8px 0px',
	},
	blockDispM: {
		width: '100%',
		float: 'left',
		'fontSize': '25px',
		'line-height': '26px',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	blockUnderM: {
		width: '100%',
		float: 'left',
		'fontSize': '16px',
		'line-height': '14px',
		'textAlign': 'center',
		margin: '0px 0px 8px 0px',
	},
	blockDispS: {
		width: '100%',
		float: 'left',
		'fontSize': '18px',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	blockUnderS: {
		width: '100%',
		float: 'left',
		'line-height': '16px',
		'textAlign': 'center',
		margin: '0px 0px 4em 0px',
	},
	listItem: {
		width: '100%',
		float: 'left',
		'fontSize': '16px',
		'line-height': '14px',
	},











	headWd100: {
		width: '100%',
		float: 'left',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	headWd50: {
		width: '50%',
		float: 'left',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	headWd25: {
		width: '25%',
		float: 'left',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	dispWd100: {
		width: '100%',
		float: 'left',
		'line-height': '16px',
		'textAlign': 'center',
	},
	dispWd50: {
		width: '50%',
		float: 'left',
		'line-height': '16px',
		'textAlign': 'center',
	},
	dispWd25: {
		width: '25%',
		float: 'left',
		'line-height': '16px',
		'textAlign': 'center',
	},
	dispWd50L: {
		width: '50%',
		float: 'left',
		'line-height': '16px',
		'textAlign': 'left',
	},
};