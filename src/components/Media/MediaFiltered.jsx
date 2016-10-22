import Radium from 'radium';
import React, { PropTypes } from 'react';
import {ManageSingle} from 'containers';
import {AtomViewerPane} from 'containers/Atom/AtomViewerPane';
import {FormattedMessage} from 'react-intl';
import {ensureImmutable} from 'reducers';
import {globalMessages} from 'utils/globalMessages';
import {RadioGroup, Radio} from 'utils/ReactRadioGroup';
// import {connect} from 'react-redux';
// import {safeGetInToJS} from 'utils/safeParse';
// import {AtomEditorPane} from 'containers/Atom/AtomEditorPane';
// import fuzzy from 'fuzzy';
// import {LoaderDeterminate, NavContentWrapper} from 'components';
// import Select from 'react-select';

// import {globalStyles} from 'utils/styleConstants';
// import Dropzone from 'react-dropzone';
// import {s3Upload} from 'utils/uploadFile';
// import {getMedia, createAtom, saveVersion} from './actions';

let styles;

export const Media = React.createClass({
	propTypes: {
		mediaData: PropTypes.object,
		// dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			showMedia: false,
			closeCallback: undefined,
			// filter: '',
			nodeData: {},
			atomMode: 'recent',
			editNodeDataMode: false,
			// uploadRates: [],
			// uploadFiles: [],
		};
	},

	componentDidMount() {
		// this.props.dispatch(getMedia());
		window.toggleMedia = this.toggleMedia;
		document.addEventListener('keydown', this.closeOnEscape);
	},
	componentWillUnmount() {
		document.removeEventListener('keydown', this.closeOnEscape);
	},

	closeOnEscape: function(evt) {
		let isEscape = false;
		if ('key' in evt) {
			isEscape = evt.key === 'Escape';
		} else {
			isEscape = evt.keyCode === 27;
		}

		if (isEscape) {
			this.close();
		}
	},

	toggleMedia: function(pm, callback, node, atomType) {
		this.setState({
			showMedia: true,
			closeCallback: callback,
			nodeData: typeof node.attrs.source === 'string' ? node.attrs : undefined,
			atomType: atomType
		});
	},

	clearNodeData: function() {
		this.setState({nodeData: {...this.state.nodeData, data: undefined}}); // Is this right? Do we want nodeData to just be an empty object?
	},

	editNodeData: function() {
		this.setState({editNodeDataMode: true});
	},
	cancelEditNodeData: function() {
		let nodeData = this.state.nodeData;
		if (!this.state.nodeData.data.content) {
			nodeData = {};
		}
		this.setState({
			editNodeDataMode: false,
			nodeData: nodeData,
		});
	},


	inputChange: function(type, evt) {
		if (type === 'caption') {
			this.setState({nodeData: {...this.state.nodeData, caption: evt.target.value}});
		}

		if (type === 'size') {
			this.setState({nodeData: {...this.state.nodeData, size: evt.target.value}});
		}

		if (type === 'mode') {
			this.setState({nodeData: {...this.state.nodeData, mode: evt}});
		}

		if (type === 'align') {
			this.setState({nodeData: {...this.state.nodeData, align: evt}});
		}

		if (type === 'className') {
			this.setState({nodeData: {...this.state.nodeData, className: evt.target.value}});
		}
	},

	close: function() {
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
			nodeData: {},
			editNodeDataMode: false,
		});
	},

	setItem: function(item) {
		const nodeData = this.state.nodeData || {};
		// console.log(item);
		this.setState({
			nodeData: {
				source: item._id,
				className: nodeData.className || '',
				id: item._id,
				align: nodeData.align || 'full',
				size: nodeData.size || '',
				caption: nodeData.caption || '',
				mode: nodeData.mode || 'embed',
				data: item,
			},
		});
	},

	saveItem: function(evt) {
		evt.preventDefault();
		const nodeData = this.state.nodeData;
		this.state.closeCallback({
			source: nodeData.data._id,
			className: nodeData.className,
			id: nodeData.data._id,
			align: nodeData.align,
			size: nodeData.size,
			caption: nodeData.caption,
			mode: nodeData.mode,
			data: nodeData.data,
		});
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
		});

	},

	insertItem: function(item) {
		const mode = (this.state.atomType === 'reference') ? 'cite' : 'embed';
 		const nodeData = {
			source: item._id,
			className: '',
			id: item._id,
			align: 'full',
			size: '',
			caption: '',
			mode: mode,
			data: item,
		};

		this.state.closeCallback(nodeData);
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
		});

	},



	render: function() {
		const nodeData = this.state.nodeData || {};

		return (
			<div style={[styles.container, this.state.showMedia && styles.containerActive]}>
				<div style={styles.splash} onClick={this.close}></div>

				<div style={[styles.modalContent, this.state.showMedia && styles.modalContentActive]}>

					{/* If we DON'T have a chosen atom */}
					{!nodeData.data &&
						<div style={{padding: '2em'}}>
							<ManageSingle atomType={this.state.atomType} insertItemHandler={this.insertItem} setItemHandler={this.setItem}/>
						</div>

					}

					{/* If we DO have a chosen atom  and are trying to edit it*/}
					{nodeData.data && this.state.editNodeDataMode &&
						<div style={styles.mediaDetails}>
							<div style={styles.editModeHeader}>
								<h3 style={styles.detailsTitle}>{nodeData.data.parent.title}</h3>
								<div style={styles.detailsCancel} className={'underlineOnHover'} onClick={this.cancelEditNodeData}><FormattedMessage {...globalMessages.Cancel}/></div>
							</div>
							<div style={styles.details}>
								<AtomEditorPane ref={'atomEditorPane'} atomData={ensureImmutable({ atomData: nodeData.data.parent, currentVersionData: nodeData.data })}/>
							</div>
						</div>
					}

				</div>

			</div>

		);
	}

});

export default Radium(Media);

styles = {
	editModeHeader: {
		display: 'table',
		padding: '.5em 0em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	container: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		backgroundColor: 'rgba(0,0,0,0.6)',
		zIndex: 999,
		opacity: 0,
		pointerEvents: 'none',
		transition: '.1s linear opacity',

		// Need to undo the atom-reader styles
		fontFamily: 'Open Sans',
		fontSize: 'calc(1em / 1.2)',
		lineHeight: 'initial',
		color: '#000',
	},
	containerActive: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	splash: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		zIndex: 1000,
	},
	modalContent: {
		position: 'fixed',
		zIndex: 10001,
		// width: 'calc(80vw - 2em)',
		// maxHeight: 'calc(92vh - 4em)',
		maxHeight: '92vh',
		top: '4vh',
		left: '5vw',
		right: '5vw',
		backgroundColor: 'white',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxShadow: '0px 0px 3px rgba(0,0,0,0.7)',
		transform: 'scale(0.8)',
		transition: '.1s ease-in-out transform',
		borderRadius: '2px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			// width: 'calc(98vw - 2em)',
			height: 'calc(98vh - 2em)',
			top: '1vh',
			left: '1vw',
			right: '1vw',
			padding: '1em',
		},
	},
	modalContentActive: {
		transform: 'scale(1.0)',
	},
	mediaSelect: {
		padding: '1em 0em',
	},
	mediaSelectHeader: {
		maxWidth: '1024px',
		padding: '0em 2em 1em 2em',
		margin: '0 auto',
	},
	mediaDetails: {
		padding: '1em 2em',
	},
	filterInput: {
		width: 'calc(100% - 20px - 4px)',
		borderWidth: '0px 0px 2px 0px',
	},
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	textarea: {
		height: '4em',
	},
	item: {
		margin: '1em 0em',
		backgroundColor: '#F3F3F4',
		cursor: 'pointer',
		// display: 'inline-block',
		width: '100%',
		height: '50px',
		overflow: 'hidden',
		display: 'table',
	},
	itemPreview: {
		width: '1%',
		height: '50px',
		marginRight: '1em',
		display: 'table-cell',
		verticalAlign: 'middle',
	},
	itemPreviewImage: {
		maxWidth: '50px',
		maxHeight: '50px',
	},
	itemDetail: {
		display: 'table-cell',
		verticalAlign: 'middle',
		padding: '1em',
	},
	details: {
		display: 'table',
		width: '100%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	detailsPreview: {
		display: 'table-cell',
		verticalAlign: 'middle',
		position: 'relative',
		textAlign: 'center',
		padding: '1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '1em 0em',
		},
	},
	detailsForm: {
		display: 'table-cell',
		width: '50%',
		padding: '2em 1em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
			padding: '2em 0em',
		},
	},
	detailsTitle: {
		left: 0,
		display: 'table-cell',
	},
	detailsClear: {
		display: 'inline-block',
		cursor: 'pointer',
	},
	detailsCancel: {
		cursor: 'pointer',
		display: 'table-cell',
		width: '1%',
		padding: '0em 1em',
	},
	detailsButtonWrapper: {
		display: 'table-cell',
		width: '1%',
	},
	detailsButton: {
		padding: '0em 1em',
		whiteSpace: 'nowrap',
	},
	radioInput: {
		margin: '0em 0em 1em 0em',
	},
	radioLabel: {
		display: 'inline-block',
		fontSize: '0.95em',
		margin: '0em 2em 1em 0em',
	},
	disabledInput: {
		opacity: 0.5,
		pointerEvents: 'none',
	},



};
