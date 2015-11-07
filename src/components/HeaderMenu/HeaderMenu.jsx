import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalStyles} from '../../utils/styleConstants';

// let styles = {};

const HeaderMenu = React.createClass({
	propTypes: {
		loginData: PropTypes.object,
		navData: PropTypes.object,
		color: PropTypes.string,
		hoverColor: PropTypes.string,
		loginToggle: PropTypes.func
	},

	headerTextColorStyle: function() {
		return {
			color: this.props.color,
			':hover': {
				color: this.props.hoverColor,
			}
		};
	},

	render: function() {
		

		return (
			<div >

				Menu

			</div>
		);
	}
});

export default Radium(HeaderMenu);

