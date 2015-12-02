import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
import PubModalHistoryRow from './PubModalHistoryRow';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalHistory = React.createClass({
	propTypes: {
		historyData: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			historyData: [],
		};
	},

	render: function() {
		console.log(this.props.historyData);
		return (
			<div style={baseStyles.pubModalContainer}>

				<div style={baseStyles.pubModalTitle}>History</div>

				{()=>{
					const historyDivs = [];

					for (let index = this.props.historyData.length; index-- > 0; ) {
						historyDivs.push( 
							<PubModalHistoryRow key={'historyRow-' + index} historyItem={this.props.historyData[index]} index={index} />
						);
					}

					return historyDivs;
				}()}
				
			</div>
		);
	}
});

export default Radium(PubModalHistory);

styles = {
	
};
