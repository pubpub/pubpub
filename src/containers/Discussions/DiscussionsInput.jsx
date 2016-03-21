/* global CodeMirror */

import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {LoaderIndeterminate, License} from 'components';
import {globalStyles} from 'utils/styleConstants';

import {globalMessages} from 'utils/globalMessages';
import {injectIntl, FormattedMessage} from 'react-intl';
import PPMComponent from '../../markdown/PPMComponent';

let styles = {};

// import {loadCss} from 'utils/loadingFunctions';
import initCodeMirrorMode from 'containers/Editor/editorCodeMirrorMode';
import {codeMirrorStyles} from 'containers/Editor/codeMirrorStyles';
import {clearTempHighlights} from 'components/PubSelectionPopup/selectionFunctions';

// import marked from '../../modules/markdown/markdown';
// import markdownExtensions from '../../components/EditorPlugins';
// marked.setExtensions(markdownExtensions);

const PubDiscussionsInput = React.createClass({
	propTypes: {
		addDiscussionHandler: PropTypes.func,
		addDiscussionStatus: PropTypes.string,
		newDiscussionData: PropTypes.object,
		userThumbnail: PropTypes.string,
		codeMirrorID: PropTypes.string,
		parentID: PropTypes.string,
		isReply: PropTypes.bool,
		activeSaveID: PropTypes.string,
		saveID: PropTypes.string,
		intl: PropTypes.object,

	},

	getInitialState() {
		return {
			expanded: false,
			content: '',
			selections: {},
			showPreview: false,
			showPreviewText: false,
		};
	},

	componentDidMount() {
		initCodeMirrorMode();

		const placeholderMsg = (this.props.isReply) ? globalMessages.discussionReplyPlaceholder : globalMessages.discussionPlaceholder;

		const cmOptions = {
			lineNumbers: false,
			value: '',
			lineWrapping: true,
			viewportMargin: Infinity, // This will cause bad performance on large documents. Rendering the entire thing...
			autofocus: false,
			mode: 'pubpubmarkdown',
			extraKeys: {'Ctrl-Space': 'autocomplete'},
			placeholder: this.props.intl.formatMessage(placeholderMsg),
		};

		const codeMirror = CodeMirror(document.getElementById(this.props.codeMirrorID), cmOptions);
		codeMirror.on('change', this.onEditorChange);
		this.cm = codeMirror;
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.addDiscussionStatus === 'loading' && this.props.activeSaveID === this.props.saveID && nextProps.addDiscussionStatus === 'loaded') {
			// This means the discussion was succesfully submitted
			// Reset any form options here.
			// const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
			const cm = document.getElementById(this.props.codeMirrorID).childNodes[0].CodeMirror;
			cm.setValue('');
			clearTempHighlights();

		} else if (this.props.newDiscussionData && this.props.newDiscussionData.get && nextProps.newDiscussionData && nextProps.newDiscussionData.get && this.props.newDiscussionData.get('selections').size !== nextProps.newDiscussionData.get('selections').size) {
			// const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
			const cm = document.getElementById(this.props.codeMirrorID).childNodes[0].CodeMirror;
			const spacing = cm.getValue().length ? ' ' : '';
			cm.setValue(cm.getValue() + spacing + '[[selection: index=' + nextProps.newDiscussionData.get('selections').size + ']] ' );
			cm.setCursor(cm.lineCount(), 0);
			// setTimeout(() => {cm.focus();}, 200);
			cm.focus();
			// cm.focus();
		}

		const newSelections = nextProps.newDiscussionData && nextProps.newDiscussionData.get ? nextProps.newDiscussionData.get('selections').toArray() : [];
		this.setState({selections: newSelections});

		// console.log('selections! ', nextProps.newDiscussionData.get('selections'));

	},

	onEditorChange: function(cm, change) {
		const content = cm.getValue();
		const showPreview = (this.state.showPreview || content.indexOf('[[selection:') !== -1);
		this.setState({content: content, showPreview: showPreview, expanded: this.state.expanded || showPreview, showPreviewText: true});
		// console.log('change!');
		// console.log(cm);
	},

	submitDiscussion: function() {
		const newDiscussion = {};
		// const cm = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
		const cm = document.getElementById(this.props.codeMirrorID).childNodes[0].CodeMirror;
		newDiscussion.markdown = cm.getValue();
		newDiscussion.assets = {};
		newDiscussion.selections = {};
		newDiscussion.references = {};
		newDiscussion.parent = this.props.parentID;
		this.props.addDiscussionHandler(newDiscussion, this.props.saveID);
	},

	onFocus: function() {
		this.setState({expanded: true});
	},
	onBlur: function() {
		if (this.cm.getValue().length === 0) {
			this.setState({expanded: false});
		}
	},

	toggleLivePreview: function() {
		this.setState({showPreview: !this.state.showPreview});
	},

	render: function() {

		return (
			<div style={[styles.container, this.props.isReply && styles.replyContainer]}>

				<Style rules={{
					'.inputCodeMirror .CodeMirror': {
						...codeMirrorStyles(),
						backgroundColor: 'transparent',
						fontSize: '15px',
						color: '#222',
						fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
						padding: '0px 20px',
						width: 'calc(100% - 40px)',
						minHeight: '25px',
						fontWeight: '300'
					},
					'.inputCodeMirror .CodeMirror-placeholder': {
						color: '#aaa',
					},
				}} />

			<div style={[styles.inputTopLine, styles.expanded(this.state.expanded, true)]}>
					<div style={styles.thumbnail}>
						{this.props.userThumbnail
							? <img style={styles.thumbnailImage}src={this.props.userThumbnail} />
							: null
						}
					</div>
					<div style={styles.license} key={'discussionLicense'}>
						<License text={'All discussions are licensed under a'} hover={true} />
					</div>

					{/* <div style={styles.topCheckbox} key={'newDiscussionAnonymous'} >
						<label style={styles.checkboxLabel} htmlFor={'anonymousDiscussion'}>Anonymous</label>
						<input style={styles.checkboxInput} name={'anonymousDiscussion'} id={'anonymousDiscussion'} type="checkbox" value={'anonymous'} ref={'anonymousDiscussion'}/>
					</div>
					<div style={styles.topCheckbox} key={'newDiscussionPrivate'} >
						<label style={styles.checkboxLabel} htmlFor={'privateDiscussion'}>Private</label>
						<input style={styles.checkboxInput} name={'privateDiscussion'} id={'privateDiscussion'} type="checkbox" value={'private'} ref={'privateDiscussion'}/>
					</div> */}
				</div>
				<div id={this.props.codeMirrorID} className={'inputCodeMirror'} style={styles.inputBox(this.state.expanded)} onBlur={this.onBlur} onFocus={this.onFocus}></div>

				<div style={styles.loaderContainer}>
					{(this.props.addDiscussionStatus === 'loading' && this.props.activeSaveID === this.props.saveID ? <LoaderIndeterminate color="#444"/> : null)}
				</div>

				<div style={[styles.inputBottomLine, styles.expanded(this.state.expanded || this.props.isReply, false)]}>

					{
						(this.state.showPreviewText) ?
					<span style={styles.livePreviewText}>Live Preview: <span style={styles.livePreviewToggle} onClick={this.toggleLivePreview}>{(this.state.showPreview) ? 'On' : 'Off'}</span> <span style={styles.lighterText}>(you can use <a target="_blank" href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">markdown</a> for styling)</span></span>
					: null
					}
					<div style={styles.submitButton} key={'newDiscussionSubmit'} onClick={this.submitDiscussion}>
						<FormattedMessage {...globalMessages.Submit}/>
					</div>
				</div>

				{
					(this.state.showPreview) ?
					<div>
						<div style={styles.livePreviewBox}>
							<PPMComponent assets={{}} references={{}} selections={this.state.selections} markdown={this.state.content} />
						</div>
					</div>
					: null
				}

			</div>
		);
	}
});

export default injectIntl(Radium(PubDiscussionsInput));

styles = {
	expanded: function(expand, flipUp) {
		const expandObj = {};
		if (expand) {
			expandObj.opacity = 1;
			expandObj.transform = 'translateY(0px)';
		} else {
			expandObj.opacity = 0;
			expandObj.pointerEvents = 'none';
			if (flipUp) {
				expandObj.transform = 'translateY(10px)';
			} else {
				expandObj.transform = 'translateY(-10px)';
			}
		}
		expandObj.transition = 'transform .15s, opacity .15s';

		return expandObj;
	},
	container: {
		width: '100%',
		overflow: 'hidden',
		margin: '0px 0px',
		position: 'relative',
	},
	livePreviewText: {
		fontSize: '0.8em',
		fontWeight: '400',
		userSelect: 'none',
		cursor: 'default',
		marginLeft: '2.5%',
	},
	lighterText: {
		fontWeight: '300',
	},
	livePreviewToggle: {
		textDecoration: 'underline',
		cursor: 'pointer',
	},
	livePreviewBox: {
		width: '90%',
		display: 'block',
		margin: '5px auto 15px',
		border: '1px dashed #888',
		padding: '10px',
		fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif',
		color: '#555',
		fontSize: '0.85em',
	},
	replyContainer: {
		// margin: '0px 10px 10px 0px',
	},
	inputTopLine: {
		// backgroundColor: 'rgba(255,0,0,0.1)',
		height: 22,
	},
	inputBottomLine: {
		// backgroundColor: 'rgba(255,0,100,0.1)',
		height: 20,
		marginBottom: '15px',
	},
	inputBox: function(expanded) {
		return {
			backgroundColor: '#fff',
			minHeight: 25,
			padding: '10px 0px',
			// boxShadow: '0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12)',
			boxShadow: '0px 0px 2px rgba(0,0,0,0.4)',
			margin: '10px auto',
			width: 'calc(100% - 4px)',
			borderRadius: '1px',
			cursor: 'pointer',
			border: (expanded) ? '1px solid rgb(225, 225, 225)' : '1px solid white',
		};
	},
	loaderContainer: {
		position: 'absolute',
		bottom: '30px',
		width: '100%',
	},
	thumbnail: {
		width: '20px',
		height: '20px',
		padding: '1px',
		marginRight: '1px',
		float: 'right',
	},
	thumbnailImage: {
		width: '100%',
	},
	license: {
		float: 'right',
		lineHeight: '26px',
		opacity: '0.4',
		paddingRight: '4px',
		':hover': {
			opacity: '1.0',
		},
	},
	topCheckbox: {
		float: 'right',
		height: 20,

		userSelect: 'none',
		color: globalStyles.sideText,
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}
	},
	checkboxLabel: {
		fontSize: '14px',
		margin: '0px 3px 0px 15px',
		cursor: 'pointer',
	},
	checkboxInput: {
		cursor: 'pointer',
	},
	submitButton: {
		float: 'right',
		color: globalStyles.sideText,
		padding: '0px 5px',
		':hover': {
			cursor: 'pointer',
			color: globalStyles.sideHover,
		}

	},

};
