import React, {PropTypes} from 'react';
import Radium from 'radium';
import {pluginOptions} from '../../components/EditorPlugins';
import {parsePluginString} from '../../utils/parsePlugins';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

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
		return {
			popupVisible: false,
			xLoc: 0,
			yLoc: 0,
			initialString: '',
			activeLine: undefined,
			pluginType: '',
			contentObject: {}
		};
	},

	componentDidMount() {
		document.documentElement.addEventListener('click', this.onPluginClick);
	},
	componentWillReceiveProps(nextProps) {

		// If a re-render causes this component to receive new props, but the props haven't changed, return.
		if (this.props.codeMirrorChange === nextProps.codeMirrorChange) {
			return null;
		}

		this.assets = (this.props.assets) ? Object.values(this.props.assets).map( function(asset) { return {'value': asset.refName, 'label': asset.refName};}) : [];


		const change = nextProps.codeMirrorChange;

		// If the content changes and the popup is visible, it will be out of date, so hide it.
		// Well, we don't want it to close if ANY change is made, only a change to the same line
		// If the from to to line of the change equal the line of the popup, close it.
		if (this.state.activeLine !== undefined && this.state.activeLine >= change.from.line && this.state.activeLine <= change.to.line && change.origin !== 'complete') {
			this.setState({
				popupVisible: false,
				activeLine: undefined,
				contentObject: {},
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
	},

	getActiveCodemirrorInstance: function() {
		const cm = this.props.activeFocus === ''
				? document.getElementsByClassName('CodeMirror')[0].CodeMirror
				: document.getElementById('codemirror-focus-wrapper').childNodes[0].CodeMirror;

		return cm;
	},

	getPluginPopupLoc: function() {
		return {
			top: this.state.yLoc,
			left: this.state.xLoc,
		};
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

			const contentObject = pluginOptions[pluginType];

			this.setState({
				popupVisible: true,
				xLoc: clickX - 22,
				yLoc: clickY + 15 - 60 + contentBody.scrollTop,
				activeLine: cm.getCursor().line,
				pluginType: pluginType,
				contentObject: contentObject,
				initialString: pluginString,
				values: values
			});

			if (contentObject && contentObject.src && !values.src) {
				this.refs['pluginInput-src'].showOptions();
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
					contentObject: {}
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

		const mergedString = this.createPluginString(this.state.pluginType, this.state.contentObject);
		const outputString = lineContent.replace(this.state.initialString, mergedString);
		cm.replaceRange(outputString, from, to); // Since the popup closes on change, this will close the pluginPopup
	},

	createPluginString: function(pluginType, content) {
		const refs = this.refs;
		let outputVariables = '';
		for (const key in content) {
			// Generate an output string based on the key, values in the object
			if (Object.prototype.hasOwnProperty.call(content, key)) {
				const ref = refs['pluginInput-' + key];

				let val;
				if (typeof ref.value === 'function') {
					val = ref.value();
				} else {
					val = ref.value;
				}

				if (val && val.length) {
					outputVariables += key + '=' + val + ', ';
				}
			}
		}
		outputVariables = outputVariables.slice(0, -2); // Remove the last comma and space
		const mergedString = outputVariables.length ? pluginType + ': ' + outputVariables : pluginType;
		return mergedString;
	},

	render: function() {

		return (
			<div id="plugin-popup" className="plugin-popup" style={[styles.pluginPopup, this.getPluginPopupLoc(), this.state.popupVisible && styles.pluginPopupVisible]}>
				<div style={styles.pluginPopupArrow}></div>
				<div style={styles.pluginContent}>
					<div style={styles.pluginPopupTitle}>
						<FormattedMessage
								id="editor.plugin"
								defaultMessage="Plugin"/>
						: {this.state.pluginType}</div>
						{
							Object.keys(this.state.contentObject).map((valKey)=>{
								const pluginProp = this.state.contentObject[valKey];
								let elem;
								const pluginPropTitle = pluginProp.title;
								const value = this.state.values[pluginPropTitle] || pluginProp.defaultValue;
								if (pluginProp.component) {
									elem = pluginProp.component(pluginProp, value, this.props, styles);
								} else {
									elem = <input ref={'pluginInput-' + pluginPropTitle} style={styles.pluginOptionInput} name={pluginPropTitle} id={pluginPropTitle} type="text" defaultValue={value}/>;
								}
								return (<div key={'pluginVal-' + pluginPropTitle} style={styles.pluginOptionWrapper}>
													<label htmlFor={pluginPropTitle} style={styles.pluginOptionLabel}>{pluginPropTitle}</label>
													<div style={styles.pluginPropWrapper}>
														{elem}
													</div>
													<div style={[styles.pluginOptionDefault, pluginProp.defaultString && styles.pluginOptionDefaultVisible]}>
													<FormattedMessage
														id="editor.default"
														defaultMessage="default"/>
													: {pluginProp.defaultString}</div>
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
		width: 425,
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
	pluginPopupArrow: {
		position: 'absolute',
		top: -8,
		left: 15,
		width: 16,
		height: 16,
		backgroundColor: 'white',
		transform: 'rotate(45deg)',
		boxShadow: '-1px -1px 1px 0px #9A9A9A',
		zIndex: 5,
	},
	pluginContent: {
		position: 'relative',
		backgroundColor: 'white',
		zIndex: 10,
	},
	pluginPopupTitle: {
		padding: '6px 0px',
		fontSize: '18px',
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
		margin: '0px 10px 10px 10px',
		fontFamily: 'Courier',
	},
	pluginOptionLabel: {
		// width: '100%',
		display: 'inline-block',
		marginRight: '20px',
		width: '20%'
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
