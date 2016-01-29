import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const License = React.createClass({
	propTypes: {
		hover: PropTypes.bool,
		text: PropTypes.string
	},

	getDefaultProps: function() {
		return {
			hover: false,
			text: 'This work is licensed under a',
		};
	},

	getInitialState() {
		return {
			hover: false,
		};
	},

	hoverOn: function() {
		this.setState({hover: true});
	},

	hoverOff: function() {
		this.setState({hover: false});
	},

	render: function() {
		return (
			<div style={[styles.container, this.props.hover && styles.hoverContainer]} onMouseEnter={this.hoverOn} onMouseLeave={this.hoverOff}>
				<a rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank">
					<img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by/4.0/80x15.png" />
				</a>
				<div style={[this.props.hover && styles.hoverOff, this.props.hover && this.state.hover && styles.hoverOn]}>
					{this.props.text} <a style={styles.link} rel="license" href="http://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons Attribution 4.0 International License</a>.
				</div>
				
			</div>
		);
	}
});

export default Radium(License);

styles = {
	container: {
		color: '#555',
		textAlign: 'center',
		paddingTop: '30px',	
		marginTop: '30px',
		borderTop: '1px solid #ddd',
		fontSize: '0.85em',
	},
	hoverContainer: {
		position: 'relative',
		marginTop: '0px',
		paddingTop: '0px',
		borderTop: '0px solid white',
		display: 'inline-block',
	},
	link: {
		color: 'inherit',
	},
	hoverOff: {
		display: 'none',
		position: 'absolute',
		border: '1px solid black',
		width: '300px',
		right: 0,
		backgroundColor: 'white',
		padding: '5px',
		top: '20px',
		zIndex: 3,
	},
	hoverOn: {
		display: 'block',
		
		
	},
};
