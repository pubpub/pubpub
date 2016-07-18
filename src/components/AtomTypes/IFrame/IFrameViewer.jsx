import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const IframeViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {

		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const iframeSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const metadata = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metadata']) || {};

		switch (this.props.renderType) {
			case 'embed':
			case 'static-embed':
				return <iframe src={iframeSource} style={styles.iframe}></iframe>
			case 'full':
			case 'static-full':
			default:
				return (
					<div>
						<iframe src={iframeSource} style={styles.iframe}></iframe>

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

export default Radium(IframeViewer);

styles = {
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
	iframe: {
		width: '100%',
		minHeight: '400px',
	}
};
