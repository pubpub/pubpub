import React, {PropTypes} from 'react';
import Radium from 'radium';
import smoothScroll from 'smoothscroll';
// import { Link } from 'react-router';
// import {globalStyles} from 'utils/styleConstants';

let styles;

export const AtomHeader = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		tocData: PropTypes.array,
	},

	handleScroll: function(id) {
		const destination = document.getElementById(id);
		if (!destination) { return undefined; }
		smoothScroll(destination);
	},

	render: function() {
		const toc = this.props.tocData || [];

		return (
			<div>
				{toc.map((object, index)=>{
					return <div key={'toc-' + index} className={'underlineOnHover'} style={[styles.tocItem, styles.tocLevels[object.level - 1]]} onClick={this.handleScroll.bind(this, object.id)}>{object.title}</div>;
				})}	
			</div>
		);
	}
});

export default Radium(AtomHeader);

styles = {
	tocItem: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		padding: '1em 0em 0em 0em',
		cursor: 'pointer',
	},

	tocLevels: [
		{paddingLeft: '0em'},
		{paddingLeft: '2em'},
		{paddingLeft: '3em'},
		{paddingLeft: '4em'},
		{paddingLeft: '5em'},
		{paddingLeft: '6em'},
	],
};
