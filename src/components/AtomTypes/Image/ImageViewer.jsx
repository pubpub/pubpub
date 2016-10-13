import Radium from 'radium';
import React, {PropTypes} from 'react';
import {FormattedMessage} from 'react-intl';
import {globalMessages} from 'utils/globalMessages';
import {safeGetInToJS} from 'utils/safeParse';
let styles;

export const ImageViewer = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		renderType: PropTypes.string, // full, embed, static-full, static-embed
		selected: PropTypes.bool,
	},

	render: function() {

		const title = safeGetInToJS(this.props.atomData, ['atomData', 'title']);
		const imageSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']) || '';
		const scaledURL = imageSource.indexOf('.gif') > -1 ? imageSource : 'https://jake.pubpub.org/unsafe/fit-in/650x0/' + imageSource; // To learn about jake.pubpub fit-in, see Thumbor docs: http://thumbor.readthedocs.io/en/latest/usage.html#fit-in
		const metadata = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metadata']) || {};

		const {selected} = this.props;

		switch (this.props.renderType) {
		case 'embed':
		case 'static-embed':
			return (<img style={styles.img} src={scaledURL} alt={title} style={styles.img({selected})}/>);
		case 'full':
		case 'static-full':
		default:
			return (
				<div>
					<img src={scaledURL} alt={title} style={styles.image}/>

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

export default Radium(ImageViewer);

styles = {
	figure: function({selected}) {
		return {
			display: 'table',
			// userSelect: 'none',
			width: 'auto',
			margin: 'auto',
		};
	},
	img: function({selected}) {
		return {
			display: 'table-row',
			outline: (selected) ? '3px solid #2C2A2B' : '3px solid transparent',
			transition: 'outline-color 0.15s ease-in',
		};
	},
	key: {
		fontSize: '1.2em',
	},
	value: {
		marginBottom: '1.25em',
	},
	image: {
		maxWidth: '100%',
	}
};
