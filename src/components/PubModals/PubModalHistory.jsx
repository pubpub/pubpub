import React, { PropTypes } from 'react';
import Radium from 'radium';
import {baseStyles} from './pubModalStyle';
import PubModalHistoryRow from './PubModalHistoryRow';
import PubModalHistoryDiff from './PubModalHistoryDiff';
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

	getInitialState() {
		return {
			activeChangesViewer: undefined,
		};
	},

	showChangesViewer: function(index) {
		return ()=>{
			this.setState({
				activeChangesViewer: this.props.historyData[index].diffObject
			});	
			document.getElementById('modal-container').scrollTop = 0;
		};
	},

	hideChangesViewer: function() {
		this.setState({activeChangesViewer: undefined});
		document.getElementById('modal-container').scrollTop = 0;
	},

	render: function() {
		console.log(this.props.historyData);
		// const diffObject =  || {diffMarkdown: []};
		return (
			<div style={[baseStyles.pubModalContainer, styles.container]}>

				<div style={[styles.shown, this.state.activeChangesViewer !== undefined && styles.hidden]}>
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

				<div style={[styles.hidden, this.state.activeChangesViewer !== undefined && styles.shown]}>
					<PubModalHistoryDiff diffObject={this.state.activeChangesViewer} closeHandler={this.hideChangesViewer}/>
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
	},

	shown: {
		display: 'block',
	},
};
