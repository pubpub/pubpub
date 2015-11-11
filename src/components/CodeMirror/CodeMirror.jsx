
import React from 'react';
import className from 'classnames';

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

	getInitialState() {
		return {
			isFocused: false,
			propsCount: 0,
		};
	},

	componentDidMount() {
		this.setState({
			isFocused: this.state.isFocused,
			propsCount: 0
		});
	},

	componentWillReceiveProps(nextProps) {
		if (this.state.propsCount === 0) {
			const CM = require('codemirror');
			const textareaNode = this.refs.textarea;
			this.codeMirror = CM.fromTextArea(textareaNode, this.props.options);
			this.codeMirror.on('change', this.codemirrorValueChanged);
			this.codeMirror.on('focus', this.focusChanged.bind(this, true));
			this.codeMirror.on('blur', this.focusChanged.bind(this, false));
			this._currentCodemirrorValue = this.props.value;
			this.codeMirror.setValue(this.props.value);
		}
		this.setState({
			isFocused: this.state.isFocused,
			propsCount: 1
		});
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

	codemirrorValueChanged(doc, change) {
		const newValue = doc.getValue();
		this._currentCodemirrorValue = newValue;
		if (this.props.onChange) {
			this.props.onChange(newValue);
		} 
	},

	render() {
		const editorClassName = className(
			'ReactCodeMirror',
			this.state.isFocused ? 'ReactCodeMirror--focused' : null,
			this.props.className
		);

		return (
			<div className={editorClassName}>
				<textarea ref="textarea" name={this.props.path} defaultValue={''} autoComplete="off" />
			</div>
		);
	}

});

module.exports = CodeMirror;
