import React, { PropTypes } from 'react';
import Radium from 'radium';
import { contrastText } from 'utils/contrastText';

export const Tag = React.createClass({
	propTypes: {
		backgroundColor: PropTypes.string,
		isLarge: PropTypes.bool,
		children: PropTypes.node,
	},

	render() {
		const style = {
			backgroundColor: this.props.backgroundColor,
			color: contrastText(this.props.backgroundColor),
			boxShadow: '0px 0px 0px 1px #EEE'
		};
		const classes = this.props.isLarge
			? 'pt-tag pt-large'
			: 'pt-tag';
		return <span className={classes} style={style}>{this.props.children}</span>;
	}

});

export default Radium(Tag);
