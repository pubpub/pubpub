import React, {PropTypes} from 'react';
import Radium from 'radium';
import {parsePluginString, inlineAsset} from 'utils/parsePlugins';

// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';

import Plugins from 'components/Markdown/MarkdownPlugins';
import InputFields from 'components/Markdown/MarkdownPluginFields';
import MurmurHash from 'murmurhash';
import Portal from 'react-portal';
import {throttle, delay} from 'lodash';
import {pubSizes} from 'utils/styleConstants';

let styles = {};

const MarkdownWidgetModal = React.createClass({
	propTypes: {
		activeFocus: PropTypes.string,
		codeMirrorChange: PropTypes.object,
		assets: PropTypes.array,
		mode: PropTypes.string,
		cm: PropTypes.object,
		requestedAsset: PropTypes.object,
		requestAssetUpload: PropTypes.func,
		requestedAssetStatus: PropTypes.bool,
	},

	getDefaultProps: function() {
		return {
			activeFocus: '',
			codeMirrorChange: {}
		};
	},

	getInitialState() {
		this.popupInputFields = {};
		this.fromIndex = null;
		this.toIndex = null;
		this.onInputFieldChange = throttle(this._onInputFieldChange, 250);
		return {
			popupVisible: false,
			initialString: '',
			activeLine: undefined,
			activeChar: undefined,
			activeToken: null,
			pluginType: '',
			assets: [],
		};
	},

	componentDidMount() {
		document.documentElement.addEventListener('keydown', this.onpluginKeyPress);

	},
	onpluginKeyPress(evt) {
		if (evt.keyCode === 13 && this.state.popupVisible) {
			if (document.activeElement === document.body) {
				this.onPluginSave();
			}
		}
	},
	componentWillReceiveProps(nextProps) {

		// If a re-render causes this component to receive new props, but the props haven't changed, return.
		/*
		if (this.props.codeMirrorChange === nextProps.codeMirrorChange
			&& this.props.assets === nextProps.assets
		) {
			return null;
		}
		*/

		// If the change comes from another user
		if (this.props.codeMirrorChange !== nextProps.codeMirrorChange
			&& this.state.popupVisible === true
			&& nextProps.codeMirrorChange.origin
			&& (nextProps.codeMirrorChange.origin.indexOf('cmrt-') !== -1 || nextProps.codeMirrorChange.origin === 'RTCMADAPTER')) {
			this.updateToken({activeLine: this.state.activeLine, activeChar: this.state.activeChar, isUpdate: true});
		}

		return true;
	},

	componentWillUnmount() {
		document.documentElement.removeEventListener('keydown', this.onpluginKeyPress);
	},

	getActiveCodemirrorInstance: function() {
		return this.props.cm;
	},
	focus: function() {
		this.popupBox.focus();
	},
	focusFields: function() {
		if (!this.state.pluginType || !Plugins[this.state.pluginType]) return;

		const firstRefName = Plugins[this.state.pluginType].InputFields[0].title;
		const firstRef = (firstRefName) ? this.popupInputFields[firstRefName] : null;
		if (firstRef && typeof firstRef.focus === 'function') {
			const focused = firstRef.focus();
			if (!focused) {
				document.body.focus();
			}
		} else {
			document.body.focus();
		}
	},


	showAtPos: function(clickX, clickY) {


		const target = document.elementFromPoint(clickX, clickY);
		// const contentBody = document.getElementById('editor-text-wrapper');

		if (target && target.className.indexOf('ppm-widget') > -1) {

			this.fromIndex = null;
			this.toIndex = null;

			const cm = this.getActiveCodemirrorInstance();
			this.props.cm = cm;

			const selectedLine = cm.coordsChar({left: clickX, top: clickY, mode: 'window'});
			const activeChar = selectedLine.ch;
			const activeLine = selectedLine.line;

			this.updateToken({activeLine, activeChar, isUpdate: false});
			this.focusFields();

		}
	},

	showWithPlugin: function(from, to, widget) {
		this.setState({activeWidget: widget});
		this.updateToken({
			activeLine: from.line,
			activeChar: from.ch + 1,
			isUpdate: false,
		});
	},

	updateToken: function({activeChar, activeLine, isUpdate}) {

		const lastToken = (isUpdate) ? this.state.activeToken : null;
		let activeToken = null;

		const selectedTokens = this.props.cm.getLineTokens(activeLine);
		for (const token of selectedTokens) {
			if (token.start <= activeChar && activeChar <= token.end) {
				activeToken = token;
			}
		}

		const tokenChanged = (isUpdate && activeToken && lastToken && activeToken.type !== lastToken.type);

		if (!activeToken || tokenChanged) {
			this.setState({
				popupVisible: false,
				activeToken: null,
				pluginHash: null,
			});
			return;
		}

		const pluginString = activeToken.string.slice(2, -2);

		// const valueString = pluginSplit.length > 1 ? pluginSplit[1] : ''; // Values split into an array
		const values = parsePluginString(pluginString);
		const pluginType = values.pluginType;

		this.setState({
			popupVisible: true,
			activeLine: activeLine,
			activeChar: activeChar,
			activeToken: activeToken,
			pluginType: pluginType,
			pluginHash: MurmurHash.v2(pluginString),
			initialString: pluginString,
			values: values,
		});

		this.fromIndex = activeToken.start;
		this.toIndex = activeToken.end;

	},
	onPluginSave: function() {
		const cm = this.getActiveCodemirrorInstance();
		const lineNum = this.state.activeLine;

		const from = {line: lineNum, ch: this.fromIndex};
		const to = {line: lineNum, ch: this.toIndex};

		const mergedString = `[[${this.createPluginString(this.state.pluginType)}]]`;

		cm.replaceRange(mergedString, from, to);
		/*
		if (this.state.activeWidget) {
			this.state.activeWidget.setText(mergedString);
		} else {
			cm.replaceRange(mergedString, from, to);
		}
		*/

		this.toIndex = this.fromIndex + mergedString.length;
	},


	createPluginString: function(pluginType) {
		const mergedString = JSON.stringify(this.generateProperties(pluginType));
		return mergedString;
	},

	generateProperties: function(pluginType) {
		const PluginInputFields = Plugins[pluginType].InputFields;
		const outputObj = {'pluginType': pluginType};

		for (const pluginInputField of PluginInputFields) {
			// Generate an output string based on the key, values in the object
			const inputFieldTitle = pluginInputField.title;
			const ref = this.popupInputFields[inputFieldTitle];
			if (ref) {
				let val = ref.value();
				if (val instanceof Object) {
					val = inlineAsset(val);
				}
				outputObj[inputFieldTitle] = val;
			}
		}

		return outputObj;

	},


	_onInputFieldChange: function() {
		delay(this.onPluginSave, 50);
	},

	requestAssetUpload: function(field, assetType) {
		this.setState({requestingField: field});
		this.props.requestAssetUpload(assetType);
	},

	closePopup: function() {
		if (!this.props.requestedAssetStatus) {
			this.setState({popupVisible: false});
		}
	},

	render: function() {

		const PluginInputFields = (this.state.pluginType) ? Plugins[this.state.pluginType].InputFields : [];
		const PluginComponent = (this.state.pluginType) ? Plugins[this.state.pluginType].Component : null;
		const PluginProps = (this.state.pluginType) ? this.generateProperties(this.state.pluginType) : {};
		const PluginConfig = (this.state.pluginType) ? Plugins[this.state.pluginType].Config : {};

		return (
			<Portal onClose={this.closePopup} isOpened={this.state.popupVisible} closeOnOutsideClick={!this.props.requestedAssetStatus} closeOnEsc={!this.props.requestedAssetStatus}>
				<div style={styles.pluginFlexBox(this.props.mode)}>
					<div id="plugin-popup"
							ref={(ref) => this.popupBox = ref}
							className="plugin-popup"
							style={[styles.pluginPopup(this.props.mode), this.state.popupVisible && styles.pluginPopupVisible]}
						>
						<div key={this.state.pluginHash} style={styles.pluginContent}>
							<div style={styles.pluginClose} onClick={this.closePopup}>×</div>
							<div style={styles.pluginPopupTitle}>
								{this.state.pluginType}</div>
								{
										PluginInputFields.map((inputField)=>{
											const fieldType = inputField.type;
											const fieldTitle = inputField.title;
											const PluginInputFieldParams = inputField.params;
											const FieldComponent = InputFields[fieldType];
											const value = (this.state) ? this.state.values[fieldTitle] || null : null;

											const foundInAsset = (value) ? !!(this.props.assets.find((asset) => (asset._id === value._id))) : true;
											let passedAssets = this.props.assets;

											//if the asset doesn't exist in the existing library, pass it through using the serialized form
											if (!foundInAsset) {
												passedAssets = passedAssets.concat(value);
											}

											return (<div key={'pluginVal-' + fieldTitle + this.state.pluginType} style={styles.pluginOptionWrapper}>
																<label htmlFor={fieldType} style={styles.pluginOptionLabel}>{fieldTitle}</label>
																<div style={styles.pluginPropWrapper}>
																	<FieldComponent
																		selectedValue={value}
																		assets={passedAssets}
																		saveChange={this.onInputFieldChange}
																		requestAssetUpload={(this.props.requestAssetUpload) ? this.requestAssetUpload.bind(this, fieldTitle) : null}
																		requestedAsset={(this.state.requestingField === fieldTitle && this.props.requestedAsset) ? this.props.requestedAsset : null}
																		{...PluginInputFieldParams}
																		ref={(ref) => this.popupInputFields[fieldTitle] = ref}/>
																</div>
																<div style={styles.clearfix}></div>
															</div>);
										})
								}
							{/*
							<div style={styles.pluginSave} key={'pluginPopupSave'} onClick={this.onPluginSave}>
								<FormattedMessage {...globalMessages.save} />
							</div>
							*/}

						{ (PluginComponent && PluginConfig.preview && Object.keys(PluginProps).length > 0) ? <div> <div key={`preview-${this.state.pluginHash}`} style={styles.previewText}>Preview:</div> <div style={styles.previewContainer}> <PluginComponent {...PluginProps} /></div> </div> : null}
						</div>
					</div>
				</div>
			</Portal>
		);

	}
});

export default Radium(MarkdownWidgetModal);


styles = {
	previewDiv: {
		width: '75%',
		marginLeft: '10px',
	},
	previewContainer: {
		padding: '30px',
		backgroundColor: '#F1F1F1',
		fontFamily: 'Courier',
		width: '75%',
		overflow: 'hidden',
	},
	previewText: {
		display: 'block',
		marginBottom: '10px',
		fontStyle: 'italic',
		fontFamily: 'Courier',
	},
	pluginClose: {
		position: 'absolute',
		right: '0px',
		top: '0px',
		cursor: 'pointer',
		fontSize: '1.25em',
		userSelect: 'none',
	},
	pluginFlexBox: function(mode) {

		const modeStyles = {
			'preview': {
				width: '50vw',
				left: '0px',
				backgroundColor: 'rgba(255,255,255,0.5)',
				top: '60px',
			},
			'discussions': {
				width: pubSizes.defaultRightWidth,
				right: '0px',
				backgroundColor: 'rgba(255,255,255,0.5)',
				top: '30px',
			},
			'full': {
				width: '100vw',
				left: '0px',
				backgroundColor: 'rgba(255,255,255,0.5)',
				top: '60px',
			},
		};

		const modeStyle = modeStyles[mode];

		return {
			...modeStyle,
			position: 'fixed',
			height: '100vh',
			zIndex: 450,
			pointerEvents: 'none',
		};
	},
	pluginPopup: function(mode) {

		const modeStyles = {
			'preview': {
				width: '30vw',
				margin: '0px auto',
				minWidth: '350px',
			},
			'discussions': {
				width: '25vw',
				margin: '0px auto',
				minWidth: '350px',
			},
			'full': {
				width: '40vw',
				margin: '0px auto',
				minWidth: '350px',
			},
		};

		const modeStyle = modeStyles[mode];

		return {
			...modeStyle,
			position: 'relative',
			top: '5vh',
			backgroundColor: 'white',
			boxShadow: '0px 0px 2px 0px #333',
			// left: `calc(50vw - ${POPUP_WIDTH / 2}px)`,
			minHeight: '35vh',
			opacity: 0,
			transform: 'scale(0.8)',
			transition: '.02s linear transform, .02s linear opacity',
			zIndex: 450,
			padding: '2vh 3vw',
			borderRadius: '1px',
			maxHeight: '75vh',
			overflow: 'scroll',
		};
	},
	pluginPopupVisible: {
		opacity: 1,
		transform: 'scale(1.0)',
		pointerEvents: 'auto',
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
		color: '#666',
		fontFamily: '"Lato", sans-serif',
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
		fontSize: '0.95em',
		verticalAlign: 'top',
		paddingTop: '3px',
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
