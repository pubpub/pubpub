import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader, CustomizableForm} from 'components';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

export const VideoEditor = React.createClass({
	propTypes: {
		atomData: PropTypes.object
	},

	getInitialState() {
		return {
			url: '',
			metadata: {},
			isUploading: false,
		};
	},

	componentWillMount() {
		const metadata = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'metadata']) || {};
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
			url: this.state.url || safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']),
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
		const videoSource = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'url']);
		const videoURL = this.state.url || videoSource;
		return (
			<div>
				<h3>
					<FormattedMessage {...globalMessages.Preview}/>
				</h3>
				<video key={'video-' + videoURL} src={videoURL} controls style={styles.video}/>

				<div style={styles.loaderWrapper}>
					<Loader loading={this.state.isUploading} showCompletion={true}/>
				</div>
				<a href={videoURL} target="_blank" className={'underlineOnHover'} style={styles.originalLink}>View Original</a>

				<h3>
					<FormattedMessage {...globalMessages.ChooseNewFile}/>
				</h3>
				<input id={'videoFile'} name={'video file'} type="file" accept="video/*" onChange={this.handleFileSelect} />

				<h3>
					<FormattedMessage {...globalMessages.Metadata}/>
				</h3>
				<CustomizableForm formData={this.state.metadata} onUpdate={this.metadataUpdate}/>

			</div>
		);
	}
});

export default Radium(VideoEditor);

styles = {
	video: {
		maxWidth: '650px',
		width: '100%',
	},
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
