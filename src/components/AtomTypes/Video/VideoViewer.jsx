import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles;

export const VideoViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.oneOf(['full', 'embed', 'static-full', 'static-embed'])
	},

	render: function() {

		const atomData = safeGetInToJS(this.props.atomData, ['atomData']);
		const videoSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const metadata = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metadata']) || {};

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <video key={'video-' + videoSource} src={videoSource} controls style={styles.video}/>;
		case 'full':
		case 'static-full':
		default:
			return (
				<div>
					<video key={'video-' + videoSource} src={videoSource} controls style={styles.video}/>

					{Object.keys(metadata).length > 0 &&
						<h2>
							<FormattedMessage {...globalMessages.Metadata}/>
						</h2>
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

export default Radium(VideoViewer);

styles = {
	video: {
		maxWidth: '650px',
		width: '100%',
	},
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
};
