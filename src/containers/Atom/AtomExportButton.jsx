import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {globalStyles} from 'utils/styleConstants';
import {Loader} from 'components';
import request from 'superagent';


let styles;

export const AtomExportButton = React.createClass({
	propTypes: {
		atomData: PropTypes.object,
		buttonStyle: PropTypes.object,
		
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
			<div className={'light-button arrow-down-button'} style={this.props.buttonStyle}>Export
				<div className={'hoverChild arrow-down-child'}>
					{!!pdfURL 
						? <a href={pdfURL} style={styles.link}><div className={'underlineOnHover'} style={styles.exportType}>PDF</div></a>
						: <a onClick={this.generatePDF} style={[styles.link, this.state.renderingPDF && styles.downloadDisabled]}>
							<div className={'underlineOnHover'} style={styles.exportType}>
								PDF
							</div>
						</a>
					}

					{!!markdownURL 
						? <a href={markdownURL} style={styles.link}><div className={'underlineOnHover'} style={styles.exportType}>Markdown</div></a>
						: <a onClick={this.generateMarkdown} style={[styles.link, this.state.renderingMarkdown && styles.downloadDisabled]}>
							<div className={'underlineOnHover'} style={styles.exportType}>
								Markdown
							</div>
						</a>
					}
				</div>
			</div>
		);
	}
});

export default Radium(AtomExportButton);

styles = {
	link: {
		...globalStyles.link,
		display: 'block',
		paddingRight: '0em',
	},
	exportType: {
		margin: '.5em 1em',
		cursor: 'pointer',
	},
	downloadDisabled: {
		opacity: '0.5',
		pointerEvents: 'none',
	},
};
