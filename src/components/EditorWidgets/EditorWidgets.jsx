import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium, {Style} from 'radium';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {debounce} from 'utils/loadingFunctions';
import {globalStyles} from 'utils/styleConstants';
import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';
import {Iterable} from 'immutable';
import Widget from './EditorWidgetClass';
import {parsePluginString} from 'utils/parsePlugins';
import EditorWidgetModal from './EditorWidgetModal';


const EditorWidgets = React.createClass({
	propTypes: {
		activeFocus: PropTypes.string,
		assets: PropTypes.array,
		references: PropTypes.object,
		mode: PropTypes.string,
		cm: PropTypes.object,
	},

	getInitialState() {
		this.marks = [];
		return {
			initialized: false,
			codeMirrorChange: {},
		};
	},

	// only mount after codemirror is activated
	componentDidMount() {
		this.props.cm.on('change', this.onEditorChange);
		this.markAll(this.props.cm);
	},


	showPopupFromAutocomplete: function(completion) {
		const cords = this.cm.cursorCoords();
		this.refs.pluginModal.showAtPos(cords.left - 15, cords.top + 5);
		if (completion) {
			CodeMirror.off(completion, 'pick', this.showPopupFromAutocomplete);
		}
		return;
	},


	checkMarkRange: function(from, to) {
		for (const mark of this.marks) {
			const pos = mark.find();
			if (!pos) {

			}
			if (pos && pos.from.line === from.line && pos.from.ch === from.ch ) {
				return true;
			}
		}
		// console.log('Could not find mark!');
		return false;
	},

	markAll: function(cm) {
		const count = cm.lineCount();
		for (let i = 0; i < count; i++) {
			this.insertWidget(cm, i);
		}
	},


	insertWidget: function(cm, line) {

		try {

			const selectedTokens = cm.getLineTokens(line);
			for (const token of selectedTokens) {
				// console.log(token.type);
				if (token.type && token.type.indexOf('plugin') !== -1 && token.type.indexOf('ppm') !== -1) {
					// console.log(token);
					const from = {line: line, ch: token.start};
					const to = {line: line, ch: token.end};
					if (!this.checkMarkRange(from, to)) {
						const pluginString = token.string.slice(2, -2);
						const pluginData = parsePluginString(pluginString);
						const pluginType = pluginData.pluginType;

						const a = new Widget(cm, from, to, pluginType, pluginData, this.openPopupOnWidget);
						this.marks.push(a.mark);
					}

				}
			}
		} catch (err) {
			console.log(err);
		}

	},

	openPopupOnWidget: function(from, to, widget) {
		this.refs.pluginModal.showWithPlugin(from, to, widget);
	},

	onEditorChange: function(cm, change) {

		/*

		CodeMirror.commands.autocomplete(cm, CodeMirror.hint.plugins, {completeSingle: false});

		if (cm.state.completionActive && cm.state.completionActive.data) {
			const completion = cm.state.completionActive.data;
			CodeMirror.on(completion, 'pick', this.showPopupFromAutocomplete);
		}
		*/

		console.log(change);

		if (change.from && change.to) {
			const fromLine = change.from.line;
			const toLine = change.to.line;

			for (let line = fromLine; line <= toLine; line++) {
				this.insertWidget(cm, line);
			}
		}


		// Set State to trigger re-render
		/*
		this.setState({
			codeMirrorChange: change,
		});
		*/

	},


	render: function() {
		return (
			<span>

				<EditorWidgetModal ref="pluginModal"
					mode={this.props.mode}
					references={this.props.references || []}
					assets={this.props.assets || []}
					activeFocus={this.props.activeFocus}
					codeMirrorChange={this.state.codeMirrorChange}
					cm={this.props.cm}
					/>
			</span>
		);
	}

});


export default EditorWidgets;
