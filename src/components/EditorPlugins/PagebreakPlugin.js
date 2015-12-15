import React from 'react';

const PagebreakPlugin = React.createClass({
	render: function() {
		return (
			<span className={'pagebreak'} style={{display: 'block', borderTop: '1px dashed #ddd'}}></span>
		);
	}
});

export default PagebreakPlugin;
