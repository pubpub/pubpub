import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader} from 'components';

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

	getSaveVersionContent: function() {
		return {
			url: this.state.url,
			metadata: this.state.metadata,
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
				<h3>Choose new file</h3>
				<form style={styles.form}>
					<div>
						<input id={'imageFile'} name={'image file'} type="file" accept="image/*" onChange={this.handleFileSelect} />
					</div>
				</form>

				<h3>Metadata</h3>
				<form style={styles.form}>
					<div>
						<label htmlFor={'firstName'}>
							Name
						</label>
						<input ref={'firstName'} id={'firstName'} name={'first name'} type="text" style={styles.input} defaultValue={''}/>
					</div>

					<div>
						<label htmlFor={'lastName'}>
							Other Name
						</label>
						<input ref={'lastName'} id={'lastName'} name={'last name'} type="text" style={styles.input} defaultValue={''}/>
					</div>

				</form>
				
			</div>
		);
	}
});

export default Radium(ImageEditor);

styles = {
	loaderWrapper: {
		display: 'inline-block',
	},
	form: {
		width: '600px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
		},
	},
	input: {
		width: 'calc(100% - 20px - 4px)', // Calculations come from padding and border in pubpub.css
	},
};
