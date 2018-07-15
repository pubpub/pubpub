import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
// Use Recharts

require('./pubOptionsAnalytics.scss');

const propTypes = {
	// communityData: PropTypes.object.isRequired,
	pubData: PropTypes.object.isRequired,
	// loginData: PropTypes.object.isRequired,
	// setPubData: PropTypes.func.isRequired,
};

class PubOptionsAnalytics extends Component {
	constructor(props) {
		super(props);
		this.state = {
			mapData: undefined,
			visitsData: undefined,
			countryData: undefined,
			toolTipData: undefined,
		};
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
	}

	componentDidMount() {
		fetch('https://assets.pubpub.org/_site/world-50m.json')
		.then((response)=> {
			if (!response.ok) {
				return response.json().then((err)=> { throw err; });
			}
			return response.json();
		})
		.then((data)=> {
			this.setState({ mapData: data });
		})
		.catch((err)=> {
			console.error('Error fetching map data');
		});

		fetch('/api/analytics')
		.then((response)=> {
			if (!response.ok) {
				return response.json().then((err)=> { throw err; });
			}
			return response.json();
		})
		.then((data)=> {
			const visitsData = data[0];
			const countryData = {};
			data[1].forEach((item)=> {
				countryData[item.label] = item.nb_visits;
			});
			this.setState({
				visitsData: visitsData,
				countryData: countryData,
				totalVisits: Object.values(visitsData).reduce((prev, curr)=> {
					return prev + curr.nb_visits;
				}, 0),
			});
		})
		.catch((err)=> {
			console.error('Error fetching analytics data');
		});
	}

	handleMouseMove(geography, evt) {
		const x = evt.clientX;
		const y = evt.clientY + window.pageYOffset;
		// console.log(geography, x, y);
		const countryVisits = this.state.countryData[geography.properties.name] || 0;
		const percentage = this.state.totalVisits ? (Math.round((countryVisits / this.state.totalVisits) * 10000) / 100) : 0;
		this.setState({
			toolTipData: {
				x: x,
				y: y,
				name: geography.properties.name,
				visits: countryVisits,
				percentage: percentage,
			}
		});
	}

	handleMouseLeave() {
		this.setState({ toolTipData: undefined });
	}

	render() {
		const toolTipData = this.state.toolTipData || {};
		const tooltipStyle = {
			top: toolTipData.y,
			left: toolTipData.x,
			position: 'fixed',
		};
		return (
			<div className="pub-options-analytics-component">
				<h1>Analytics</h1>

				{this.state.toolTipData &&
					<div className="pt-elevation-2" style={tooltipStyle}>
						<div><b>Country: </b>{this.state.toolTipData.name}</div>
						<div><b>Visits: </b>{this.state.toolTipData.visits.toLocaleString()}</div>
						<div><b>Percent of Total Visits: </b>{this.state.toolTipData.percentage}%</div>
					</div>
				}

				<h2>Visits</h2>
				{this.state.visitsData &&
					<ResponsiveContainer width="100%" height={150}>
						<AreaChart
							data={Object.keys(this.state.visitsData).sort((foo, bar)=> {
								if (foo < bar) { return -1; }
								if (foo > bar) { return 1; }
								return 0;
							}).map((item)=> {
								return {
									date: item,
									visits: this.state.visitsData[item].nb_visits,
									unique: this.state.visitsData[item].nb_uniq_visitors,
									avgTime: this.state.visitsData[item].avg_time_on_site,
								};
							})}
							margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
						>
							<defs>
								<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#607D8B" stopOpacity={0.6} />
									<stop offset="95%" stopColor="#607D8B" stopOpacity={0} />
								</linearGradient>
							</defs>
							<XAxis dataKey="date" />
							<YAxis />
							<Tooltip
								// labelFormatter={(value, name, props)=> {
								// 	console.log('label props', value, name, props);
								// 	return <span>LABEL</span>
								// }}
								// formatter={(value, name, props)=> {
								// 	console.log('format props', value, name, props);
								// 	return <span>Form</span>
								// }}
								content={(instance)=> {
									if (!instance.active) { return null; }
									const payload = instance.payload[0].payload;
									// console.log(payload);
									return (
										<div className="pt-elevation-2">
											<div><b>{payload.date}</b></div>
											<div>Visits: {payload.visits}</div>
											<div>Unique Visits: {payload.unique}</div>
											<div>Average Time on Page: {payload.avgTime}s</div>
										</div>
									);
								}}
							/>
							<Area type="monotone" dataKey="visits" stroke="#607D8B" fillOpacity={1} fill="url(#colorUv)" />
						</AreaChart>
					</ResponsiveContainer>
				}

				<h2>Visit Locations</h2>
				{this.state.mapData && this.state.countryData &&
					<ComposableMap
						projectionConfig={{
							scale: 205,
							rotation: [-11, 0, 0],
						}}
						width={980}
						height={551}
						style={{
							width: '100%',
							height: 'auto',
						}}
					>
						<ZoomableGroup center={[0, 20]} disablePanning>
							<Geographies geography={this.state.mapData}>
								{(geographies, projection) => {
									return geographies.map((geography) => {
										// console.log(geography);
										const countryVisits = this.state.countryData[geography.properties.name] || 0;
										const visitRatio = this.state.totalVisits ? countryVisits / this.state.totalVisits : 0;
										const fill = `rgba(26, 76, 109, ${visitRatio ? visitRatio * 0.75 + 0.25 : 0.05})`;
										// console.log(geography.properties.name, visitRatio, this.state.countryData[geography.properties.name], this.state.totalVisits);
										return (
											<Geography
												key={geography.id}
												geography={geography}
												projection={projection}
												onMouseMove={this.handleMouseMove}
												onMouseLeave={this.handleMouseLeave}
												style={{
													default: {
														fill: fill,
														stroke: '#607D8B',
														strokeWidth: 0.75,
														outline: 'none',
													},
													hover: {
														fill: '#607D8B',
														stroke: '#607D8B',
														strokeWidth: 0.75,
														outline: 'none',
													},
													pressed: {
														fill: fill,
														stroke: '#607D8B',
														strokeWidth: 0.75,
														outline: 'none',
													},
												}}
											/>
										);
									});
								}}
							</Geographies>
						</ZoomableGroup>
					</ComposableMap>
				}
			</div>
		);
	}
}

PubOptionsAnalytics.propTypes = propTypes;
export default PubOptionsAnalytics;
