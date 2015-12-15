import React from 'react';

const PagebreakPlugin = React.createClass({
	render: function() {
		return (
			<div className={'pagebreak'} style={{display: 'block', borderTop: '1px dashed #ddd'}}></div>
		);
	}
});

export default PagebreakPlugin;
