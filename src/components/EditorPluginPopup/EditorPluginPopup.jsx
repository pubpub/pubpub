import React, {PropTypes} from 'react';
import Radium from 'radium';
import {globalPluginOptions, pluginOptions} from '../../components/EditorPlugins';

let styles = {};

const Reference = React.createClass({
	propTypes: {
		activeFocus: PropTypes.string,
		codeMirrorChange: PropTypes.object
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
			contentObject: {},
			defaultObjectTitles: {},
			defaultObjectDefaults: {},

		};
	},

	componentDidMount() {
		document.documentElement.addEventListener('click', this.onPluginClick);
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.codeMirrorChange === nextProps.codeMirrorChange) { 
			// If a re-render causes this component to receive new props, but the props haven't changed, return.
			return null;
		}

		const change = nextProps.codeMirrorChange;

		// If the content changes and the popup is visible, it will be out of date, so hide it.
		// Well, we don't want it to close if ANY change is made, only a change to the same line
		// If the from to to line of the change equal the line of the popup, close it.
		if (this.state.activeLine !== undefined && this.state.activeLine >= change.from.line && this.state.activeLine <= change.to.line) {
			this.setState({
				popupVisible: false,
				activeLine: undefined,
				contentObject: {},
			});
		}

		// Ff the change causes the line above to change, change the activeLine
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

		const target = document.elementFromPoint(clickX, clickY);
		const contentBody = document.getElementById('editor-text-wrapper');

		if (target.className.indexOf('cm-plugin') > -1) {
			const cm = this.getActiveCodemirrorInstance();
			const pluginString = target.innerHTML.slice(1, -1); // Original string minus the brackets
			const pluginSplit = pluginString.split(':');
			const pluginType = pluginSplit[0];
			const values = pluginSplit.length > 1 ? pluginSplit[1].split(',') : undefined; // Values split into an array

			const pluginObject = {};
			if (values !== undefined) {
				// Map the array values into an object
				values.map((valueString)=>{
					const key = valueString.split('=')[0].replace(/ /g, '');
					const value = valueString.split('=')[1];
					pluginObject[key] = value;
				});
			}

			const defaultValues = {...globalPluginOptions.values, ...pluginOptions[pluginType].values};
			// console.log('plugin values', pluginOptions[pluginType].values);
			// console.log('defaultObject', defaultValues);
			const outputObject = {...defaultValues};
			for (const key in defaultValues) {
				// Take all of the the value specified in the text, and overwrite default values.
				if (key in pluginObject) {
					outputObject[key] = pluginObject[key];
				}
			}

			const defaultObjectTitles = pluginType
				? {...globalPluginOptions.titles, ...pluginOptions[pluginType].titles}
				: {};
			const defaultObjectDefaults = pluginType
				? {...globalPluginOptions.defaults, ...pluginOptions[pluginType].defaults}
				: {};

			this.setState({
				popupVisible: true,
				xLoc: clickX - 22,
				yLoc: clickY + 15 - 60 + contentBody.scrollTop,
				activeLine: cm.getCursor().line,
				pluginType: pluginType,
				contentObject: outputObject,
				initialString: pluginString,
				defaultObjectTitles: defaultObjectTitles,
				defaultObjectDefaults: defaultObjectDefaults
			});

		} else {

			if (document.getElementById('plugin-popup').contains(event.target)) {
				this.setState({
					popupVisible: true,
				});
			} else {
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

		let outputVariables = '';
		for (const key in this.state.contentObject) {
			// Generate an output string based on the key, values in the object
			if (Object.prototype.hasOwnProperty.call(this.state.contentObject, key)) {
				const val = this.refs['pluginInput-' + key].value;

				if (val && val.length) {
					outputVariables += key + '=' + val + ', ';
				}
			}
		}
		outputVariables = outputVariables.slice(0, -2); // Remove the last comma and space

		const mergedString = outputVariables.length ? this.state.pluginType + ': ' + outputVariables : this.state.pluginType;
		const outputString = lineContent.replace(this.state.initialString, mergedString);
		
		cm.replaceRange(outputString, from, to); // Since the popup closes on change, this will close the pluginPopup
	},

	
	render: function() {

		return (
			<div id="plugin-popup" className="plugin-popup" style={[styles.pluginPopup, this.getPluginPopupLoc(), this.state.popupVisible && styles.pluginPopupVisible]}>
				<div style={styles.pluginPopupArrow}></div>
				<div style={styles.pluginContent}>
					<div style={styles.pluginPopupTitle}>{this.state.pluginType} plugin</div>
						{

							Object.keys(this.state.contentObject).map((pluginValue)=>{
								return (
									<div key={'pluginVal-' + pluginValue}>
										<label htmlFor={pluginValue} >{this.state.defaultObjectTitles[pluginValue]}</label>
										<input ref={'pluginInput-' + pluginValue} name={pluginValue} id={pluginValue} type="text" defaultValue={this.state.contentObject[pluginValue]}/>
										<div>default: {this.state.defaultObjectDefaults[pluginValue]}</div>
									</div>
									
								);
							})
						}
						
					<div onClick={this.onPluginSave}>Save</div>
				</div>
			</div>
		);
		
	}
});

export default Radium(Reference);

styles = {
	pluginPopup: {
		width: 300,
		minHeight: 200,
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
};
