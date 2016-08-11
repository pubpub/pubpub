import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {globalStyles} from 'utils/styleConstants';
import {Loader} from 'components';
import request from 'superagent';

let styles;

export const AtomReaderExport = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
	},

	getInitialState() {
		return {
			renderingPDF: false,
			renderingMarkdown: false,
			pdfURL: undefined,
			markdownURL: undefined,
		};
	},

	generatePDF: function() {
		this.setState({renderingPDF: true});
		const versionID = safeGetInToJS(this.props.atomData, ['currentVersionData', '_id']);
		request.get('/api/generatePDF?versionID=' + versionID)
		.end((err, response)=>{
			if (err) {return undefined;} 
			window.location = response.body;
			this.setState({
				renderingPDF: false,
				pdfURL: response.body,
			});
		});
	},

	generateMarkdown: function() {
		this.setState({renderingMarkdown: true});
		const versionID = safeGetInToJS(this.props.atomData, ['currentVersionData', '_id']);
		request.get('/api/generateMarkdown?versionID=' + versionID)
		.end((err, response)=>{
			if (err) {return undefined;} 
			window.location = response.body;
			this.setState({
				renderingMarkdown: false,
				markdownURL: response.body,
			});
		});
	},

	render: function() {
		const pdfURL = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'PDFFile']) || this.state.pdfURL;
		const markdownURL = safeGetInToJS(this.props.atomData, ['currentVersionData', 'content', 'markdownFile']) || this.state.markdownURL;

		return (
			<div>
				
				<h2 className={'normalWeight'}>Export</h2>

				{!!pdfURL 
					? <a href={pdfURL} style={globalStyles.link}><div className={'button'} style={styles.downloadButton}>Download PDF</div></a>
					: <a onClick={this.generatePDF} style={[this.state.renderingPDF && styles.downloadDisabled]}><div className={'button'} style={styles.downloadButton}>Download PDF</div></a>
				}

				{!!markdownURL 
					? <a href={markdownURL} style={globalStyles.link}><div className={'button'} style={styles.downloadButton}>Download Markdown</div></a>
					: <a onClick={this.generateMarkdown} style={[this.state.renderingMarkdown && styles.downloadDisabled]}><div className={'button'} style={styles.downloadButton}>Download Markdown</div></a>
				}
				
				{/* <h3>Download XML</h3> */}

				{(this.state.renderingPDF || this.state.renderingMarkdown) &&
					<div>Generating file... <Loader loading={true}/></div>
				}
			</div>
		);
	}
});

export default Radium(AtomReaderExport);

styles = {
	downloadButton: {
		padding: '2em',
		display: 'inline-block',
		margin: '1em 1em 1em 0em',
	},
	downloadDisabled: {
		opacity: '0.5',
		pointerEvents: 'none',
	},
};
