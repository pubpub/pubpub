import React from 'react';

const LinebreakPlugin = React.createClass({
	render: function() {
		return (
			<div className={'linebreak p-block'} style={{display: 'block', height: '1.5em'}}></div>
		);
	}
});

export default LinebreakPlugin;
