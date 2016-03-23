import React, { PropTypes } from 'react';
import Radium from 'radium';
// import {globalStyles} from 'utils/styleConstants';

let styles = {};

const PubMetaHistoryDiff = React.createClass({
	propTypes: {
		diffObject: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			diffObject: {
				diffMarkdown: [],
				diffStyleDesktop: [],
				diffStyleMobile: [],
			},
		};
	},

	render: function() {
		const renderOrder = [
			'diffMarkdown',
			'diffStyleDesktop',
			'diffStyleMobile',
		];

		return (
			<div style={styles.container}>

				{
					renderOrder.map((key, itemIndex)=>{
						const diffItem = this.props.diffObject[key];
						if (diffItem.length > 1 || ((diffItem[0] && diffItem[0].added) || (diffItem[0] && diffItem[0].removed))) {

							return (
								<div key={'diffObject-' + itemIndex} style={styles.diffContentWrapper}>
									<div style={styles.diffTitle}>{key.replace('diff', '')}</div>
									<div style={styles.diffContent}>
										{
											diffItem.map((part, partIndex)=>{
												return <span key={'diffObjectPart-' + partIndex} style={[part.added && styles.additionsText, part.removed && styles.deletionsText]}>{part.value}</span>;
											})
										}
									</div>
								</div>
							);

						}
					})
				}

			</div>
		);
	}
});

export default Radium(PubMetaHistoryDiff);

styles = {
	container: {
		padding: 15,
	},

	diffTitle: {
		margin: '15px 0px',
		fontFamily: 'Courier',
	},
	diffContent: {
		whiteSpace: 'pre-wrap',
		fontFamily: 'Courier',
		fontSize: '14px',
		padding: '0px 5px 0px 30px',
		color: '#999',
	},
	additionsText: {
		backgroundColor: 'rgba(0,255,0,0.3)',
		color: '#000',
	},
	deletionsText: {
		backgroundColor: 'rgba(255,0,0,0.3)',
		color: '#000',
	},

};
