import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import request from 'superagent';
import {Loader, PreviewCard} from 'components';
import {GoogleCharts} from 'components';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles;

export const AtomMeta = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	getInitialState() {
		return {
			data: {},
			analyticsLoading: true,
		};
	},
	componentDidMount() {
		const slug = safeGetInToJS(this.props.atomData, ['atomData', 'slug']);
		request.post('/api/analytics').send({
			'input': slug,
			// 'input': 'hello',
			'item': 'pub'
		}).end((err, response)=>{
			// console.log(response.body);
			if (!err) {
				const data = (response && response.body) || {};
				this.setState({
					data: data,
					analyticsLoading: false,
				});
			} else {
				this.setState({
					data: {},
					analyticsLoading: false,
				});
			}

		});
	},

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

	render: function() {
		const isData = Object.keys(this.state.data).length !== 0;
		const gData = this.state.data;
		// const atomData = safeGetInToJS(this.props.atomData, ['atomData']) || {};
		const followersData = safeGetInToJS(this.props.atomData, ['followersData']) || [];
		const convDateViewsArray = [];
		if (isData) {
			gData.dateViewsArray.forEach( function(item) {
				convDateViewsArray.push([new Date(item[0]), item[1]]);
				// convDateViewsArray.push([dateFormat(item[0], 'mmm dd, yyyy'), item[1]]);

			});
		}

		const gChartProps = isData && {
			options: {
				title: '',
				hAxis: {title: '', minValue: this.dataMin(gData.dateViewsArray, 0), maxValue: this.dataMax(gData.dateViewsArray, 0), gridlines: {color: '#fff'}},
				vAxis: {title: '', minValue: this.dataMin(convDateViewsArray, 1), maxValue: this.dataMax(convDateViewsArray, 1)},
				legend: 'none',
			},
			rows: convDateViewsArray,
			columns: [
				{'type': 'datetime', 'label': 'Time'},
				{'type': 'number', 'label': 'Views'},
			],
			chartType: 'LineChart',
			graph_id: 'LineChart',
			width: '100%',
			height: '300px',
			legend_toggle: true,
		};

		return (
			<div>
				<h2>Analytics</h2>
				{!isData && this.state.analyticsLoading && <div style={styles.headWd100}><div style={styles.loadingWrapper}><Loader loading={true} showCompletion={false}/></div></div>}

				{!isData && !this.state.analyticsLoading &&	<div>No Analytics Data Yet</div>}

				{isData && <div>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispL}>{gData.totalViews}</div>
						<div style={styles.blockUnderL}>
							<FormattedMessage id="about.TotalViews" defaultMessage="Total Views"/>
						</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispL}>{Math.round(gData.totalReadTime / 36) / 100}hrs</div>
						<div style={styles.blockUnderL}>
							<FormattedMessage id="about.TotalReadTime" defaultMessage="Total Read Time"/>
						</div>
					</div>
					<div style={[styles.block, {width: 'calc(33% - 16px)'}]}>
						<div style={styles.blockDispL}>{Math.round(gData.averageReadTime * 100) / 100}s</div>
						<div style={styles.blockUnderL}>
							<FormattedMessage id="about.AverageReadTime" defaultMessage="Average Read Time"/>
						</div>
					</div></div>

					<div style={styles.wideContainer}><div style={styles.graphTitle}>Views over Time</div>
					<GoogleCharts {...gChartProps} /></div>

					<br/>

					<div style={styles.wideContainer}>
						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispS}>{gData.totalViewsYear}</div>
							<div style={styles.blockUnderS}>Views Past Year</div>
						</div>
						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispS}>{gData.totalViewsMonth}</div>
							<div style={styles.blockUnderS}>Views Past Month</div>
						</div>
						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispS}>{gData.totalViewsWeek}</div>
							<div style={styles.blockUnderS}>Views Past Week</div>
						</div>
						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispS}>{gData.totalViewsDay}</div>
							<div style={styles.blockUnderS}>Views Past Day</div>
						</div>

						{/* <div style={[styles.block, styles.block25]}>
								<div style={styles.blockDispS}>{gData.totalViewsAveYear}</div>
								<div style={styles.blockUnderS}>Views Ave. Year</div>
							</div>
							<div style={[styles.block, styles.block25]}>
								<div style={styles.blockDispS}>{gData.totalViewsAveMonth}</div>
								<div style={styles.blockUnderS}>Views Ave. Month</div>
							</div>
							<div style={[styles.block, styles.block25]}>
								<div style={styles.blockDispS}>{gData.totalViewsAveWeek}</div>
								<div style={styles.blockUnderS}>Views Ave. Week</div>
							</div>
							<div style={[styles.block, styles.block25]}>
								<div style={styles.blockDispS}>{gData.totalViewsAveDay}</div>
								<div style={styles.blockUnderS}>Views Ave. Day</div>
							</div> */}
					</div>

					<br/>

					<div style={styles.wideContainer}><div style={[styles.block, {width: 'calc(100% - 16px)'}]}>
						<div style={styles.blockDispL}>Countries by Views</div>
					</div>
					{gData.countryOrder.slice(0, 5).map((item, index)=>{
						return (
							<div style={[styles.block, {width: 'calc(100% - 16px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px'}]} key={'country-' + index}>
								<div style={[styles.block, {width: 'calc(55% - 36px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 20%', 'textAlign': 'left'}]}>
									<div style={styles.listItem}>#{index + 1}: {item}</div>
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
							<div style={[styles.block, {width: 'calc(100% - 16px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 0px'}]} key={'city-' + index}>
								<div style={[styles.block, {width: 'calc(55% - 36px)', margin: '0px 0px 0px 0px', padding: '0px 0px 0px 20%', 'textAlign': 'left'}]}>
									<div style={styles.listItem}>#{index + 1}: {item}</div>
								</div>
								<div style={[styles.block, {width: 'calc(10% - 16px)', 'textAlign': 'right'}]}>
									<div style={styles.listItem}>{gData.cityTotalViews[item]}</div>
								</div>
							</div>
						);
					})}</div>

					<br/>

					{/* <div style={styles.wideContainer}>

						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispM}>89</div>
							<div style={styles.blockUnderM}>Interactions</div>
						</div>
						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispM}>13</div>
							<div style={styles.blockUnderM}>Responses</div>
						</div>
						<div style={[styles.block, styles.block25]}>
							<div style={styles.blockDispM}>76</div>
							<div style={styles.blockUnderM}>Ratings</div>
						</div>
						<div style={[styles.block, styles.block25]}>
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
						</div>

					</div> */}

					<br/>

				</div>}

				<h2>Followers ({followersData.length})</h2>
				{
				followersData.sort((foo, bar)=>{
					// Sort so that most recent is first in array
					if (foo.createDate > bar.createDate) { return -1; }
					if (foo.createDate < bar.createDate) { return 1; }
					return 0;
				}).map((item, index)=>{
					if (!item.source) { return null; }
					return (<PreviewCard
						key={'featured-' + index}
						type={'user'}
						image={item.source.image}
						title={item.source.name}
						slug={item.source.username}
						description={item.source.bio} />
					);
				})
			}
			</div>
		);
	}
});

export default Radium(AtomMeta);

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
	block25: {
		width: 'calc(25% - 16px)',

	},
	blockDispL: {
		width: '100%',
		float: 'left',
		'fontSize': '30px',
		'lineHeight': '34px',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	blockUnderL: {
		width: '100%',
		float: 'left',
		'fontSize': '19px',
		'lineHeight': '18px',
		'textAlign': 'center',
		margin: '0px 0px 8px 0px',
	},
	blockDispM: {
		width: '100%',
		float: 'left',
		'fontSize': '25px',
		'lineHeight': '26px',
		'fontWeight': 'bold',
		'textAlign': 'center',
	},
	blockUnderM: {
		width: '100%',
		float: 'left',
		'fontSize': '16px',
		'lineHeight': '14px',
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
		'lineHeight': '16px',
		'textAlign': 'center',
		margin: '0px 0px 4em 0px',
	},
	listItem: {
		width: '100%',
		float: 'left',
		'fontSize': '16px',
		'lineHeight': '14px',
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
		'lineHeight': '16px',
		'textAlign': 'center',
	},
	dispWd50: {
		width: '50%',
		float: 'left',
		'lineHeight': '16px',
		'textAlign': 'center',
	},
	dispWd25: {
		width: '25%',
		float: 'left',
		'lineHeight': '16px',
		'textAlign': 'center',
	},
	dispWd50L: {
		width: '50%',
		float: 'left',
		'lineHeight': '16px',
		'textAlign': 'left',
	},
};
