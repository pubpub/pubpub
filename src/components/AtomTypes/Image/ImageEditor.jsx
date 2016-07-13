import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader, CustomizableForm} from 'components';

let styles = {};

export const ImageEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			url: '',
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

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({isUploading: true});
			s3Upload(evt.target.files[0], ()=>{}, this.onFileFinish, 0);
		}
	},

	onFileFinish: function(evt, index, type, filename) {
		this.setState({
			url: 'https://assets.pubpub.org/' + filename,
			isUploading: false,
		});
	},

	metadataUpdate: function(newMetadata) {
		this.setState({metadata: newMetadata});
	},

	render: function() {
		const title = safeGetInToJS(this.props.atomEditData, ['atomData', 'title']);
		const imageSource = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']);
		const scaledURL = 'https://jake.pubpub.org/unsafe/fit-in/650x0/' + (this.state.url || imageSource); // To learn about jake.pubpub fit-in, see Thumbor docs: http://thumbor.readthedocs.io/en/latest/usage.html#fit-in
		return (
			<div>
				<h3>Preview</h3>
				<img src={scaledURL} alt={title} />
				<div style={styles.loaderWrapper}>
					<Loader loading={this.state.isUploading} showCompletion={true}/>
				</div>
				<a href={imageSource} alt={'Original Size: ' + title} target="_blank" className={'underlineOnHover'} style={styles.originalLink}>View Original</a>

				<h3>Choose new file</h3>
				<input id={'imageFile'} name={'image file'} type="file" accept="image/*" onChange={this.handleFileSelect} />

				<h3>Metadata</h3>
				<CustomizableForm formData={this.state.metadata} onUpdate={this.metadataUpdate}/>

			</div>
		);
	}
});

export default Radium(ImageEditor);

styles = {
	loaderWrapper: {
		display: 'inline-block',
	},
	originalLink: {
		display: 'table-cell',
		color: 'inherit',
		textDecoration: 'none',
		fontSize: '0.9em',
	},
};
