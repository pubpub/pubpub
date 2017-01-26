import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Highlighter } from 'containers';
import RenderFilePDF from './RenderFilePDF';
import RenderFilePPT from './RenderFilePPT';
import RenderFileDoc from './RenderFileDoc';
import RenderFileMarkdown from './RenderFileMarkdown';
import RenderFileSTL from './RenderFileSTL';

let styles;

export const RenderFile = React.createClass({
	propTypes: {
		file: PropTypes.object,
		allFiles: PropTypes.array,
		noHighlighter: PropTypes.bool,
	},

	renderContent: function(object) {
		return object.map((newObject)=> {
			return (
				<div key={Math.random()}>
					{newObject.type === 'text' && newObject.text}
					{newObject.content && (Array.isArray(newObject.content) ? this.renderContent(newObject.content) : this.renderContent([newObject.content]))}
				</div>
			);
		});
	},
	render() {
		const file = this.props.file || {};
		const fileType = file.type || file.url.split('.').pop();
		const wrapperId = this.props.noHighlighter ? '' : 'highlighter-wrapper';
		switch (fileType) {
		case 'ppub': 
			const content = JSON.parse(file.content);
			return (
				<div id={wrapperId} className={'pub-body'} style={[styles.contentWrapper, styles.pubBody]}>
					{!this.props.noHighlighter && 
						<Highlighter />
					}
					
					{this.renderContent([content])}
				</div>
			);
		case 'text/markdown': 
			return (
				<div id={wrapperId} className={'pub-body'} style={[styles.contentWrapper, styles.pubBody]}>
					{!this.props.noHighlighter && 
						<Highlighter />
					}
					<RenderFileMarkdown file={file} allFiles={this.props.allFiles} />
				</div>
			);
		case 'image/png':
		case 'image/jpg': // Is this ever actually used?
		case 'image/jpeg':
		case 'image/gif':
			return <img alt={file.name} src={file.url} style={{ maxWidth: '100%' }} />;
		case 'application/pdf':
			return (
				<div id={wrapperId} style={styles.contentWrapper}>
					{!this.props.noHighlighter && 
						<Highlighter />
					}
					<RenderFilePDF file={file} />
				</div>
				
			);
		case 'application/vnd.ms-powerpoint':
		case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
			return <RenderFilePPT file={file} />;
		case 'application/msword':
		case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
			return <RenderFileDoc file={file} />;
		case 'stl':
			return <RenderFileSTL file={file} />;
		default: 
			return (
				<div className={'pt-callout'}>
					<p>Can not render this file. Click to download the file in your browser.</p>
					<a href={file.url}><button className={'pt-button'}>Click to Download</button></a>
				</div>
			);
		}
	}

});

export default Radium(RenderFile);

styles = {
	contentWrapper: {
		position: 'relative',
	},
	pubBody: {
		// padding: '0em 1.25em',
		fontFamily: 'Merriweather',
		fontWeight: 'light',
		fontSize: '14px',
		lineHeight: '24px',
		// lineHeight: '1.6em',
		// fontSize: '1.2em',
		color: '#333',
		maxWidth: '700px',
	},
};
