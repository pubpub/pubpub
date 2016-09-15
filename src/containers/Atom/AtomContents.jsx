import React, {PropTypes} from 'react';
import Radium from 'radium';
import smoothScroll from 'smoothscroll';
// import { Link } from 'react-router';
// import {globalStyles} from 'utils/styleConstants';

let styles;

export const AtomContents = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		tocData: PropTypes.array,
	},

	handleScroll: function(id, level) {
		let destination = document.getElementById(id);
		if (!destination) { 
			const headers = document.getElementsByTagName('h' + level);
			for (let index = 0; index < headers.length; index++) {
				const testID = headers[index].textContent.trim().replace(/[^A-Za-z0-9 ]/g, '').replace(/\s/g, '-').toLowerCase();
				if (testID === id) {
					destination = headers[index];
				}
			}
		}
		if (!destination) { return undefined; }
		smoothScroll(destination);
	},

	render: function() {
		const toc = this.props.tocData || [];

		return (
			<div style={styles.container}>
				{toc.map((object, index)=>{
					return <div key={'toc-' + index} className={'underlineOnHover'} style={[styles.tocItem, styles.tocLevels[object.level - 1]]} onClick={this.handleScroll.bind(this, object.id, object.level)}>{object.title}</div>;
				})}	
			</div>
		);
	}
});

export default Radium(AtomContents);

styles = {
	container: {
		paddingBottom: '1em',
	},
	tocItem: {
		display: 'block',
		textDecoration: 'none',
		color: 'inherit',
		paddingTop: '1em',
		paddingRight: '0em',
		paddingBottom: '0em',
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
