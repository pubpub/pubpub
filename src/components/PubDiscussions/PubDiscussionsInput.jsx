/* global CodeMirror */

import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {LoaderIndeterminate} from '../';
// import {globalStyles} from '../../utils/styleConstants';

let styles = {};

import {loadCss} from '../../utils/loadingFunctions';
import initCodeMirrorMode from '../../containers/Editor/editorCodeMirrorMode';
import {codeMirrorStyles} from './discussionInputStyles';

import marked from '../../modules/markdown/markdown';
import markdownExtensions from '../../components/EditorPlugins';
marked.setExtensions(markdownExtensions);

const cmOptions = {
	lineNumbers: false,
	lineWrapping: true,
	viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
	autofocus: false,
	mode: 'pubpubmarkdown',
	extraKeys: {'Ctrl-Space': 'autocomplete'}
};

const PubDiscussionsInput = React.createClass({
	propTypes: {
		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object,
	},

	componentDidMount() {

		loadCss('/css/codemirror.css');
		loadCss('/css/react-select.min.css');
		initCodeMirrorMode();

		// Load codemirror
		const codeMirror = CodeMirror(document.getElementById('codemirror-wrapper'), cmOptions);
		this.cm = codeMirror;

		// need to unmount on change
		codeMirror.on('change', this.onEditorChange);

	},

	componentWillReceiveProps(nextProps) {
		if (this.props.addDiscussionStatus === 'loading' && nextProps.addDiscussionStatus === 'loaded') {
			const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
			// Reset any form options here.
			cm.setValue('');
		} else if (this.props.newDiscussionData.get('selections').size !== nextProps.newDiscussionData.get('selections').size) {
			const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
			const spacing = cm.getValue().length ? '\n' : '';
			cm.setValue(cm.getValue() + spacing + '[selection: ' + nextProps.newDiscussionData.get('selections').size + '] ' );	
		}
		
	},

	onEditorChange: function(cm, change) {
		console.log('change!');
	},

	submitDiscussion: function() {
		const newDiscussion = {};
		const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
		newDiscussion.markdown = cm.getValue();
		newDiscussion.assets = {};
		newDiscussion.selections = {};
		newDiscussion.references = {};
		this.props.addDiscussionHandler(newDiscussion);
	},

	render: function() {
		return (
			<div style={styles.container}>
				<Style rules={codeMirrorStyles} />

				<div id="codemirror-wrapper" style={styles.inputBox}></div>

				<div style={styles.loaderContainer}>
					{(this.props.addDiscussionStatus === 'loading' ? <LoaderIndeterminate color="#444"/> : null)}
				</div>

				<div onClick={this.submitDiscussion}>Submit</div>
				
			</div>
		);
	}
});

export default Radium(PubDiscussionsInput);

styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		margin: '10px 0px',
		position: 'relative',
	},
	inputBox: {
		border: '1px solid #ddd',
		backgroundColor: '#fff',
		minHeight: 25,
		padding: '10px 0px',
	},
	loaderContainer: {
		position: 'absolute',
		bottom: '19px',
		width: '100%',
	},
};
