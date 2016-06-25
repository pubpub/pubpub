/* global Firebase Firepad CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';

import ReactFireMixin from 'reactfire';


import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

import MarkdownWidgets from 'components/Markdown/MarkdownWidgets/MarkdownWidgets';
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
	},

	mixins: [ReactFireMixin],

	componentDidMount() {
		// Load Firebase and bind using ReactFireMixin. For assets, references, etc.
		const ref = new Firebase(FireBaseURL + this.props.atomEditData.getIn(['atomData', 'slug']) + '/editorData' );
		const token = this.props.atomEditData.getIn(['atomData', 'token']);
		ref.authWithCustomToken(token, (error, authData)=> {
			if (error) { console.log('Authentication Failed!', error); return; } 

			this.bindAsObject(ref, 'firepadData');

			// Load Firebase ref that is used for firepad
			const firepadRef = new Firebase(FireBaseURL + this.props.atomEditData.getIn(['atomData', 'slug']) + '/firepad');

			// Load codemirror
			const codeMirror = CodeMirror(document.getElementById('codemirror-wrapper'), cmOptions);
			this.cm = codeMirror;

			// Get Login username for firepad use. Shouldn't be undefined, but set default in case.
			const username = 'TravisUsername';
			const name = 'Travis';

			// Initialize Firepad using codemirror and the ref defined above.
			const firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
				userId: username,
				defaultText: '# Begin writing here',
			});

			new Firebase(FireBaseURL + '.info/connected').on('value', (connectedSnap)=> {
				if (connectedSnap.val() === true) { /* we're connected! */
					this.setState({editorSaveStatus: 'saved'});
				} else { /* we're disconnected! */
					this.setState({editorSaveStatus: 'disconnected'});
				}
			});

			// FirepadUserList.fromDiv(firepadRef.child('users'),
			// 	document.getElementsByClassName('menuItem-activeCollabs')[0], username, this.props.loginData.getIn(['userData', 'name']), this.props.loginData.getIn(['userData', 'thumbnail']));

			// need to unmount on change
			codeMirror.on('change', this.onEditorChange);
			// codeMirror.on('mousedown', function(instance, evt) {
			// 	if (evt.which === 3) { // On right click. It was scrolling. Prevent that. Also can hijack for custom contextmenu?
			// 		evt.preventDefault();
			// 	}
			// });
			// addCodeMirrorKeys(codeMirror);

			// this.setState({initialized: true});
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

				<div id="codemirror-wrapper" style={styles.block}></div>
				<div id={'atom-reader'} style={styles.block}> <Markdown markdown={this.state.markdown}/></div>
				
			</div>
		);
	}
});

export default Radium(MarkdownEditor);

styles = {
	block: {
		display: 'table-cell',
		width: '50%',
	},
};
