import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {ensureImmutable} from 'reducers';
import {AtomViewerPane} from 'containers/AtomReader/AtomViewerPane';
import fuzzy from 'fuzzy';

// import {globalStyles} from 'utils/styleConstants';
// import {globalMessages} from 'utils/globalMessages';
// import {FormattedMessage} from 'react-intl';
// import Dropzone from 'react-dropzone';
// import {s3Upload} from 'utils/uploadFile';
import {getMedia} from './actions';

let styles;

export const Media = React.createClass({
	propTypes: {
		mediaData: PropTypes.object,
		dispatch: PropTypes.func,
	},

	getInitialState() {
		return {
			showMedia: false,
			closeCallback: undefined,
			filter: '',
			nodeData: {},
		};
	},

	componentDidMount() {
		this.props.dispatch(getMedia());
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

	toggleMedia: function(pm, callback, node) {
		this.setState({
			showMedia: true,
			closeCallback: callback,
			nodeData: typeof node.attrs.source === 'string' ? node.attrs : undefined,
		});
	},

	clearNodeData: function() {
		this.setState({nodeData: {...this.state.nodeData, data: undefined}});
	},

	filterChange: function(evt) {
		this.setState({filter: evt.target.value});
	},

	inputChange: function(type, evt) {
		if (type === 'caption') {
			this.setState({nodeData: {...this.state.nodeData, caption: evt.target.value}});
		} 

		if (type === 'size') {
			this.setState({nodeData: {...this.state.nodeData, size: evt.target.value}});
		} 

		if (type === 'align') {
			this.setState({nodeData: {...this.state.nodeData, align: evt.target.value}});
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
		}); 
	},

	// save: function() {
	// 	const versionData = {
	// 		_id: '578951a86dcc445787b0ef5a',
	// 		type: 'image',
	// 		message: '',
	// 		parent: {
	// 			_id: '578951a86dcc445787b0ef57',
	// 			slug: '95e48c3441a46bf95481b60dbaeaba469b2d4d74',
	// 			title: 'New Pub: 1468617128060',
	// 			type: 'image',
	// 		},
	// 		content: {
	// 			url: 'https://assets.pubpub.org/uiyvascj/1468617127681.gif',
	// 		}
	// 	};
	// 	this.saveItem(versionData);
	// },

	setItem: function(item) {
		const nodeData = this.state.nodeData || {};
		this.setState({
			nodeData: {
				source: item._id, 
				className: nodeData.className || '',
				id: item._id,
				align: nodeData.align || 'left',
				size: nodeData.size || '',
				caption: nodeData.caption || '',
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
			data: nodeData.data,
		});
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
		});

	},

	render: function() {

		const mediaItems = safeGetInToJS(this.props.mediaData, ['mediaItems']) || [];
		const filteredItems = fuzzy.filter(this.state.filter, mediaItems, {extract: (item)=>{ return item.type + ' ' + item.parent.title;} });
		const nodeData = this.state.nodeData || {};
	
		return (

			<div style={[styles.container, this.state.showMedia && styles.containerActive]}>
				<div style={styles.splash} onClick={this.close}></div>
				<div style={[styles.modalContent, this.state.showMedia && styles.modalContentActive]}>
					
					{/* If we DON'T have a chosen atom */}
					{!nodeData.data &&
						<div>
							<input type="text" placeholder={'Filter'} value={this.state.filter} onChange={this.filterChange} style={styles.filterInput}/>

							{filteredItems.map((item)=> {
								return item.original;
							}).sort((foo, bar)=>{
								// Sort so that most recent is first in array
								if (foo.lastUpdated > bar.lastUpdated) { return -1; }
								if (foo.lastUpdated < bar.lastUpdated) { return 1; }
								return 0;
							}).map((item, index)=> {
								return (
									<div key={'media-item-' + index} onClick={this.setItem.bind(this, item)} style={styles.item}>
										<div style={styles.itemPreview}>
											{item.type === 'image' &&
												<img src={'https://jake.pubpub.org/unsafe/fit-in/100x50/' + item.content.url} alt={item.parent.title} title={item.parent.title}/>
											}

											{item.type === 'video' &&
												<span>Video!</span>
											}
											
											{item.type === 'document' &&
												<div>{item.parent.title}</div>
											}
										</div>

										<div style={styles.itemDetail}>
											<div style={styles.itemDetailTitle}>{item.parent.title}</div>
										</div>
									</div>
								);
							})}

						</div>
					}

					{/* If we DO have a chosen atom */}
					{nodeData.data &&
						<div style={styles.details}>

							<div style={styles.detailsPreview}>
								<div style={styles.detailsClear} className={'underlineOnHover'} onClick={this.clearNodeData}>Clear</div>
								<h3 style={styles.detailsTitle}>{nodeData.data.parent.title}</h3>
								<AtomViewerPane atomData={ensureImmutable({ atomData: nodeData.data.parent, currentVersionData: nodeData.data })} renderType={'embed'}/>	
								
							</div>

							
							<form onSubmit={this.saveItem} style={styles.detailsForm}>
								<div>
									<label style={styles.label} htmlFor={'caption'}>
										Caption
									</label>
									<textarea ref={'caption'} id={'caption'} name={'caption'} style={[styles.input, styles.textarea]} value={this.state.nodeData.caption} onChange={this.inputChange.bind(this, 'caption')}></textarea>
								</div>

								<div>
									<label style={styles.label} htmlFor={'size'}>
										Size
									</label>
									<input ref={'size'} id={'size'} name={'size'} type="text" style={styles.input} value={this.state.nodeData.size} onChange={this.inputChange.bind(this, 'size')}/>
									<div className={'light-color inputSubtext'}>
										e.g. 20%, 50%, 200px, 400px
									</div>
								</div>

								<div>
									<label style={styles.label} htmlFor={'className'}>
										Class Name
									</label>
									<input ref={'className'} id={'className'} name={'className'} type="text" style={styles.input} value={this.state.nodeData.className} onChange={this.inputChange.bind(this, 'className')}/>
								</div>

								<div>
									<label style={styles.label} htmlFor={'align'}>
										Align
									</label>
									<input ref={'align'} id={'align'} name={'align'} type="text" style={styles.input} value={this.state.nodeData.align} onChange={this.inputChange.bind(this, 'align')}/>
								</div>

								<button className={'button'} onClick={this.saveItem}>
									Save
								</button>

							</form>	
													
							
						</div>
					}
					
				</div>
			</div>

		);
	}

});

export default connect( state => {
	return {
		mediaData: state.media,
	};
})( Radium(Media) );

styles = {
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
		padding: '2em',
		width: 'calc(80vw - 4em)',
		maxHeight: 'calc(70vh - 4em)',
		top: '15vh',
		left: '10vw',
		backgroundColor: 'white',
		overflow: 'hidden',
		overflowY: 'scroll',
		boxShadow: '0px 0px 3px rgba(0,0,0,0.7)',
		transform: 'scale(0.8)',
		transition: '.1s ease-in-out transform',
		borderRadius: '2px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(98vw - 2em)',
			height: 'calc(98vh - 2em)',
			top: '1vh',
			left: '1vw',
			padding: '1em',
		},
	},
	modalContentActive: {
		transform: 'scale(1.0)',
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
		width: '100px',
		height: '50px',
		marginRight: '1em',
		display: 'table-cell',
		verticalAlign: 'middle',
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
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
		},
	},
	detailsForm: {
		display: 'table-cell',
		width: '50%',
		padding: '2em 0em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
		},
	},
	detailsTitle: {
		position: 'absolute',
		left: 0,
		top: '2em',
		margin: 0,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'relative',
			top: 0,
		},
	},
	detailsClear: {
		position: 'absolute',
		left: 0,
		bottom: '2em',
		cursor: 'pointer',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			position: 'relative',
			bottom: 0,
		},
	},
};
