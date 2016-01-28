import React, {PropTypes} from 'react';
import Radium from 'radium';
import {pluginOptions} from '../../components/EditorPlugins';
import {parsePluginString} from '../../utils/parsePlugins';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

import Plugins from '../../components/EditorPlugins/index.js';
import InputFields from '../EditorPluginFields/index.js';

let styles = {};
const POPUP_WIDTH = 425;
const POPUP_HEIGHT_ESTIMATE = 350;

const EditorPluginPopup = React.createClass({
	propTypes: {
		activeFocus: PropTypes.string,
		codeMirrorChange: PropTypes.object,
		assets: PropTypes.object
	},

	getDefaultProps: function() {
		return {
			activeFocus: '',
			codeMirrorChange: {}
		};
	},

	getInitialState() {
		this.inputFields = {};
		return {
			popupVisible: false,
			xLoc: 0,
			yLoc: 0,
			initialString: '',
			activeLine: undefined,
			pluginType: ''
		};
	},

	componentDidMount() {
		document.documentElement.addEventListener('click', this.onPluginClick);
		document.documentElement.addEventListener('keydown', this.onpluginKeyPress);

	},
	onpluginKeyPress(evt) {
		if (evt.keyCode === 13) {
			if (document.activeElement === document.body) {
				this.onPluginSave();
			}
		}
	},
	componentWillReceiveProps(nextProps) {

		// If a re-render causes this component to receive new props, but the props haven't changed, return.
		if (this.props.codeMirrorChange === nextProps.codeMirrorChange) {
			return null;
		}

		this.assets = (this.props.assets) ? Object.values(this.props.assets) : [];


		const change = nextProps.codeMirrorChange;

		// If the content changes and the popup is visible, it will be out of date, so hide it.
		// Well, we don't want it to close if ANY change is made, only a change to the same line
		// If the from to to line of the change equal the line of the popup, close it.
		if (this.state.activeLine !== undefined && this.state.activeLine >= change.from.line && this.state.activeLine <= change.to.line && change.origin !== 'complete') {
			this.setState({
				popupVisible: false,
				activeLine: undefined,
			});
		}

		// If the change causes the line above to change, change the activeLine
		if (this.state.activeLine !== undefined && change.from.line < this.state.activeLine) {

			this.setState({
				activeLine: this.state.activeLine + change.text.length - change.removed.length,
			});

		}
	},

	componentWillUnmount() {
		document.documentElement.removeEventListener('click', this.onPluginClick);
		document.documentElement.removeEventListener('keydown', this.onpluginKeyPress);
	},

	getActiveCodemirrorInstance: function() {
		const cm = this.props.activeFocus === ''
				? document.getElementById('codemirror-wrapper').childNodes[0].childNodes[0].CodeMirror
				: document.getElementById('codemirror-focus-wrapper').childNodes[0].CodeMirror;

		return cm;
	},
	focus: function() {
		this.popupBox.focus();
	},
	onPluginClick: function(event) {
		let clickX;
		let clickY;
		if (event.pageX || event.pageY) {
			clickX = event.pageX;
			clickY = event.pageY;
		} else {
			clickX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			clickY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		this.showAtPos(clickX, clickY);
	},

	showAtPos: function(clickX, clickY) {

		const target = document.elementFromPoint(clickX, clickY);
		const contentBody = document.getElementById('editor-text-wrapper');

		if (target.className.indexOf('cm-plugin') > -1) {
			const cm = this.getActiveCodemirrorInstance();
			// const pluginString = target.parentElement.textContent.slice(2, -2); // Original string minus the brackets
			const pluginString = target.innerHTML.slice(2, -2); // Original string minus the brackets
			const pluginSplit = pluginString.split(':');
			const pluginType = pluginSplit[0];
			const valueString = pluginSplit.length > 1 ? pluginSplit[1] : ''; // Values split into an array
			const values = parsePluginString(valueString);

			const edgeX = document.elementFromPoint(clickX + POPUP_WIDTH, clickY);
			const edgeY = document.elementFromPoint(clickX, clickY + POPUP_HEIGHT_ESTIMATE);

			const flippedX = !contentBody.contains(edgeX);
			const flippedY = !(edgeY !== null);

			const xLoc = (flippedX) ? clickX - POPUP_WIDTH + 22 : clickX - 22;
			const yLoc = (flippedY) ? (window.innerHeight - clickY) - contentBody.scrollTop + 15 : clickY + 15 - 60 + contentBody.scrollTop;

			this.setState({
				popupVisible: true,
				xLoc: xLoc,
				yLoc: yLoc,
				activeLine: cm.getCursor().line,
				pluginType: pluginType,
				initialString: pluginString,
				values: values,
				flippedX: flippedX,
				flippedY: flippedY
			});


			const firstRefName = Plugins[this.state.pluginType].InputFields[0].title;
			const firstRef = (firstRefName) ? this.refs['pluginInput-' + firstRefName] : null;
			if (firstRef && typeof firstRef.focus === 'function') {
				const focused = firstRef.focus();
				if (!focused) {
					document.body.focus();
				}
			} else {
				document.body.focus();
			}

		} else {
			if (document.getElementById('plugin-popup').contains(event.target)) {
				if (!this.state.popupVisible) {
					this.setState({
						popupVisible: true,
					});
				}
			} else if (this.state.popupVisible === true) {
				this.setState({
					popupVisible: false,
					activeLine: undefined,
				});
			}
		}
	},

	onPluginSave: function() {
		const cm = this.getActiveCodemirrorInstance();
		const lineNum = this.state.activeLine;
		const lineContent = cm.getLine(lineNum);
		const from = {line: lineNum, ch: 0};
		const to = {line: lineNum, ch: lineContent.length};

		const mergedString = this.createPluginString(this.state.pluginType);
		const outputString = lineContent.replace(this.state.initialString, mergedString);
		cm.replaceRange(outputString, from, to); // Since the popup closes on change, this will close the pluginPopup
	},

	createPluginString: function(pluginType) {
		const refs = this.refs;
		let outputVariables = '';

		const PluginInputFields = Plugins[pluginType].InputFields;

		for (const pluginInputField of PluginInputFields) {
			// Generate an output string based on the key, values in the object
			const inputFieldType = pluginInputField.type;
			const inputFieldTitle = pluginInputField.title;

			const ref = this.inputFields[inputFieldType];
			const val = ref.value();

			if (val && val.length) {
				outputVariables += inputFieldTitle + '=' + val + ', ';
			}

		}
		outputVariables = outputVariables.slice(0, -2); // Remove the last comma and space
		const mergedString = outputVariables.length ? pluginType + ': ' + outputVariables : pluginType;
		return mergedString;
	},

	render: function() {

		const PluginInputFields = (this.state.pluginType) ? Plugins[this.state.pluginType].InputFields : [];

		return (
			<div id="plugin-popup"
					ref={(ref) => this.popupBox = ref}
					className="plugin-popup"
					style={[styles.pluginPopup, styles.pluginPopupPos(this.state.xLoc, this.state.yLoc, this.state.flippedY), this.state.popupVisible && styles.pluginPopupVisible]}
				>
				<div style={styles.pluginPopupArrow(this.state.flippedX, this.state.flippedY)}></div>
				<div style={styles.pluginContent}>
					<div style={styles.pluginPopupTitle}>
						{this.state.pluginType}</div>
						{
							  PluginInputFields.map((inputField)=>{

								const fieldType = inputField.type;
                const fieldTitle = inputField.title;
                const PluginInputFieldParams = inputField.params;

								const FieldComponent = InputFields[fieldType];
								const value = (this.state) ? this.state.values[fieldTitle] || null : null;

								return (<div key={'pluginVal-' + fieldType} style={styles.pluginOptionWrapper}>
													<label htmlFor={fieldType} style={styles.pluginOptionLabel}>{FieldTitle}</label>
													<div style={styles.pluginPropWrapper}>
														<FieldComponent selectedValue={value} assets={this.assets} {...PluginInputFieldParams} ref={(ref) => this.inputFields[fieldTitle] = ref}/>
													</div>
													<div style={styles.clearfix}></div>
												</div>);
							})
						}
					<div style={styles.pluginSave} key={'pluginPopupSave'} onClick={this.onPluginSave}>
						<FormattedMessage {...globalMessages.save} />
					</div>
				</div>
			</div>
		);

	}
});

export default Radium(EditorPluginPopup);


styles = {
	pluginPopup: {
		width: POPUP_WIDTH,
		// minHeight: 200,
		backgroundColor: 'white',
		boxShadow: '0px 0px 2px 0px #333',
		position: 'absolute',
		opacity: 0,
		transform: 'scale(0.8)',
		transition: '.02s linear transform, .02s linear opacity',
		zIndex: 50,
		pointerEvents: 'none',
		padding: 5,
		borderRadius: '1px',
	},
	pluginPopupVisible: {
		opacity: 1,
		transform: 'scale(1.0)',
		pointerEvents: 'auto',
	},
	pluginPopupPos: function(xLoc, yLoc, flipY) {
		const pos = {left: xLoc};
		if (flipY) {
			pos.bottom = yLoc;
		} else {
			pos.top = yLoc;
		}
		return pos;
	},
	pluginPopupArrow: function(flipX, flipY) {
		const xWidth = (flipX) ? POPUP_WIDTH - 25 : 15;
		const arrowStyle = {
			position: 'absolute',
			left: xWidth,
			width: 16,
			height: 16,
			backgroundColor: 'white',
			boxShadow: '-1px -1px 1px 0px #9A9A9A',
			zIndex: 5,
		};
		if (flipY) {
			arrowStyle.bottom = -8;
			arrowStyle.transform = 'rotate(225deg)';
		} else {
			arrowStyle.top = -8;
			arrowStyle.transform = 'rotate(45deg)';
		}
		return arrowStyle;
	},
	pluginContent: {
		position: 'relative',
		backgroundColor: 'white',
		zIndex: 10,
	},
	pluginPopupTitle: {
		padding: '6px 6px',
		fontSize: '25px',
		textTransform: 'capitalize',
		fontFamily: 'Courier',
		marginBottom: '10px',
	},
	pluginSave: {
		padding: '6px 20px 6px 0px',
		fontSize: '18px',
		display: 'inline-block',
		float: 'right',
		marginBottom: '15px',
		':hover': {
			cursor: 'pointer',
			color: 'black',
		},
	},
	pluginOptionWrapper: {
		margin: '0px 10px 15px 10px',
		fontFamily: 'Courier',
	},
	pluginOptionLabel: {
		// width: '100%',
		display: 'inline-block',
		marginRight: '20px',
		width: '20%',
		textTransform: 'capitalize',
		fontSize: '0.95em'
	},
	pluginOptionInput: {
		width: 'calc(50% - 4px)',
		padding: 0,
		float: 'left',
	},
	pluginOptionDefault: {
		width: 'calc(50% - 10px)',
		padding: '0px 5px',
		float: 'left',
		fontSize: '14px',
		color: '#bbb',
		display: 'none'
	},
	pluginOptionDefaultVisible: {
		display: 'block'
	},
	pluginPropSrc: {
		width: '75%'
	},
	pluginPropWrapper: {
		display: 'inline-block',
		width: '75%'
	},
	clearfix: {
		display: 'table',
		clear: 'both',
	}
};
