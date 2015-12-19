/* global CodeMirror */
import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
// import {LoaderIndeterminate} from '../../components';
import ColorPicker from 'react-color';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const JournalDesign = React.createClass({
	propTypes: {
		input: PropTypes.string,
	},

	getDefaultProps: function() {
		
	},

	getInitialState() {
		return {
			colorSelections: {
				headerBackground: {
					display: false,
					color: '#373737',
				},
				headerText: {
					display: false,
					color: '#E0E0E0',
				},
				landingHeaderBackground: {
					display: false,
					color: '#E0E0E0',
				},
				landingHeaderText: {
					display: false,
					color: '#373737',
				}
			},
			activeKey: undefined,
		};
	},

	componentDidMount() {
		CodeMirror(document.getElementById('codeMirrorJSON'), {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: true,
			mode: {name: 'javascript', json: true},
			tabSize: 2,
			extraKeys: {'Ctrl-Space': 'autocomplete'},
			placeholder: 'Add Components...',
		});
		// codeMirror.setValue(JSON.stringify(this.props.pubStyle.cssObjectString));
	},

	handleClick: function(key) {
		return ()=> {
			const output = this.state.colorSelections;
			output[key].display = !output[key].display;
			this.setState({
				colorSelections: output,
				activeKey: key,
			});
		};
		
	},

	handleClose: function(key) {
		return ()=> {
			const output = this.state.colorSelections;
			output[key].display = false;
			this.setState(output);
		};
		
	},

	handleChange: function(color) {
		const output = this.state.colorSelections;
		output[this.state.activeKey].color = 'rgba(' + color.rgb.r + ',' + color.rgb.g + ',' + color.rgb.b + ',' + color.rgb.a + ')';
		this.setState(output);
	},

	renderColorPicker: function(key) {
		return (
			<div style={styles.pickerWrapper}>
				<div style={styles.swatch} onClick={this.handleClick(key)}>
					<div style={[styles.color, {background: this.state.colorSelections[key].color}]}></div>
				</div>
				<ColorPicker 
					type="chrome"
					color={this.state.colorSelections[key].color} 
					display={this.state.colorSelections[key].display}
					positionCSS={styles.popupPosition}
					onChange={this.handleChange}
					onClose={this.handleClose(key)}/>
			</div>
		);
	},

	render: function() {
		return (
			<div style={styles.container}>

				<Style rules={{
					'#codeMirrorJSON .CodeMirror': {
						// backgroundColor: '#efefef',
						border: '1px solid #ccc',
						fontSize: '14px',
						// color: 'red',
						fontFamily: 'Courier',
						padding: '10px 10px',
						width: 'calc(100% - 20px)',
						minHeight: '50px',
					},
					'#codeMirrorJSON .CodeMirror pre.CodeMirror-placeholder': { 
						color: '#999',
					},
				}} />

				<div style={styles.sectionHeader}>Global</div> 
				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>Header Background</div>
					{this.renderColorPicker('headerBackground')}
				</div>

				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>Header Text</div>
					{this.renderColorPicker('headerText')}
				</div>

				<div style={styles.sectionHeader}>Landing Page</div> 
				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>Landing Header Background</div>
					{this.renderColorPicker('landingHeaderBackground')}
				</div>

				<div style={styles.colorRow}>
					<div style={styles.colorRowHeader}>Landing Header Text</div>
					{this.renderColorPicker('landingHeaderText')}
				</div>

				<div style={styles.sectionHeader}>Landing Page Components</div> 
				<div id={'codeMirrorJSON'} style={styles.codeMirrorWrapper}></div>

				<div style={styles.saveButton} key={'journalDesignSaveButton'} onClick={this.saveCustomSettings}>Save</div>


			</div>
		);
	}
});

export default Radium(JournalDesign);

styles = {
	sectionHeader: {
		fontSize: 20,
		marginTop: 25,
	},
	swatch: {
		padding: '5px',
		background: '#fff',
		borderRadius: '1px',
		boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
		display: 'inline-block',
		cursor: 'pointer',
	},
	color: {
		width: '36px',
		height: '14px',
		borderRadius: '2px',
	},
	colorRow: {
		height: 24,
		margin: '10px 10px',
		
	},
	colorRowHeader: {
		lineHeight: '24px',
		height: 24,
		width: 200,
		float: 'left',
	},
	pickerWrapper: {
		position: 'relative',
		float: 'left',
		margin: '0px 10px',
	},
	popupPosition: {
		position: 'absolute',
		left: 45,
		top: 0,
	},
	codeMirrorWrapper: {
		width: '50%',
		margin: 10,
	},
	saveButton: {
		fontSize: 20,
		width: '52px',
		padding: '0px 20px',
		marginBottom: 20,
		float: 'right',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
};
