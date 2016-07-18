import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Loader, CustomizableForm} from 'components';
import {isWebUri} from 'valid-url';

let styles = {};

export const IFrameEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			url: false,
			metadata: {},
			isUploading: false,
		};
	},

	componentWillMount() {
		const metadata = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'metadata']) || {};
		const defaultMetadata = {
			location: {
				title: 'Location',
				value: ''
			},
			originData: {
				title: 'Date of origin',
				value: '',
			},
		};
		this.setState({metadata: {
			...defaultMetadata,
			...metadata
		}});
	},

	getSaveVersionContent: function() {
		const cleanMetadata = {};
		Object.keys(this.state.metadata).map((key, index)=>{
			// Clear all the metadata entries that don't have a value
			if (this.state.metadata[key].value) {
				cleanMetadata[key] = this.state.metadata[key];
			}
		});
		return {
			url: this.state.url || safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']),
			metadata: cleanMetadata,
		};
	},

	handleSourceChange: function(evt) {
		if (evt.target.value && isWebUri(evt.target.value)) {
			this.setState({url: evt.target.value});
		}
	},
	
	metadataUpdate: function(newMetadata) {
		this.setState({metadata: newMetadata});
	},

	render: function() {
		const title = safeGetInToJS(this.props.atomEditData, ['atomData', 'title']);
		const iframeSource = this.state.url || safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']);
		return (
			<div>
				<h3>Preview</h3>
				<iframe src={iframeSource} style={styles.iframe}></iframe>
				<a href={iframeSource} alt={'Source Link: ' + title} target="_blank" className={'underlineOnHover'} style={styles.sourceLink}>View Source</a>

				<h3>Choose a difference source</h3>
				<input id={'imageFile'} name={'image file'} type="text" onChange={this.handleSourceChange} />

				<h3>Metadata</h3>
				<CustomizableForm formData={this.state.metadata} onUpdate={this.metadataUpdate}/>

			</div>
		);
	}
});

export default Radium(IFrameEditor);

styles = {
	loaderWrapper: {
		display: 'inline-block',
	},
	sourceLink: {
		display: 'table-cell',
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '0.9em',
	},
	iframe: {
		width: '100%',
		minHeight: '400px',
	}
};
