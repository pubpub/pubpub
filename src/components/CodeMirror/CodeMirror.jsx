import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const CodeMirror = React.createClass({

	propTypes: {
		onChange: React.PropTypes.func,
		onFocusChange: React.PropTypes.func,
		options: React.PropTypes.object,
		path: React.PropTypes.string,
		value: React.PropTypes.string,
		className: React.PropTypes.any,
		CM: React.PropTypes.func,
	},

	mixins: [PureRenderMixin],

	getInitialState() {
		return {
			isFocused: false
		};
	},

	componentDidMount() {
		// Load codemirror here since we can only load it client-side
		const CM = require('codemirror');
		require('codemirror/mode/markdown/markdown');
		const textareaNode = this.refs.textarea;
		this.codeMirror = CM.fromTextArea(textareaNode, this.props.options);
		this.codeMirror.on('change', this.codemirrorValueChanged);
		this.codeMirror.on('focus', this.focusChanged.bind(this, true));
		this.codeMirror.on('blur', this.focusChanged.bind(this, false));
		this._currentCodemirrorValue = this.props.value;
		this.codeMirror.setValue(this.props.value);
		
		
	},

	componentWillReceiveProps(nextProps) {
		if (this.codeMirror && this._currentCodemirrorValue !== nextProps.value) {
			this.codeMirror.setValue(nextProps.value);
		}
		if (typeof nextProps.options === 'object') {
			for (const optionName in nextProps.options) {
				if (nextProps.options.hasOwnProperty(optionName)) {
					this.codeMirror.setOption(optionName, nextProps.options[optionName]);
				}
			}
		}
	},

	componentWillUnmount() {
		// todo: is there a lighter-weight way to remove the cm instance?
		if (this.codeMirror) {
			this.codeMirror.toTextArea();
		}
	},

	getCodeMirror() {
		return this.codeMirror;
	},

	focus() {
		if (this.codeMirror) {
			this.codeMirror.focus();
		}
	},

	focusChanged(focused) {
		this.setState({
			isFocused: focused
		});
		if (this.props.onFocusChange) {
			this.props.onFocusChange(focused);
		}
	},

	// codemirrorValueChanged(doc, change) {
	codemirrorValueChanged(doc) {
		const newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		if (this.props.onChange) {
			this.props.onChange(newValue);
		}

		// We'll probably want to keep track of our main doc. That's the one that gets synced with 
		// firebase. Do we keep it in the store?

		// if (typeof this.oldDoc === 'undefined') {
		// 	console.log('its undefined!');
		// 	const subDoc = doc.linkedDoc({
		// 		sharedHist: true,
		// 		from: 5,
		// 		to: 10,	
		// 	});
		// 	console.log('New Doc:');
		// 	console.log(subDoc);
		// 	this.oldDoc = this.codeMirror.swapDoc(subDoc);
		// 	console.log('Old Doc:');
		// 	console.log(this.oldDoc);
		// 	setTimeout(()=>{
		// 		console.log('revert!');
		// 		this.codeMirror.swapDoc(this.oldDoc);
		// 		doc.iterLinkedDocs(function(docc, hist) {
		// 			console.log(docc);
		// 			console.log(hist);
		// 		});
		// 	}, 10000);
		// }
		
	},

	render() {
		
		const isFocusedClass = (this.state.isFocused) ? 'ReactCodeMirror--focused' : null;
		const editorClassName = 'ReactCodeMirror ' + this.props.className + ' ' + isFocusedClass;

		return (
			<div style={{width: 'calc(100% - 30px)', padding: '0px 15px'}} className={editorClassName}>
				<textarea style={{border: 'none', resize: 'none'}} ref="textarea" name={this.props.path} defaultValue={''} autoComplete="off" />
			</div>
		);
	}

});

module.exports = CodeMirror;
