import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ComposableMap, ZoomableGroup, Geographies, Geography } from 'react-simple-maps';

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
					return prev + curr;
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
		};
		return (
			<div className="pub-options-analytics-component">
				<h1>Analytics</h1>

				{this.state.toolTipData &&
					<div className="map-tooltip pt-elevation-2" style={tooltipStyle}>
						<div><b>Country: </b>{this.state.toolTipData.name}</div>
						<div><b>Visits: </b>{this.state.toolTipData.visits.toLocaleString()}</div>
						<div><b>Percent of Total Visits: </b>{this.state.toolTipData.percentage}%</div>
					</div>
				}
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
