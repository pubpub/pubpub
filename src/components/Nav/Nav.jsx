import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const Nav = React.createClass({
	propTypes: {
		left: PropTypes.array,
		right: PropTypes.array
	},

	render: function() {

		return (
			<div style={styles.navbar}>

				<ul style={styles.ul} className="leftNav">
					{this.props.left.map((item, index)=>{
						return <li key={'leftnav' + index} style={styles.li}>{item}</li>;
					})}
				</ul>

				<ul style={styles.ul} className="rightNav">
					{this.props.right.map((item, index)=>{
						return <li key={'rightnav' + index} style={[styles.li, styles.right]}>{item}</li>;
					})}
				</ul>

			</div>
		);
	}
});

const navHeight = '30px';
styles = {
	navbar: {
		height: navHeight,
		width: '100%',
	},
	ul: {
		listStyle: 'none',
		height: navHeight,
		width: '50%',
		float: 'left',
		margin: 0,
		padding: 0,
	},

	li: {
		float: 'left',
		padding: '0px 10px',
		height: navHeight,
		lineHeight: navHeight,
		cursor: 'pointer',
		color: '#666',
		':hover': {
			color: '#000'
		},

	},
	right: {
		float: 'right'
	}

	
};

export default Radium(Nav);
