import React, { PropTypes } from 'react';
import Radium from 'radium';

export const RenderFilePPT = React.createClass({
	propTypes: {
		file: PropTypes.object,
	},
	getInitialState() {
		return {
			width: 600,
			height: 500,
		};
	},
	componentDidMount() {
		this.sizeFrame();
		window.addEventListener('resize', this.sizeFrame);

	},
	componentWillUnmount() {
		window.removeEventListener('resize', this.sizeFrame);
	},
	
	sizeFrame: function() {
		const container = document.getElementsByClassName('ppt-container')[0];
		this.setState({
			width: container.offsetWidth,
			height: container.offsetWidth * (5 / 6)
		});
	},


	render() {
		// TODO: This currently just uses google docs embed viewer for ppt files.
		// This obviously is not a good long-term or open source solution.
		// We need a better tool when possible.
		const file = this.props.file || {};
		return (
			<div className={'ppt-container'}>
				<iframe 
					src={'http://docs.google.com/gview?url=' + file.url + '&embedded=true'} 
					style={{ width: this.state.width, height: this.state.height }} 
					frameBorder="0" />
			</div>
		);
	}

});

export default Radium(RenderFilePPT);
