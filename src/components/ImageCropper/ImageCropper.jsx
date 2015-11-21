import React, {PropTypes} from 'react';
import Radium from 'radium';
// import {globalStyles} from '../../utils/styleConstants';
import AvatarEditor from './AvatarEditor';

let styles = {};

const HeaderNav = React.createClass({
	propTypes: {
		width: PropTypes.number,
		height: PropTypes.number,
		image: PropTypes.object,
		onCancel: PropTypes.func,
	},

	getInitialState: function() {
		return {
			scale: 1,
			preview: null
		};
	},

	handleUpdate: function() {
		const img = this.refs.userImageCrop.getImage('image/jpeg');
		this.setState({preview: img});
	},

	handleScale: function() {
		const scale = this.refs.scale.value;
		const img = this.refs.userImageCrop.getImage('image/jpeg');
		this.setState({scale: scale, preview: img});
	},

	handleCancel: function() {
		this.props.onCancel();
	},
	handleSaveImage: function() {
		console.log('Saving!');
	},
	
	render: function() {

		return (
			<div styles={styles.container}>

				<AvatarEditor
					ref="userImageCrop"
					image={this.props.image}
					width={this.props.width}
					height={this.props.height}
					border={50}
					color={[0, 0, 0, 0.9]} // RGBA
					scale={parseFloat(this.state.scale)}
					onImageReady={this.handleUpdate} 
					onImageChange={this.handleUpdate}/>

				
				<input name="scale" type="range" ref="scale" onChange={this.handleScale} min="1" max="2" step="0.01" defaultValue="1" />
				<img src={this.state.preview} />
				<div onClick={this.handleCancel}>Cancel</div>
				<div onClick={this.handleSaveImage}>Save</div>
				

			</div>
		);
	}
});

export default Radium(HeaderNav);

styles = {
	container: {

	},
};
