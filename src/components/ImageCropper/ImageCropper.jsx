import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import {LoaderIndeterminate} from '../';
import AvatarEditor from './AvatarEditor';
import {s3Upload} from '../../utils/uploadFile';

let styles = {};

const HeaderNav = React.createClass({
	propTypes: {
		width: PropTypes.number,
		height: PropTypes.number,
		image: PropTypes.object,
		onCancel: PropTypes.func,
		onUpload: PropTypes.func,
	},

	getInitialState: function() {
		return {
			scale: 1,
			preview: null,
			isUploading: false,
		};
	},
	onFileFinish: function(evt, index, type, filename) {
		// console.log('https://s3.amazonaws.com/pubpub-upload/' + filename);
		// console.log('finish');
		this.setState({isUploading: false});
		this.props.onUpload('https://s3.amazonaws.com/pubpub-upload/' + filename);
	},
	handleUpdate: function() {
		const img = this.refs.userImageCrop.getImage('image/jpeg');
		this.setState({preview: img});
	},
	handleSaveImage: function() {
		const binary = atob(this.state.preview.split(',')[1]);
		const mimeString = this.state.preview.split(',')[0].split(':')[1].split(';')[0];
		const array = [];
		for (let iii = 0; iii < binary.length; iii++) { array.push(binary.charCodeAt(iii));}
		const file = new Blob([new Uint8Array(array)], {type: mimeString});

		s3Upload(file, 'users', ()=>{}, this.onFileFinish, 0);	
		this.setState({isUploading: false});
	},
	handleScale: function() {
		const scale = this.refs.scale.value;
		const img = this.refs.userImageCrop.getImage('image/jpeg');
		this.setState({scale: scale, preview: img});
	},

	handleCancel: function() {
		this.props.onCancel();
	},
	
	render: function() {

		return (
			<div style={styles.container}>
				<div style={styles.loaderWrapper}>
					{(this.state.isUploading ? <LoaderIndeterminate color="#555"/> : null)}
				</div>
				<div style={styles.avatarWrapper}>
					<AvatarEditor
						ref="userImageCrop"
						image={this.props.image}
						width={this.props.width}
						height={this.props.height}
						border={25}
						color={[0, 0, 0, 0.7]} // RGBA
						scale={parseFloat(this.state.scale)}
						onImageReady={this.handleUpdate} 
						onImageChange={this.handleUpdate}/>
				</div>
				<div style={styles.previewAndOptions}>
					<img style={styles.preview}src={this.state.preview} />
					<div style={styles.option} key="userUploadCancel" onClick={this.handleCancel}>Cancel</div>
					<div style={styles.option} key="userUploadSave" onClick={this.handleSaveImage}>Save</div>
				</div>
				<input style={styles.slider} name="scale" type="range" ref="scale" onChange={this.handleScale} min="1" max="3" step="0.01" defaultValue="1" />

			</div>
		);
	}
});

export default Radium(HeaderNav);

styles = {
	container: {
		width: '100%',
		height: '100%',
		position: 'relative',
		overflow: 'hidden',
	},
	loaderWrapper: {
		position: 'absolute',
		width: '100%',
		top: 10,
	},
	avatarWrapper: {
		height: 200,
		width: 200,
		margin: '25px 25px 10px 25px',
		float: 'left',
		// backgroundColor: 'blue',
	},
	previewAndOptions: {
		width: 'calc(100% - 275px)',
		height: 200,
		margin: '25px 25px 10px 0px',
		float: 'left',
		// backgroundColor: 'red',
	},
	preview: {
		width: 75,
		float: 'right',
		marginBottom: 45,
	},
	option: {
		clear: 'both',
		textAlign: 'right',
		fontSize: '25px',
		color: '#555',
		margin: '20px 0px',
		':hover': {
			cursor: 'pointer',
			color: '#222',
		},
	},
	slider: {
		marginLeft: '25px',
		width: 200,
		clear: 'both',
	}
};
