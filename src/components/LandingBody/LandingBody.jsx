import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const LandingBody = React.createClass({
	propTypes: {
		componentsArray: PropTypes.array,
	},

	getDefaultProps: function() {
		return {
			componentsArray: [],
		};
	},

	render: function() {
		// console.log(this.props);
		return (
			<div style={styles.container}>
				{
					this.props.componentsArray.map((component, index)=>{
						return <div key={'landingBodyComponent-' + index}>{JSON.stringify(component)}</div>;
					})
				}
			</div>
		);
	}
});

export default Radium(LandingBody);

styles = {
	container: {
		width: '100%',
	},
};
