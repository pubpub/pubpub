import React, { PropTypes } from 'react';
import Radium from 'radium';
import PubMetaHistoryRow from './PubMetaHistoryRow';
// import {globalStyles} from 'utils/styleConstants';

let styles = {};

const PubMetaHistory = React.createClass({
	propTypes: {
		historyData: PropTypes.array,
		slug: PropTypes.string
	},

	getDefaultProps: function() {
		return {
			historyData: [],
		};
	},

	render: function() {
		return (
			<div style={[styles.container]}>

					{(()=>{
						const historyDivs = [];

						for (let index = this.props.historyData.length; index-- > 0; ) {
							historyDivs.push( 
								<PubMetaHistoryRow 
									key={'historyRow-' + index} 
									historyItem={this.props.historyData[index]} 
									index={index} 
									slug={this.props.slug}/>
							);
						}

						return historyDivs;
					})()}
				
			</div>
		);
	}
});

export default Radium(PubMetaHistory);

styles = {
	container: {
		overflow: 'hidden',
		padding: 15,
	},

	hidden: {
		display: 'none',
		transform: 'translateX(105%)',
		transition: '.1s linear transform',
	},

	shown: {
		display: 'block',
		position: 'absolute',
		top: 0,
		left: 0,
		width: 'calc(100% - 30px)',
		height: 'calc(100% - 30px)',
		padding: 15,
		overflowY: 'scroll',
		transform: 'translateX(0%)',
		transition: '.1s linear transform',

		backgroundColor: 'rgba(200,0,0,0.8)',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			position: 'fixed',
			top: '0px',
			left: '0px',
			// paddingLeft: '15px',
			height: '100vh',
			overflow: 'hidden',
			overflowY: 'scroll',
		}
	},
};
