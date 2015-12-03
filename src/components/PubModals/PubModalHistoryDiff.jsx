import React, { PropTypes } from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubModalHistoryDiff = React.createClass({
	propTypes: {
		diffObject: PropTypes.object,
		closeHandler: PropTypes.func,

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

	render: function() {
		const renderOrder = [
			'diffTitle',
			'diffAbstract',
			'diffAuthorsNote',
			'diffMarkdown',
		];

		return (
			<div style={styles.container}>

				<div style={styles.backButton} onClick={this.props.closeHandler}>Back</div>

				{
					renderOrder.map((key)=>{
						if (this.props.diffObject[key].length > 1 || (this.props.diffObject[key][0].added || this.props.diffObject[key][0].removed)) {
							return (
								<div>
									<div style={styles.diffTitle}>{key.replace('diff', '')}</div>
									<div style={styles.diffContent}>
										{
											this.props.diffObject[key].map((part)=>{
												return <span style={[part.added && styles.additionsText, part.removed && styles.deletionsText]}>{part.value}</span>;
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
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
			position: 'absolute',
			top: 0,
		}
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
