/* global Firebase Firepad CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';

import ReactFireMixin from 'reactfire';

import MarkdownWidgets from 'components/Markdown/MarkdownWidgets/MarkdownWidgets';
import FirepadUserList from 'containers/Editor/utils/editorFirepadUserlist';
import {codeMirrorStyles, codeMirrorStyleClasses} from 'containers/Editor/utils/codeMirrorStyles';
import {FireBaseURL} from 'config';
import {Markdown} from 'components';

let styles = {};
const cmOptions = {
	lineNumbers: false,
	lineWrapping: true,
	autofocus: true,
	mode: 'spell-checker',
	backdrop: 'pubpubmarkdown',
	extraKeys: {'Ctrl-Space': 'autocomplete'},
	dragDrop: false,
};

export const MarkdownEditor = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		loginData: PropTypes.object,
	},

	mixins: [ReactFireMixin],

	componentDidMount() {
		// Load Firebase and bind using ReactFireMixin. For assets, references, etc.
		const ref = new Firebase(FireBaseURL + this.props.atomEditData.getIn(['atomData', 'slug']) + '/editorData' );
		const token = this.props.atomEditData.getIn(['atomData', 'token']);
		const username = this.props.loginData.getIn(['userData', 'username']);
		const name = this.props.loginData.getIn(['userData', 'name']);
		const image = this.props.loginData.getIn(['userData', 'image']);
		ref.authWithCustomToken(token, (error, authData)=> {
			if (error) { console.log('Authentication Failed!', error); return; } 

			this.bindAsObject(ref, 'firepadData');
			// Load Firebase ref that is used for firepad
			const firepadRef = new Firebase(FireBaseURL + this.props.atomEditData.getIn(['atomData', 'slug']) + '/firepad');
			// Load codemirror
			const codeMirror = CodeMirror(document.getElementById('codemirror-wrapper'), cmOptions); 

			// Initialize Firepad using codemirror and the ref defined above.
			Firepad.fromCodeMirror(firepadRef, codeMirror, {userId: username, defaultText: '# Introduction'});

			new Firebase(FireBaseURL + '.info/connected').on('value', (connectedSnap)=> {
				if (connectedSnap.val() === true) { /* we're connected! */
					this.setState({editorSaveStatus: 'saved'});
				} else { /* we're disconnected! */
					this.setState({editorSaveStatus: 'disconnected'});
				}
			});

			FirepadUserList.fromDiv(firepadRef.child('users'), document.getElementById('active-collaborators'), username, name, image);

			codeMirror.on('change', this.onEditorChange);
			// codeMirror.on('mousedown', function(instance, evt) {
			// 	// On right click. It was scrolling. Prevent that. Also can hijack for custom contextmenu?
			// 	if (evt.which === 3) { evt.preventDefault(); }
			// });
			// addCodeMirrorKeys(codeMirror);
		});
	},

	onEditorChange: function(cm, change) {
		this.setState({ markdown: cm.getValue() });
	},

	getSaveVersionContent: function() {
		return {
			markdown: this.state.markdown,
		};
	},

	render: function() {
		return (
			<div>
				<Style rules={{
					...codeMirrorStyles(),
					...codeMirrorStyleClasses
				}} />

				<div id={'active-collaborators'}></div>
				<div id={'codemirror-wrapper'} style={styles.block}></div>
				<div id={'atom-reader'} style={styles.block}> <Markdown markdown={this.state.markdown}/></div>
				
			</div>
		);
	}
});

export default Radium(MarkdownEditor);

styles = {
	block: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '50%',
	},
};
