import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const VideoViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.oneOf(['full', 'embed', 'static-full', 'static-embed'])
	},
	getInitialState() {
		return {width: 600}
	},
	setVideoSize(container) {
		if (container) this.setState({width: container.offsetWidth});
	},
	render: function() {

		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const videoSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const metadata = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metadata']) || {};
		
		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <video src={videoSource} width={this.state.width} controls/>;
		case 'full':
		case 'static-full':
		default:
			return (
				<div ref={this.setVideoSize}>
					<video src={videoSource} width={this.state.width} controls />
					
					{Object.keys(metadata).length > 0 &&
						<h2>Metadata</h2>	
					}
					
					{Object.keys(metadata).map((key, index)=>{
						return (
							<div key={'metadata-' + index}>
								<div style={styles.key}>{metadata[key].title}:</div>
								<div style={styles.value}>{metadata[key].value}</div>
							</div>
						);
					})}

				</div>
			);
		}

	}
});

export default Radium(VideoViewer)

styles = {
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
};
