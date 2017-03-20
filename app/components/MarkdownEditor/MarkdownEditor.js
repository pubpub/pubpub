import React, { PropTypes } from 'react';
import Radium from 'radium';
import SimpleMDE from 'simplemde';

export const MarkdownEditor = React.createClass({
	propTypes: {
		initialContent: PropTypes.string,
		onChange: PropTypes.func,
	},

	simpleMDE: undefined,

	getInitialState() {
		return {
			simplemdeInstance: undefined,
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
			this.simpleMDE.codemirror.on('change', ()=> {
				if (this.props.onChange) {
					this.props.onChange(this.simpleMDE.value());	
				}
			});
		}
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.initialContent !== nextProps.initialContent) {
			this.simpleMDE.value(nextProps.initialContent);
		}
	},

	render() {
		return <textarea id={'myMarkdownEditor'} />;
	},

});

export default Radium(MarkdownEditor);
