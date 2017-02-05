import React, { PropTypes } from 'react';
import Radium from 'radium';

let styles;

export const Announcements = React.createClass({
	propTypes: {
		data: PropTypes.object,
	},

	componentWillMount() {

	},
	getInitialState() {
		return {
			search: '',
		};
	},


	render() {
		
		return (
			<div className={'pt-card pt-elevation-6'} style={styles.container}>
				Heyyy
			</div>
		);
	}

});

export default Radium(Announcements);

styles = {
	container: {
		position: 'absolute',
		top: 10,
		right: 10,
		zIndex: 100,
	},
};
