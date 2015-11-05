import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const PubNav = React.createClass({
	propTypes: {
		height: PropTypes.number,
		navClickFunction: PropTypes.func,
		status: PropTypes.string
	},

	render: function() {
		const navClickFunction = this.props.navClickFunction;
		function clickWrapper(clickOption) {
			return ()=>navClickFunction(clickOption);
		}

		const navOptionsLeft = [
			'Table of Contents',
			'History',
			'Read Mode',
			'Source',
			'Print',
			'Cite'
		];
		const navOptionsRight = [
			'Edit Pub'
		];

		return (
			<div>
				<ul style={[styles.list, styles[this.props.status]]}>
					{navOptionsLeft.map((option)=>{
						return <li key={option} style={[styles.option, styles.leftOption]} onClick={clickWrapper(option)}>{option}</li>;
					})}

					{navOptionsRight.map((option)=>{
						return <li key={option} style={[styles.option, styles.rightOption]} onClick={clickWrapper(option)}>{option}</li>;
					})}
					
				</ul>
			</div>
		);
	}
});


styles = {
	list: {
		height: 30,
		listStyle: 'none',
		padding: 0,
		margin: 0,
		transition: '.3s linear opacity .2s',
	},
	loading: {
		opacity: 0,
	}, 
	loaded: {
		opacity: 1
	},
	option: {
		height: '100%',
		lineHeight: '30px',
		padding: '0px 5px',
		cursor: 'pointer',
		color: '#555',
		':hover': {
			color: '#222'
		}
	},
	leftOption: {
		float: 'left'
	},
	rightOption: {
		float: 'right'
	}
};
	
export default Radium(PubNav);
