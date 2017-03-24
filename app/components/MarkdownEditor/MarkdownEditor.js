import React, { PropTypes } from 'react';
import Radium from 'radium';
import SimpleMDE from 'simplemde';
import CodeMirror from 'codemirror';

let styles;
export const MarkdownEditor = React.createClass({
	propTypes: {
		initialContent: PropTypes.string,
		onChange: PropTypes.func,
	},

	simpleMDE: undefined,
	autocompleteMarker: undefined,

	getInitialState() {
		return {
			visible: undefined,
			top: 0,
			left: 0,
		};
	},

	componentDidMount() {
		const element = document.getElementById('myMarkdownEditor');
		if (element) {
			this.simpleMDE = new SimpleMDE({ 
				element: element,
				autoDownloadFontAwesome: false,
				autofocus: true,
				placeholder: 'Begin writing here...',
				spellChecker: false,
				status: false,
				toolbar: false,
				shortcuts: {
					togglePreview: null,
					toggleSideBySide: null,
					toggleFullScreen: null,
				}
			});

			this.simpleMDE.value(this.props.initialContent || '');
			this.simpleMDE.codemirror.on('cursorActivity', ()=> {
				if (this.props.onChange) {
					this.props.onChange(this.simpleMDE.value());
					const cm = this.simpleMDE.codemirror;
					const currentCursor = cm.getCursor();
					const currentLine = cm.getLine(currentCursor.line);
					const nextChIndex = currentCursor.ch;
					const nextCh = currentLine.length > nextChIndex ? currentLine.charAt(nextChIndex) : ' ';
					// console.log(currentCursor);
					const prevChars = currentLine.substring(0, currentCursor.ch);
					const startIndex = prevChars.lastIndexOf(' ') + 1;
					const startLetter = currentLine.charAt(startIndex);
					// console.log(prevChars.lastIndexOf(' ') + 1, currentCursor.ch);
					const shouldMark = startLetter === '@' && nextCh === ' ' && !cm.getSelection();

					// console.log('Heyo ', startLetter, nextCh, currentCursor.ch, startIndex, currentCursor, cm.getSelection());
					if (shouldMark && !this.autocompleteMarker) {
						// console.log('Add it')
						this.autocompleteMarker = cm.markText({ line: currentCursor.line, ch: (prevChars.lastIndexOf(' ') + 1 )}, { line: currentCursor.line, ch: (prevChars.lastIndexOf(' ') + 2)}, {className: 'testmarker'});
						
						// console.log(document.getElementsByClassName('testmarker'), document.getElementsByClassName('testmarker')[0]);
						setTimeout(()=>{
							const container = document.getElementById('markdown-editor-container');
							const mark = document.getElementsByClassName('testmarker')[0];
							// console.log(container, mark);
							const top = mark.getBoundingClientRect().bottom - container.getBoundingClientRect().top;
							const left = mark.getBoundingClientRect().left - container.getBoundingClientRect().left;
							this.setState({
								visible: true,
								top: top,
								left: left,
							});
						}, 0);
						
						
					} else if (!shouldMark && this.autocompleteMarker) {
						// console.log('Clearing!');
						this.autocompleteMarker.clear();
						this.autocompleteMarker = undefined;
						this.setState({
							visible: false,
						});
					}
					// console.log(startLetter, nextCh);
				}
			});
			// this.simpleMDE.codemirror.on('keyHandled', this.handleKey);
			this.simpleMDE.codemirror.setOption('extraKeys', {
				Up: this.handleArrow,
				Down: this.handleArrow,
				Esc: this.handleEscape,
			});
		}
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.initialContent !== nextProps.initialContent) {
			this.simpleMDE.value(nextProps.initialContent);
		}
	},

	handleArrow: function(cm) {
		if (!this.state.visible) { return CodeMirror.Pass; }
		return null;
	},
	handleEscape: function(cm) {
		this.setState({ visible: false });
		return CodeMirror.Pass;
	},

	render() {
		return (
			<div id={'markdown-editor-container'} style={styles.container}>
				<textarea id={'myMarkdownEditor'} />
				<div className={'pt-card pt-elevation-4'} style={styles.autocompleteWrapper(this.state.top, this.state.left, this.state.visible)}>
					Autocomplete me!
				</div>
			</div>
		);
	},

});

export default Radium(MarkdownEditor);

styles = {
	container: {
		position: 'relative',
	},
	autocompleteWrapper: function(top, left, visible) {
		return {
			zIndex: 10, 
			position: 'absolute', 
			left: left, 
			top: top, 
			opacity: visible ? 1 : 0, 
			pointerEvents: visible ? 'auto' : 'none', 
			transition: '.1s linear opacity'
		};
	},
};
