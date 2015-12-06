import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {baseStyles} from './pubModalStyle';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubMetaSource = React.createClass({
	propTypes: {
		historyObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			historyObject: {},
		};
	},

	render: function() {

		const renderOrder = [
			'title',
			'abstract',
			'authorsNote',
			'markdown',
		];

		return (
			<div style={styles.container}>

					{
						renderOrder.map((key, itemIndex)=>{
							if (this.props.historyObject[key].length) {
								return (
									<div key={'historyObject-' + itemIndex} style={styles.historyContentWrapper}>
										<div style={styles.historyTitle}>{key}</div>
										<div style={styles.historyContent} spellCheck="false">{this.props.historyObject[key]}</div>
									</div>
								);	
							}	
						})
					}
					
			</div>
		);
	}
});

export default Radium(PubMetaSource);

styles = {
	container: {
		padding: 15,
	},
	sourceText: {
		fontFamily: 'Courier',
		fontSize: '15px',
		padding: 0,
		margin: 0,
		borderWidth: 0,
		whiteSpace: 'pre-wrap',
		outline: 'none',
	},
	historyTitle: {
		margin: '15px 0px',
		fontFamily: 'Courier',
		color: '#999',
	},
	historyContent: {
		whiteSpace: 'pre-wrap',
		fontFamily: 'Courier',
		fontSize: '14px',
		padding: '0px 5px 0px 30px',
		color: '#555',
	},
};
