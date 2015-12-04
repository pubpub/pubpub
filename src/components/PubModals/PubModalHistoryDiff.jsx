import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalHistoryDiff = React.createClass({
	propTypes: {
		diffObject: PropTypes.object,
		goBackHandler: PropTypes.func,

	},

	getDefaultProps: function() {
		return {
			diffObject: {
				diffTitle: [],
				diffAbstract: [],
				diffAuthorsNote: [],
				diffMarkdown: [],
			},
		};
	},

	closeHandler: function() {
		this.props.goBackHandler(-1);			
	},

	render: function() {
		const renderOrder = [
			'diffTitle',
			'diffAbstract',
			'diffAuthorsNote',
			'diffMarkdown',
		];

		return (
			<div style={styles.container}>

				<div style={styles.backButton} onClick={this.closeHandler}>Back</div>

				{
					renderOrder.map((key, itemIndex)=>{
						// console.log(key);
						// console.log(this.props.diffObject);
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

export default Radium(PubModalHistoryDiff);

styles = {
	container: {
		padding: 15,
	},
	backButton: {
		// display: 'none',
		textAlign: 'right',
		fontSize: '1.5em',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		padding: '0px',
		fontFamily: globalStyles.headerFont,
		margin: '0px 0px 30px 0px',
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			margin: '0px 0px 0px 60px',
			fontSize: '2em',
			padding: '20px 20px',
			width: 'calc(100% - 100px)',
			// display: 'none',
		},
	},
	diffContentWrapper: {
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			paddingLeft: 15,
		},
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
