import React, { PropTypes } from 'react';
import Radium from 'radium';

export const RenderFileDoc = React.createClass({
	propTypes: {
		file: PropTypes.object,
	},
	getInitialState() {
		return {
			width: 600,
			height: 800,
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
		const container = document.getElementsByClassName('doc-container')[0];
		this.setState({
			width: container.offsetWidth,
			height: container.offsetWidth * (8 / 6)
		});
	},


	render() {
		// TODO: This currently just uses google docs or Microsoft 365 embed viewer for .doc files.
		// This obviously is not a good long-term or open source solution.
		// We need a better tool when possible.
		const file = this.props.file || {};
		return (
			<div className={'doc-container'}>
				<iframe 
					src={'http://docs.google.com/gview?url=' + file.url + '&embedded=true'} 
					style={{ width: this.state.width, height: this.state.height }} 
					frameBorder="0" />
				{/*<iframe 
					src={'https://view.officeapps.live.com/op/embed.aspx?src=' + file.url}
					style={{ width: this.state.width, height: this.state.height }} 
					frameBorder="0" />*/}


			</div>
		);
	}

});

export default Radium(RenderFileDoc);
