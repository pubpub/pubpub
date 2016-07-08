import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

let styles;

export const ImageViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
	},

	render: function() {

		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const imageSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const scaledURL = 'https://jake.pubpub.org/unsafe/fit-in/650x0/' + imageSource; // To learn about jake.pubpub fit-in, see Thumbor docs: http://thumbor.readthedocs.io/en/latest/usage.html#fit-in
		const metadata = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metadata']) || {};

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return <img src={scaledURL} alt={title} />;
		case 'full':
		case 'static-full':
		default:
			return (
				<div>
					<img src={scaledURL} alt={title} />

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

export default Radium(ImageViewer);

styles = {
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
};
