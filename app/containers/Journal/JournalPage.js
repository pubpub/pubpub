import React, { PropTypes } from 'react';
import Radium from 'radium';
import ReactMarkdown from 'react-markdown';
import Helmet from 'react-helmet';

import { NonIdealState, Button } from '@blueprintjs/core';
import PreviewPub from 'components/PreviewPub/PreviewPub';
import { putLabel } from './actionsLabels'; 
import Textarea from 'react-textarea-autosize';


let styles;

export const JournalPage = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		page: PropTypes.object,
		isLoading: PropTypes.bool,
		error: PropTypes.string,
		dispatch: PropTypes.func,
	},

	getInitialState: function() {
		return {
			editorOpen: false,
			editorContent: undefined,
			textAreaFocused: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		const prevLoading = this.props.isLoading;
		const nextLoading = nextProps.isLoading;
		const nextError = nextProps.error;
		if (prevLoading && !nextLoading && !nextError) {
			this.setState({
				editorOpen: false,
				editorContent: undefined
			});
		}
	},

	openEditor: function() {
		this.setState({
			editorOpen: true,
			editorContent: this.props.page.description || '',
			textAreaFocused: false,
		});
	},
	closeEditor: function() {
		this.setState({
			editorOpen: false,
			editorContent: undefined,
		});
	},
	saveEditor: function() {
		const labelUpdates = { description: this.state.editorContent };
		this.props.dispatch(putLabel(this.props.journal.id, this.props.page.id, labelUpdates));
	},

	detailsChanged: function(evt) {
		this.setState({ editorContent: evt.target.value });
	},

	focusTextArea(component) {
		if (!this.state.textAreaFocused) {
			component.focus();
			this.setState({ textAreaFocused: true });
		}
	},

	render() {
		const journal = this.props.journal || {};
		const page = this.props.page || {};
		const pageText = page.description || '';

		const pubFeatures = journal.pubFeatures || [];
		const pubs = pubFeatures.filter((pubFeature)=> {
			const pub = pubFeature.pub || {};
			const labels = pub.labels || [];
			return labels.reduce((previous, current)=> {
				if (current.journalId === journal.id && current.slug === page.slug) { return true; }
				return previous;
			}, false);
		});

		if (!page.id) {
			return (
				<NonIdealState
						title={'Page Not Found'}
						visual={'error'} />
			);
		}

		return (
			<div style={styles.container}>
				<Helmet title={`${page.title} · ${journal.title}`} />
				{/*<h2 style={styles.pageHeader}>{page.title}</h2>*/}

				{journal.isAdmin && !page.description && !this.state.editorOpen &&
					<div style={{ marginBottom: '3em' }}>
						<NonIdealState
							action={<button className={'pt-button pt-icon-edit'} role="button" onClick={this.openEditor}>Add Details to this Page</button>}
							title={'No Details'}
							visual={'annotation'} />
					</div>
				}

				{page.description && !this.state.editorOpen &&
					<div className="journal-about-content">
						{journal.isAdmin &&
							<div style={{ float: 'right', margin: '0em 0em 1em 2em' }}>
								<button className={'pt-button pt-icon-edit'} role="button" onClick={this.openEditor}>Edit Details</button>
							</div>
						}
						<div className={'pub-body journal-page-content'}>
							<ReactMarkdown source={pageText} />
						</div>
					</div>	
				}

				{this.state.editorOpen &&
					<div>
						<div>
							
							<div style={{ float: 'right' }}>
								<Button className={'pt-button'} role="button" onClick={this.closeEditor} style={{ marginRight: '0.5em' }} text={'Cancel'} />
								<Button className={'pt-button pt-intent-primary'} role="button" onClick={this.saveEditor} text={'Save Details'} loading={this.props.isLoading} />
							</div>
							<p style={{ paddingTop: '8px' }}><a href={'https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet'} target={'_blank'}>Markdown supported</a></p>
						</div>
						
						<Textarea ref={this.focusTextArea} onChange={this.detailsChanged} value={this.state.editorContent} minRows={3} style={{ width: '100%', border: '1px solid #CCC', resize: 'none' }} />
					</div>	
				}

				{!pubs.length && !page.description &&
					<NonIdealState
						description={'Pubs have not yet been added into this page.'}
						title={'No Pubs'}
						visual={'application'} />
				}

				{!!pubs.length && page.description &&
					<div style={styles.divider} />
				}
				{pubs.sort((foo, bar)=>{
					// Sort so that most recent is first in array
					if (foo.createdAt > bar.createdAt) { return -1; }
					if (foo.createdAt < bar.createdAt) { return 1; }
					return 0;
				}).map((pubFeature, index)=> {
					return <PreviewPub key={'pageItem-' + index} context={journal.slug} pub={pubFeature.pub} />;
				})}

			</div>
		);
	}
});

export default Radium(JournalPage);

styles = {
	container: {
		
	},
	buttonLink: {
		textDecoration: 'none',
	},
	pageHeader: {
		paddingBottom: '1em',
	},
	divider: {
		margin: '2em 0em',
		borderTop: '1px solid #F3F3F4',
	},
	loaderContainer: {
		float: 'left',
		position: 'relative',
		left: '-5px',
		top: '-5px',
	},
};
