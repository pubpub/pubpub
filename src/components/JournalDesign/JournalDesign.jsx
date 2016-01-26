/* global CodeMirror */

import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {LandingBody, LoaderIndeterminate} from '../../components';
import ColorPicker from 'react-color';
import {globalStyles} from '../../utils/styleConstants';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const JournalDesign = React.createClass({
	propTypes: {
		journalSaveHandler: PropTypes.func,
		designObject: PropTypes.object,
		journalSaving: PropTypes.bool,
		journalData: PropTypes.object,
	},

	getDefaultProps: function() {
		return {
			designObject: {},
			journalSaving: false,
		};
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
				headerHover: {
					display: false,
					color: '#FFF',
				},
				landingHeaderBackground: {
					display: false,
					color: '#E0E0E0',
				},
				landingHeaderText: {
					display: false,
					color: '#373737',
				},
				landingHeaderHover: {
					display: false,
					color: '#000',
				},
			},
			activeKey: undefined,
			jsonError: undefined,
			landingPreviewHeight: 50, 
			landingPreviewScale: 1.0,
		};
	},

	componentWillMount() {
		this.loadSavedColors();
	},

	componentDidMount() {
		const codeMirror = CodeMirror(document.getElementById('codeMirrorJSON'), {
			lineNumbers: false,
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: false,
			mode: {name: 'javascript', json: true},
			tabSize: 2,
			extraKeys: {'Ctrl-Space': 'autocomplete'},
			placeholder: 'Add Components...',
		});
		codeMirror.on('change', this.onCodeChange);
		codeMirror.setValue(this.props.designObject.layoutString);
		window.addEventListener('resize', this.updatePreviewSize);
		setTimeout(()=>{
			this.setLandingPreviewHeight();
		}, 1000);
		// codeMirror.setValue(JSON.stringify(this.props.pubStyle.cssObjectString));
	},

	componentWillUnmount() {
		window.removeEventListener('resize', this.updatePreviewSize);
	},

	loadSavedColors: function() {
		this.setState({
			colorSelections: {
				headerBackground: {color: this.props.designObject.headerBackground, display: false} || this.state.headerBackground,
				headerText: {color: this.props.designObject.headerText, display: false} || this.state.headerText,
				headerHover: {color: this.props.designObject.headerHover, display: false} || this.state.headerHover,
				landingHeaderBackground: {color: this.props.designObject.landingHeaderBackground, display: false} || this.state.landingHeaderBackground,
				landingHeaderText: {color: this.props.designObject.landingHeaderText, display: false} || this.state.landingHeaderText,
				landingHeaderHover: {color: this.props.designObject.landingHeaderHover, display: false} || this.state.landingHeaderHover,
			}
		});
	},

	updatePreviewSize: function() {
		this.setState({
			landingPreviewScale: this.calcLandingPreviewScale(),
		});
		setTimeout(()=>{
			this.setLandingPreviewHeight();
		}, 50);
	},

	onCodeChange: function(cm, change) {
		// console.log(cm.getValue());
		try {
			// console.log('string', cm.getValue().replace(/(['"])?([:]?[a-zA-Z0-9_]+)(['"])?: /g, '"$2": ').replace(/'/g, '"'));
			// console.log(cm.getValue().replace(/(['"])?([:]?[a-zA-Z0-9_]+)(['"])?: /g, '"$2": ').replace(/'/g, '"'));
			const array = JSON.parse(cm.getValue().replace(/(['"])?([:]?[a-zA-Z0-9_]+)(['"])?: /g, '"$2": ').replace(/'/g, '"'));
			// const array = JSON.parse(cm.getValue());

			// console.log('array', array);
			this.setState({
				componentsArray: array,
				jsonError: undefined,
				landingPreviewScale: this.calcLandingPreviewScale(),
			});
			setTimeout(()=>{
				this.setLandingPreviewHeight();
			}, 50);
		} catch (err) {
			this.setState({
				jsonError: err.toString(),
			});
		}
		
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
	colorStyles: function(background, text, hover) {
		return {
			backgroundColor: background,
			color: text,
			':hover': {
				color: hover,
				cursor: 'pointer',
			}
		};
	},

	setLandingPreviewHeight: function() {
		this.setState({
			landingPreviewHeight: typeof(window) !== 'undefined' ? document.getElementById('landingMockContainer').clientHeight * (document.getElementById('landingPreviewContainer').clientWidth / window.innerWidth) : 50,
		});
		// return 
	},
	calcLandingPreviewScale: function() {
		return typeof(window) !== 'undefined' ? document.getElementById('landingPreviewContainer').clientWidth / window.innerWidth : 1.0;
	},

	saveDesign: function() {
		const cm = document.getElementById('codeMirrorJSON').childNodes[0].CodeMirror;

		const object = {
			headerBackground: this.state.colorSelections.headerBackground.color,
			headerText: this.state.colorSelections.headerText.color,
			headerHover: this.state.colorSelections.headerHover.color,
			landingHeaderBackground: this.state.colorSelections.landingHeaderBackground.color,
			landingHeaderText: this.state.colorSelections.landingHeaderText.color,
			landingHeaderHover: this.state.colorSelections.landingHeaderHover.color,
			layoutString: cm.getValue(),
		};
		this.props.journalSaveHandler({design: object});
	},

	render: function() {
		// console.log(this.props.designObject);
		const color = this.state.jsonError ? '#c22' : '#ccc';
		return (
			<div style={styles.container}>

				<Style rules={{
					'#codeMirrorJSON .CodeMirror': {
						// backgroundColor: '#efefef',
						border: '1px solid ' + color,
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
				<div style={styles.sectionHeader}>
					<FormattedMessage id="journal.global" defaultMessage="Global"/>
				</div> 
				<div style={styles.sectionContent}>
					<div style={styles.sectionContentLeft}>
						<div style={styles.colorRow}>
							<div style={styles.colorRowHeader}>
								<FormattedMessage id="journal.headerBackground" defaultMessage="Header Background"/>
							</div>
							{this.renderColorPicker('headerBackground')}
						</div>

						<div style={styles.colorRow}>
							<div style={styles.colorRowHeader}>
								<FormattedMessage id="journal.headerText" defaultMessage="Header Text"/>
							</div>
							{this.renderColorPicker('headerText')}
						</div>
						<div style={styles.colorRow}>
							<div style={styles.colorRowHeader}>
								<FormattedMessage id="journal.headerTextHover" defaultMessage="Header Text Hover"/>
							</div>
							{this.renderColorPicker('headerHover')}
						</div>
					</div>

					<div style={styles.sectionContentRight}>
						<div style={[styles.mockHeaderBar, this.colorStyles(this.state.colorSelections.headerBackground.color, this.state.colorSelections.headerText.color, this.state.colorSelections.headerHover.color)]} key={'globalJournalMockHeader'}>
							<FormattedMessage {...globalMessages.journalName} />
						</div>
						<div style={styles.mockBody}></div>
						<div style={styles.mockPub}></div>
					</div>

					<div style={globalStyles.clearFix}></div>
					
				</div>

				<div style={styles.sectionHeader}>
					<FormattedMessage id="journal.landingPage" defaultMessage="Landing Page"/>
				</div> 

				<div style={styles.sectionContent}>
					<div style={styles.sectionContentLeft}>
						<div style={styles.colorRow}>
							<div style={styles.colorRowHeader}>
								<FormattedMessage id="journal.landingHeaderBackground" defaultMessage="Landing Header Background"/>
							</div>
							{this.renderColorPicker('landingHeaderBackground')}
						</div>
						<div style={styles.colorRow}>
							<div style={styles.colorRowHeader}>
								<FormattedMessage id="journal.landingHeaderText" defaultMessage="Landing Header Text"/>
							</div>
							{this.renderColorPicker('landingHeaderText')}
						</div>
						<div style={styles.colorRow}>
							<div style={styles.colorRowHeader}>
								<FormattedMessage id="journal.landingHeaderTextHover" defaultMessage="Landing Header Text Hover"/>
							</div>
							{this.renderColorPicker('landingHeaderHover')}
						</div>
					

						<div style={[styles.sectionHeader, styles.sectionHeaderInternal]}>
							<FormattedMessage id="journal.landingPageComponents" defaultMessage="Landing Page Components"/>
						</div> 
						<div id={'codeMirrorJSON'} style={styles.codeMirrorWrapper}></div>
						<div style={styles.jsonError}>{this.state.jsonError}</div>
					</div>

					<div id="landingPreviewContainer" style={[styles.sectionContentRight, styles.sectionContentRightLanding, {height: this.state.landingPreviewHeight}]}>
						<div id="landingMockContainer" style={[styles.landingMockContainer, {transform: 'scale(' + this.state.landingPreviewScale + ')'}]}>
							<div style={[styles.mockHeaderBarLanding, this.colorStyles(this.state.colorSelections.landingHeaderBackground.color, this.state.colorSelections.landingHeaderText.color, this.state.colorSelections.landingHeaderHover.color)]} key={'landingJournalMockHeader'}>
								<FormattedMessage {...globalMessages.journalName} />
							</div>
							<LandingBody componentsArray={this.state.componentsArray} journalID={this.props.journalData.getIn(['journalData', '_id'])} journalData={this.props.journalData.get('journalData')}/>
						</div>
						
					</div>

					<div style={globalStyles.clearFix}></div>

				</div>

				<div style={styles.saveButton} key={'journalDesignSaveButton'} onClick={this.saveDesign}>
					<FormattedMessage {...globalMessages.save} />
				</div>

				<div style={styles.loader}>
					{this.props.journalSaving
						? <LoaderIndeterminate color={globalStyles.sideText}/>
						: null
					}
				</div>

				<div style={globalStyles.clearFix}></div>

			</div>
		);
	}
});

export default Radium(JournalDesign);

styles = {
	container: {
		position: 'relative',
	},
	sectionHeader: {
		fontSize: 20,
		marginTop: 25,
	},
	sectionHeaderInternal: {
		marginLeft: -10,
	},
	sectionContent: {
		marginLeft: 10,
	},
	sectionContentLeft: {
		float: 'left',
		width: 'calc(50% - 10px)',
		marginRight: 10,
	},
	sectionContentRight: {
		float: 'left',
		width: 'calc(50% - 12px)',
		marginLeft: 10,
		position: 'relative',
		border: '1px solid #bbb',
		overflow: 'hidden',
		minHeight: '30px',
	},
	sectionContentRightLanding: {
		// height: typeof(window) !== 'undefined' ? document.getElementById('landingPreviewContainer').clientHeight * (document.getElementById('landingPreviewContainer').clientWidth / window.innerWidth) : 30,
		// height: typeof(window) !== 'undefined' ? document.getElementById('landingMockContainer').clientHeight : 30,
		// height: typeof(window) !== 'undefined' ? document.getElementById('landingMockContainer').clientHeight * (document.getElementById('landingPreviewContainer').clientWidth / window.innerWidth) : 30,

	},
	landingMockContainer: {
		width: '100vw',
		overflow: 'hidden',
		// height: '100vh',
		// transform: typeof(window) !== 'undefined' ? 'scale(' + document.getElementById('landingPreviewContainer').clientWidth / window.innerWidth + ')' : '',
		// transformOrigin: '0% 0%',
		transformOrigin: '0% 0%',
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
		margin: '10px 0px',
		
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
		width: 'calc(100% - 2px)',
		margin: '10px 0px',
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
	mockHeaderBar: {
		width: '100%',
		height: '20px',
	},
	mockHeaderBarLanding: {
		width: '100vw',
		height: globalStyles.headerHeight,
		// position: 'fixed',
	},
	mockBody: {
		width: '100%',
		height: '150px',
		backgroundColor: globalStyles.sideBackground,
	},
	mockPub: {
		width: '50%',
		height: '152',
		position: 'absolute',
		left: '20%',
		top: '18px',
		backgroundColor: '#FFF',
		boxShadow: '0px 2px 2px #999',
	},
	loader: {
		position: 'absolute',
		bottom: 10,
		width: '100%',
	},
	jsonError: {
		width: '100%',
		textAlign: 'center',
		color: 'red',
		fontFamily: 'Courier',
		fontSize: '15px',
	}
};
