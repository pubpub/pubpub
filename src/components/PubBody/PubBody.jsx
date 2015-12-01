import React, {PropTypes} from 'react';
import Radium from 'radium';
// import Markdown from 'react-remarkable';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		title: PropTypes.string,
		abstract: PropTypes.string,
		htmlTree: PropTypes.array,
		authors: PropTypes.array,
	},
	getDefaultProps: function() {
		return {
			htmlTree: [],
		};
	},

	render: function() {
		return (
			<div style={styles.container}>

				<div style={[styles.contentContainer, styles[this.props.status]]}>
					
					<h1 style={styles.pubTitle}>{this.props.title}</h1>
					<p style={styles.pubAbstract}>{this.props.abstract}</p>
					<div style={styles.headerDivider}></div>

					{this.props.htmlTree}

				</div>
				
			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		borderRadius: 1,
		minHeight: 'calc(100vh - 2 * ' + globalStyles.headerHeight + ' + 3px)',
	},
	contentContainer: {
		transition: '.3s linear opacity .25s',
		padding: '0px 10px',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	pubTitle: {
		textAlign: 'center',
		fontSize: '40px',
		margin: '50px 0px',
	},
	pubAbstract: {
		textAlign: 'center',
		fontSize: '20px',
		margin: '30px 0px',
	},
	headerDivider: {
		height: 1,
		width: '80%',
		margin: '0 auto',
		backgroundColor: '#DDD',
	},

};

export default Radium(PubBody);
