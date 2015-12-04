import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
import PubModalHistoryRow from './PubModalHistoryRow';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalHistory = React.createClass({
	propTypes: {
		historyData: PropTypes.array,
		setQueryHandler: PropTypes.func,
	},

	getDefaultProps: function() {
		return {
			historyData: [],
		};
	},

	showChangesViewer: function(index) {
		
		return ()=>{
			this.props.setQueryHandler({
				mode: 'history',
				diff: index,
			});	
		};

	},

	render: function() {
		return (
			<div style={[baseStyles.pubModalContainer, styles.container]}>

				<div>
					<div style={baseStyles.pubModalTitle}>History</div>

					{()=>{
						const historyDivs = [];

						for (let index = this.props.historyData.length; index-- > 0; ) {
							historyDivs.push( 
								<PubModalHistoryRow key={'historyRow-' + index} historyItem={this.props.historyData[index]} index={index} setDiffViewer={this.showChangesViewer}/>
							);
						}

						return historyDivs;
					}()}
				</div>
				
			</div>
		);
	}
});

export default Radium(PubModalHistory);

styles = {
	container: {
		overflow: 'hidden',
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
