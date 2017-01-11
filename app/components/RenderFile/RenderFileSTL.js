import React, { PropTypes } from 'react';
import Radium from 'radium';
import STLViewer from 'stl-viewer'

export const RenderFileSTL = React.createClass({
	propTypes: {
		file: PropTypes.object,
	},
	getInitialState() {
		return {
			width: undefined,
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
		const container = document.getElementsByClassName('stl-container')[0];
		this.setState({
			width: container.offsetWidth * 0.75,
		});
	},


	render() {
		const file = this.props.file || {};
		// TODO: This component is not complete. It does not handle changes to props well. Resizing doesn't work.
		return (
			<div className={'stl-container'} style={{ textAlign: 'center' }}>
				{!!this.state.width &&
					<div style={{ display: 'inline-block' }}>
						<STLViewer
							url={file.url}
							width={this.state.width}
							height={this.state.width}
							modelColor='#99D005'
							backgroundColor='#FFF'
							rotate={true}
							orbitControls={true} />
					</div>
				}
			</div>
		);
	}

});

export default Radium(RenderFileSTL);
