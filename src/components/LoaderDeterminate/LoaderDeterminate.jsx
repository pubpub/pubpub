import React, {PropTypes} from 'react';
import Radium from 'radium';

let styles = {};

const LoaderDeterminate = React.createClass({
	propTypes: {
		value: PropTypes.number
	},

	render: function() {
		return (
			<div className="loading-bar" style={styles(this.props.value).loadingBar}>
				
			</div>
		);
	}
});


styles = function(percentage) {
	return {
		loadingBar: {
			width: '100%',
			height: '1px',
			// backgroundColor: 'black',
			backgroundColor: 'rgba(0,0,0,0.4)',
			transform: 'translateX(' + (-100 + percentage) + '%)',
			transition: '.2s linear transform'
		}
	};
};

export default Radium(LoaderDeterminate);
