import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';

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
			nodeData: undefined,
		};
	},

	componentDidMount() {
		this.props.dispatch(getMedia());
		window.toggleMedia = this.toggleMedia;
	},

	toggleMedia: function(pm, callback, node) {
		console.log(pm, callback, node);
		this.setState({
			showMedia: true,
			closeCallback: callback,
			nodeData: typeof node.attrs.source === 'string' ? node.attrs.data : undefined,
		});
	},

	clearNodeData: function() {
		this.setState({nodeData: undefined});
	},

	filterChange: function(evt) {
		this.setState({filter: evt.target.value});
	},

	close: function() {
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
		}); 
	},

	save: function() {
		const versionData = {
			_id: '578951a86dcc445787b0ef5a',
			type: 'image',
			message: '',
			parent: {
				_id: '578951a86dcc445787b0ef57',
				slug: '95e48c3441a46bf95481b60dbaeaba469b2d4d74',
				title: 'New Pub: 1468617128060',
				type: 'image',
			},
			content: {
				url: 'https://assets.pubpub.org/uiyvascj/1468617127681.gif',
			}
		};
		this.saveItem(versionData);
	},

	setItem: function(item) {
		this.setState({
			nodeData: item,
		});
	},

	saveItem: function() {
		const item = this.state.nodeData;
		this.state.closeCallback({
			source: item._id, 
			className: 'embed',
			id: item._id,
			align: 'full',
			size: '100%',
			caption: 'Caption here',
			data: item,
		});
		this.setState({
			showMedia: false,
			closeCallback: undefined,
			filter: '',
		});

	},

	render: function() {

		const mediaItems = safeGetInToJS(this.props.mediaData, ['mediaItems']) || [];
		const nodeData = this.state.nodeData;
		return (

			<div style={[styles.container, this.state.showMedia && styles.containerActive]}>
				<div style={styles.splash} onClick={this.close}></div>
				<div style={[styles.modalContent, this.state.showMedia && styles.modalContentActive]}>
					
					{/* If we DON'T have a chosen atom */}
					{!nodeData &&
						<div>
							<input type="text" placeholder={'Filter'} value={this.state.filter} onChange={this.filterChange} style={styles.filterInput}/>

							{mediaItems.filter((item)=> {
								return item.parent.title.indexOf(this.state.filter) > -1 || item.type.indexOf(this.state.filter) > -1;
							}).sort((foo, bar)=>{
								// Sort so that most recent is first in array
								if (foo.lastUpdated > bar.lastUpdated) { return -1; }
								if (foo.lastUpdated < bar.lastUpdated) { return 1;}
								return 0;
							}).map((item, index)=> {
								console.log(item);
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
					{nodeData &&
						<div>
							<div onClick={this.clearNodeData}>Clear</div>
							<div style={styles.itemDetailTitle}>{nodeData.parent.title}</div>
							<div style={styles.itemPreview}>
								{nodeData.type === 'image' &&
									<img src={'https://jake.pubpub.org/unsafe/fit-in/400x400/' + nodeData.content.url} alt={nodeData.parent.title} title={nodeData.parent.title}/>
								}

								{nodeData.type === 'video' &&
									<span>Video!</span>
								}
								
								{nodeData.type === 'document' &&
									<div>{nodeData.parent.title}</div>
								}
							</div>
							<div className={'button'} onClick={this.saveItem}>Save</div>
							
							
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
		padding: '1em',
		width: 'calc(80vw - 2em)',
		maxHeight: 'calc(70vh - 2em)',
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
		},
	},
	modalContentActive: {
		transform: 'scale(1.0)',
	},
	filterInput: {
		width: 'calc(100% - 20px - 4px)',
		borderWidth: '0px 0px 2px 0px',
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
	}
};
