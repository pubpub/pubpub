import React, { PropTypes } from 'react';

import Highlighter from 'containers/Highlighter/Highlighter';
import Radium from 'radium';
import { RenderDocument } from '@pubpub/editor';
import RenderFileDoc from './RenderFileDoc';
import RenderFilePDF from './RenderFilePDF';
import RenderFilePPT from './RenderFilePPT';
import RenderFileSTL from './RenderFileSTL';

let styles;

export const RenderFile = React.createClass({
	propTypes: {
		file: PropTypes.object,
		allFiles: PropTypes.array,
		allReferences: PropTypes.array,
		noHighlighter: PropTypes.bool,
		query: PropTypes.object,
		pubSlug: PropTypes.string,
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

	getFileMap: function(files) {
		if (!files) {
			return {};
		}
		const fileMap = {};
		for (const file of files) {
			fileMap[file.name] = file.url;
		}
		return fileMap;
	},

	render() {
		const file = this.props.file || {};

		if (!file.url) { return null; }
		const fileType = file.type || file.url.split('.').pop();
		const wrapperId = this.props.noHighlighter ? '' : 'highlighter-wrapper';
		switch (fileType) {
		case 'ppub':
			// const content = JSON.parse(file.content);
			return (
				<div id={wrapperId} style={styles.contentWrapper}>
					{!this.props.noHighlighter &&
						<Highlighter />
					}
					<RenderDocument
						json={JSON.parse(file.content)}
						allReferences={this.props.allReferences}
						allFiles={this.props.allFiles}
						slug={this.props.pubSlug}
						/>
				</div>
			);
		case 'text/markdown':
			return (
				<div id={wrapperId} style={styles.contentWrapper}>
					{!this.props.noHighlighter &&
						<Highlighter />
					}
					<RenderDocument
						markdown={file.content}
						allReferences={this.props.allReferences}
						allFiles={this.props.allFiles}
						slug={this.props.pubSlug}
						/>
				</div>
			);
		case 'image/png':
		case 'image/jpg': // Is this ever actually used?
		case 'image/jpeg':
		case 'image/gif':
			return <img alt={file.name} src={file.url} style={{ maxWidth: '100%' }} />;
		case 'video/mp4':
		case 'mp4':
			return (
				<video width={'100%'} controls>
					<source src={file.url} type={'video/mp4'} />
				</video>
			);
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
		case 'application/sla':
		case 'application/vnd.ms-pki.stl':
		case 'application/x-navistyle':
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
};
