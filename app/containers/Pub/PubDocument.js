import React, { PropTypes } from 'react';
import Radium from 'radium';
// import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { Popover, PopoverInteractionKind, Position, Menu, MenuItem, NonIdealState } from '@blueprintjs/core';

let styles;

export const PubDocument = React.createClass({
	propTypes: {
		versionData: PropTypes.object,
		pubId: PropTypes.number,
		pubSlug: PropTypes.string,
		query: PropTypes.object,
	},

	handleFileUploads: function(evt) {
		console.log(evt.target.files);
		const reader = new FileReader();
		reader.onload = function(progressEvent) {
			console.log(this.result);
		};
		reader.readAsText(evt.target.files[0]);

		// Go over all of the files
		// Chunk them into type 
		// create fileObjects
		// Upload to s3
		// Get URLs from s3 and add into fileObject
		// When they're all done, bundle them into a version (replacing similar named files)
		// Create version

	},

	render() {
		const versionData = this.props.versionData || {};
		const files = versionData.files || [];
		const query = this.props.query || {};
		const mainContent = files.reduce((previous, current)=> {
			if (current.name === 'main.md') { return current.content; } 
			return previous;
		}, '');
		return (
			<div style={styles.container}>

				{!files.length &&
					<NonIdealState
						action={
							<div className="pt-button-group">
								<a className="pt-button" tabIndex="0" role="button">Import Document</a>
								<label className="pt-button">
									Upload Files
									<input type="file" multiple style={{ position: 'fixed', top: '-100px' }} onChange={this.handleFileUploads} />
								</label>
								<a className="pt-button" tabIndex="0" role="button">Open Editor</a>
								

							</div>
						}
						description={'There are no files associated with this pub yet.'}
						title={'No Files'}
						visual={'folder-open'} />
				}
				
				{!!files.length &&
					<div style={{ margin: '-2em 0em 1em 0em' }}>
						<ul className="pt-breadcrumbs">
							<li><Link to={{ pathname: '/pub/' + this.props.pubSlug + '/files', query: query }} className="pt-breadcrumb"><span className="pt-icon-standard pt-icon-folder-open" /> {files.length} Files</Link></li>
						</ul>
					</div>
				}
				{!!files.length &&
					<div className={'pub-body'} style={styles.pubBody}>
						<ReactMarkdown source={mainContent} />
						<ReactMarkdown source={mainContent} />
						<ReactMarkdown source={mainContent} />
						<ReactMarkdown source={mainContent} />
						<ReactMarkdown source={mainContent} />
					</div>
				}		
			</div>
		);
	},

});

export default Radium(PubDocument);

styles = {
	container: {
		padding: '1.25em',
	},
	pubBody: {
		padding: '0em 1.25em',
		fontFamily: 'serif',
		lineHeight: '1.6em',
		fontSize: '1.2em',
		color: '#333',
		maxWidth: '700px',
	},
	inputButtonLabel: {
		overflow: 'hidden',
	},
	inputButton: {
		display: 'inline-block',
		width: '100%',
		margin: 0,
	},
	inputButtonText: {
		cursor: 'pointer',
		zIndex: 3,
		position: 'relative',
	},
	inputTest: {
		margin: 0,
		overflow: 'hidden',
	}
};
