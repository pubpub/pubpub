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

let styles = {};

export const Analytics = React.createClass({
	propTypes: {
		dispatch: PropTypes.func,
	},

	handleAnalyticsSubmit: function(evt) {
		evt.preventDefault();
		this.props.dispatch(analytics(this.refs.input.value, this.refs.item.value));
	},

	render: function() {
		const metaData = {
			title: 'PubPub Analytics',
		};
		const isData = this.props.data && this.props.data != undefined;

		const data = safeGetInToJS(this.props.data, []) || {}; 
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