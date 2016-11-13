import React from 'react';

export const Loader = React.createClass({

	render: function() {
		return (
			<div className="spinner">
				<div className="cube1" />
				<div className="cube2" />
			</div>
		);
	}
});

export default Loader;
