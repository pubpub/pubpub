import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {s3Upload} from 'utils/uploadFile';
import {Loader} from 'components';

let styles = {};

export const PDFEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
	},

	getInitialState() {
		return {
			url: '',
			isUploading: false,
		};
	},


	getSaveVersionContent: function() {
		return {
			url: this.state.url || safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']),
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
		const url = safeGetInToJS(this.props.atomEditData, ['currentVersionData', 'content', 'url']) || '';

		return (
			<div>
				<h3>Preview</h3>

				<iframe src={url} style={{height: 'calc(100vh - 80px)', width: '650px'}}></iframe>

				<div style={styles.loaderWrapper}>
					<Loader loading={this.state.isUploading} showCompletion={true}/>
				</div>
				<a href={url} alt={'Original Size: ' + title} target="_blank" className={'underlineOnHover'} style={styles.originalLink}>View File</a>

				<h3>Choose new file</h3>
				<input id={'pdfFile'} name={'pdf file'} type="file" accept="pdf/*" onChange={this.handleFileSelect} />

			</div>
		);
	}
});

export default Radium(PDFEditor);

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
