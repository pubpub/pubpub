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
			citationObject: {},
			mode: 'mla'
		};
	},

	getInitialState() {
		return {
			pluginPopupVisible: false,
			pluginPopupX: 0,
			pluginPopupY: 0,
			pluginPopupInitialString: '',
			pluginPopupActiveLine: undefined,
			pluginPopupType: '',
			pluginPopupContentObject: {},

		};
	},

	componentDidMount() {
		document.documentElement.addEventListener('click', this.onPluginClick);
	},

	componentWillReceiveProps(nextProps) {
		// If there is a popupplugin
		// If the activeLine is not undefined
		// if the active line is within the range of changes
		const change = nextProps.codeMirrorChange;

		if (this.state.pluginPopupVisible && this.state.pluginPopupActiveLine !== undefined && this.state.pluginPopupActiveLine >= change.from.line && this.state.pluginPopupActiveLine <= change.to.line) {

			this.setState({
				pluginPopupVisible: false,
				pluginPopupContentObject: {}
			});
		}

		// if the change causes the line above to change, change the activeLine
		if (this.state.pluginPopupVisible && this.state.pluginPopupActiveLine !== undefined && change.from.line < this.state.pluginPopupActiveLine) {
			// console.log('in the change');
			// console.log('old line', this.state.pluginPopupActiveLine);
			// console.log('new line', this.state.pluginPopupActiveLine + change.text.length - 1 - change.removed.length + 1);
			this.setState({
				pluginPopupActiveLine: this.state.pluginPopupActiveLine + change.text.length - change.removed.length,
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
			top: this.state.pluginPopupY,
			left: this.state.pluginPopupX,
		};
	},

	onPluginClick: function(event) {
		let xLoc;
		let yLoc;

		if (event.pageX || event.pageY) {
			xLoc = event.pageX;
			yLoc = event.pageY;
		} else {
			xLoc = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			yLoc = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}

		const target = document.elementFromPoint(xLoc, yLoc);
		const contentBody = document.getElementById('editor-text-wrapper');


		if (target.className.indexOf('cm-plugin') > -1) {
			const cm = this.getActiveCodemirrorInstance();
			const pluginString = target.innerHTML.slice(1, -1);
			console.log(pluginString);
			const pluginSplit = pluginString.split(':');
			const pluginType = pluginSplit[0];

			const values = pluginSplit.length > 1 ? pluginSplit[1] : undefined;
			const pluginObject = {};
			if (values !== undefined) {
				const splitValues = values.split(',');
				splitValues.map((valueString)=>{
					const key = valueString.split('=')[0].replace(/ /g, '');
					const value = valueString.split('=')[1];
					pluginObject[key] = value;
				});
			}
			console.log(pluginObject);
			// pass pluginObject to a function that 
			const defaultObject = {...globalPluginOptions.values, ...pluginOptions[pluginType].values};
			console.log('plugin values', pluginOptions[pluginType].values);
			console.log('defaultObject', defaultObject);
			const outputObject = {...defaultObject};
			for (const key in defaultObject) {
				if (key in pluginObject) {
					outputObject[key] = pluginObject[key];
				}
			}
			console.log('outputObject', outputObject);
			// 1) gets the global object parameters
			// 2) gets the local object paramaters (e.g. parameters for image or video or whatever)
			// 3) merges these with the pluginObject derived above
			// Save that object to pluginPopupContentObject
			// How do we handle defaults, comments, etc. Perhaps a separate comments object. Same keys, but with an explainer string

			this.setState({
				pluginPopupVisible: true,
				pluginPopupX: xLoc - 22,
				pluginPopupY: yLoc + 15 - 60 + contentBody.scrollTop,
				pluginPopupActiveLine: cm.getCursor().line,
				pluginPopupType: pluginType,
				pluginPopupContentObject: outputObject,
				pluginPopupInitialString: pluginString,

			});

			
		} else {

			if (document.getElementById('plugin-popup').contains(event.target)) {
				this.setState({
					pluginPopupVisible: true,
				});
			} else {
				this.setState({
					pluginPopupVisible: false,
					pluginPopupContentObject: {}
				});
			}
			
		}
	},

	onPluginSave: function() {
		const cm = this.getActiveCodemirrorInstance();
		const lineNum = this.state.pluginPopupActiveLine;
		const lineContent = cm.getLine(lineNum);
		const from = {line: lineNum, ch: 0};
		const to = {line: lineNum, ch: lineContent.length};
		// const newContent = '# Howdy!'; // This should eventually be calculated from the pluginPopup options
		
		
		// const newOutputValues = {};
		let outputVariables = '';
		for (const key in this.state.pluginPopupContentObject) {
			if (Object.prototype.hasOwnProperty.call(this.state.pluginPopupContentObject, key)) {
				// console.log('key', key);
				// console.log(this.refs['pluginInput-' + key].value);
				const val = this.refs['pluginInput-' + key].value;
				// newOutputValues[key] = val && val.length ? val : undefined;
				if (val && val.length) {
					outputVariables += key + '=' + val + ', ';
				}

			}
			
		}
		outputVariables = outputVariables.slice(0, -2);
		console.log(outputVariables);

		// console.log('newOutputValues', newOutputValues);

		const outputString = outputVariables.length ? this.state.pluginPopupType + ': ' + outputVariables : this.state.pluginPopupType;
		console.log('outputString', outputString);
		// iterate through all keys in pluginPopupContentObject (make a new object and iterate through that so we can mutate)
		// get the value as defined at the React.refs(key) input
		// save value to new object
		// Generate a string based on that object
		// Format string for output and replace with line below
		const newString = lineContent.replace(this.state.pluginPopupInitialString, outputString);
		
		cm.replaceRange(newString, from, to); // Since the popup closes on change, this will close the pluginPopup
	},

	
	render: function() {
		const defaultObjectTitles = this.state.pluginPopupType
			? {...globalPluginOptions.titles, ...pluginOptions[this.state.pluginPopupType].titles}
			: {};
		const defaultObjectDefaults = this.state.pluginPopupType
			? {...globalPluginOptions.defaults, ...pluginOptions[this.state.pluginPopupType].defaults}
			: {};

		return (
			<div id="plugin-popup" className="plugin-popup" style={[styles.pluginPopup, this.getPluginPopupLoc(), this.state.pluginPopupVisible && styles.pluginPopupVisible]}>
				<div style={styles.pluginPopupArrow}></div>
				<div style={styles.pluginContent}>
					<div style={styles.pluginPopupTitle}>{this.state.pluginPopupType} plugin</div>
						{

							Object.keys(this.state.pluginPopupContentObject).map((pluginValue)=>{
								return (
									<div key={'pluginVal-' + pluginValue}>
										<label htmlFor={pluginValue} >{defaultObjectTitles[pluginValue]}</label>
										<input ref={'pluginInput-' + pluginValue} name={pluginValue} id={pluginValue} type="text" defaultValue={this.state.pluginPopupContentObject[pluginValue]}/>
										<div>default: {defaultObjectDefaults[pluginValue]}</div>
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
