import React, {PropTypes} from 'react';
import Radium from 'radium';
import {safeGetInToJS} from 'utils/safeParse';
import {Loader, ImageCropper} from 'components';
import {globalStyles} from 'utils/styleConstants';

let styles = {};

export const AtomEditorDetails = React.createClass({
	propTypes: {
		atomEditData: PropTypes.object,
		updateDetailsHandler: PropTypes.func,
		isLoading: PropTypes.bool,
		error: PropTypes.object,
	},

	getInitialState() {
		return {
			imageFile: null,
			title: '',
			slug: '',
			description: '',
			previewImage: '',
		};
	},

	componentWillMount() {
		const atomData = safeGetInToJS(this.props.atomEditData, ['atomData']) || {};
		this.setState({
			title: atomData.title || '',
			slug: atomData.slug || '',
			description: atomData.description || '',
			previewImage: atomData.previewImage || '',
		});
	},

	updateDetails: function(evt) {
		evt.preventDefault();
		const newDetails = {
			title: this.state.title,
			slug: this.state.slug,
			description: this.state.description,
			previewImage: this.state.previewImage,
		};
		this.props.updateDetailsHandler(newDetails);
	},

	inputChange: function(type, evt) {
		if (type === 'title') {
			this.setState({title: evt.target.value});
		} 

		if (type === 'slug') {
			this.setState({slug: evt.target.value.replace(/[^\w\s-]/gi, '').replace(/ /g, '-').toLowerCase()});
		} 

		if (type === 'description') {
			this.setState({description: evt.target.value});
		} 
		
	},

	handleFileSelect: function(evt) {
		if (evt.target.files.length) {
			this.setState({imageFile: evt.target.files[0]});
		}
	},

	cancelImageUpload: function() {
		this.setState({imageFile: null});
	},

	imageUploaded: function(url) {
		this.setState({imageFile: null, previewImage: url});
	},

	render: function() {
		const atomData = safeGetInToJS(this.props.atomEditData, ['atomData']) || {};
		const errorMessage = this.props.error && this.props.error.name === 'MongoError' ? 'URL already used' : null;
		return (
			<div>
				<form onSubmit={this.updateDetails}>
					<div>
						<label htmlFor={'title'}>
							Title
						</label>
						<input ref={'title'} id={'title'} name={'title'} type="text" style={styles.input} value={this.state.title} onChange={this.inputChange.bind(this, 'title')}/>
					</div>

					<div>
						<label htmlFor={'url'}>
							URL
						</label>
						<div style={[styles.prefixedInputWrapper, atomData.isPublished && styles.disabledInput]}>
							<div style={styles.prefix}>pubpub.org/pub/</div>
							<input ref={'url'} id={'url'} name={'url'} type="text" style={[styles.input, styles.prefixedInput]} disabled={atomData.isPublished} value={this.state.slug} onChange={this.inputChange.bind(this, 'slug')}/>	
						</div>
						<div className={'light-color inputSubtext'}>
							Cannot be changed once published.
						</div>
					</div>

					<div>
						<label htmlFor={'image'}>
							Preview Image
						</label>
						<img style={styles.image} src={this.state.previewImage} />
						<input id={'image'} name={'preview image'} type="file" accept="image/*" onChange={this.handleFileSelect} />
					</div>


					<div>
						<label htmlFor={'description'}>
							Description
						</label>
						<textarea ref={'description'} id={'description'} name={'description'} type="text" style={[styles.input, styles.textarea]} value={this.state.description} onChange={this.inputChange.bind(this, 'description')}></textarea>
						<div className={'light-color inputSubtext'}>
							{this.state.description.length} / 140
						</div>
					</div>

					<button className={'button'} onClick={this.updateDetails}>
						Save Details
					</button>

					<div style={styles.loaderContainer}><Loader loading={this.props.isLoading} showCompletion={!this.props.error}/></div>
					<div style={styles.errorMessage}>{errorMessage}</div>


				</form>

				<div style={[styles.imageCropperWrapper, this.state.imageFile !== null && styles.imageCropperWrapperVisible]} >
					<div style={styles.imageCropper}>
						<ImageCropper height={500} width={500} image={this.state.imageFile} onCancel={this.cancelImageUpload} onUpload={this.imageUploaded}/>
					</div>
				</div>
				
			</div>
		);
	}
});

export default Radium(AtomEditorDetails);

styles = {
	input: {
		width: 'calc(100% - 20px - 4px)',
	},
	disabledInput: {
		opacity: 0.5,
		pointerEvents: 'none',
	},
	textarea: {
		height: '4em',
	},
	image: {
		width: '100px',
	},
	prefixedInputWrapper: {
		display: 'table',
		width: '100%',
		marginBottom: '1.2em',
	},
	prefix: {
		display: 'table-cell',
		backgroundColor: '#F3F3F4',
		verticalAlign: 'middle',
		textAlign: 'center',
		padding: '4px 10px',
		borderWidth: '2px 0px 2px 2px',
		borderStyle: 'solid',
		borderColor: '#BBBDC0',
		borderRadius: '1px 0px 0px 1px',
		width: '1%',
		fontSize: '0.9em',
		whiteSpace: 'nowrap',
	},
	prefixedInput: {
		display: 'table-cell',
		marginBottom: 0,
		borderRadius: '0px 1px 1px 0px',
	},
	loaderContainer: {
		display: 'inline-block',
		position: 'relative',
		top: 15,
	},
	errorMessage: {
		padding: '10px 0px',
		color: globalStyles.errorRed,
	},
	imageCropperWrapper: {
		height: '100%',
		width: '100%',
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
};
