import React, {PropTypes} from 'react';
import Radium from 'radium';
import { ImageCropper } from 'components';
import { s3Upload } from 'utils/uploadFile';
import { Spinner, Tooltip, Position } from '@blueprintjs/core';

let styles = {};

export const ImageUpload = React.createClass({
	propTypes: {
		defaultImage: PropTypes.string,
		userCrop: PropTypes.bool,
		width: PropTypes.number,
		label: PropTypes.node,
		key: PropTypes.string,
		tooltip: PropTypes.node,
		containerStyle: PropTypes.object,
		onNewImage: PropTypes.func,
		canClear: PropTypes.bool,
	},

	getInitialState() {
		return {
			defaultImage: undefined,
			uploading: false, // When uploading to server
			imageFile: null,
			imageURL: undefined,
			loadingImage: false, // When loading into DOM
		};
	},

	componentWillMount() {
		this.setState({ defaultImage: this.props.defaultImage });
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.defaultImage !== this.props.defaultImage) {
			this.setState({ defaultImage: nextProps.defaultImage });
		}
	},

	handleImageSelect: function(evt) {
		if (evt.target.files.length && this.props.userCrop) {
			this.setState({ imageFile: evt.target.files[0] });	
		}

		if (evt.target.files.length && !this.props.userCrop) {
			s3Upload(evt.target.files[0], ()=>{}, this.onUploadFinish, 0);
			this.setState({ 
				uploading: true,
				loadingImage: true, 
			});
		}

	},

	onUploadFinish: function(evt, index, type, filename) {
		this.setState({ 
			imageURL: 'https://assets.pubpub.org/' + filename,
			uploading: false, 
			loadingImage: true,
		});
	},

	cancelImageUpload: function() {
		this.setState({ 
			imageFile: null,
			uploading: false, 
		});
	},

	imageUploaded: function(url) {
		this.setState({ 
			imageFile: null, 
			imageURL: url,
			uploading: false,
			loadingImage: true,
		});
	},

	onImageRender: function() {
		this.setState({
			loadingImage: false,
		});
		if (this.state.imageURL) {
			this.props.onNewImage(this.state.imageURL);	
		}
		
	},

	clearImage: function() {
		this.setState({
			imageFile: null, 
			imageURL: null,
			uploading: false,
			loadingImage: false,
		});
		this.props.onNewImage(null);	
	},

	onImageError: function() {
		console.log('Image error. Please retry');
		this.setState({
			uploading: false,
			imageFile: null,
			imageURL: undefined,
			loadingImage: false, 
		});
	},

	render: function() {
		const width = (this.props.width || 75);
		// const imageDimensions = { width: width, maxHeight: width };
		const imageDimensions = { maxWidth: '30vw', height: width };
		const emptyDimensions = { width: width, height: width };
		const containerStyle = this.props.containerStyle || {};
		return (
				
			<div style={[styles.container, containerStyle]}>
				<Tooltip content={<span style={styles.tooltipText}>{this.props.tooltip}</span>} position={Position.TOP_LEFT}>
					<label htmlFor={this.props.key}>
						<div style={styles.label}>
							{this.props.label}
						</div>
						
						
						<div style={{position: 'relative'}}>
							<img style={imageDimensions} src={(this.state.imageURL || this.props.defaultImage)} onLoad={this.onImageRender} onError={this.onImageError}/>		
							{!(this.state.imageURL || this.props.defaultImage) &&
								<div style={[styles.emptyState, emptyDimensions]}>
									<span className="pt-icon-standard pt-icon-large pt-icon-add" style={{ lineHeight: emptyDimensions.height + 'px' }} />
								</div>
							}

							{(this.state.imageURL || this.props.defaultImage) &&
								<a role="button" className={'pt-button pt-icon-edit'} style={styles.editButton} />							
							}
							{this.state.loadingImage &&
								<div style={styles.loader}>
									<Spinner className={'pt-small'} />	
								</div>
							}
							
						</div>
						
						{!this.state.loadingImage &&
							<input id={this.props.key} name={'logo image'} type="file" accept="image/*" onChange={this.handleImageSelect} style={styles.fileInput}/>
						}
		
					</label>
				</Tooltip>
				<div style={[styles.imageCropperWrapper, this.state.imageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.imageFile} onCancel={this.cancelImageUpload} onUpload={this.imageUploaded}/>
					</div>
				</div>
				{this.props.canClear && (this.state.imageURL || this.props.defaultImage) &&
					<a role="button" className={'pt-button pt-minimal pt-icon-trash pt-intent-danger'} style={[styles.editButton, styles.clearButton]} onClick={this.clearImage}/>
				}
			</div>
		);
	}
});

export default Radium(ImageUpload);

styles = {
	container: {
		position: 'relative',
		display: 'inline-block',
	},
	label: {
		paddingBottom: '0.5em',
	},
	editButton: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		paddingTop: '6px',
		boxShadow: '0 1px 2px rgba(16, 22, 26, 0.3)'
	},
	clearButton: {
		left: '30px',
		boxShadow: '0px 0px 0px transparent',
	},
	emptyState: {
		backgroundColor: '#EEE',
		textAlign: 'center',
		position: 'absolute',
		top: 0,
		cursor: 'pointer',
	},
	loader: {
		position: 'absolute',
		bottom: 3,
		left: 3,
		backgroundColor: 'white',
	},	
	tooltipText: {
		maxWidth: '275px',
		display: 'inline-block',
	},
	imageCropperWrapper: {
		height: '100vh',
		width: '100vw',
		zIndex: 10,
		backgroundColor: 'rgba(255,255,255,0.75)',
		position: 'fixed',
		top: 0,
		left: 0,
		opacity: 0,
		pointerEvents: 'none',
		transition: '.1s linear opacity',
		display: 'flex',
		justifyContent: 'center',
	},
	imageCropperWrapperVisible: {
		opacity: 1,
		pointerEvents: 'auto',
	},
	imageCropper: {
		height: '270px',
		width: '450px',
		alignSelf: 'center',
		backgroundColor: 'white',
		boxShadow: '0px 0px 10px #808284',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			height: 'auto',
			left: 0,
		},
	},
	fileInput: { 
		position: 'fixed', 
		top: '-100px' ,
	},
};
