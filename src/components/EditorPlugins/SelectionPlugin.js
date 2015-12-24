import React from 'react';

const PagebreakPlugin = React.createClass({

	render: function() {
		const styleObject = {
			backgroundColor: 'rgba(0, 0, 0, 0.14)',
			borderRadius: '3px',
			padding: '0px 8px',
			color: '#5B5B5B',
			':hover': {
				cursor: 'pointer',
			}
		};

		return (
			<span className={'selection-block'} style={styleObject}>selection</span>
		);
	}
});

export default PagebreakPlugin;
