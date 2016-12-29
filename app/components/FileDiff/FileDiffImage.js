import React, { PropTypes } from 'react';
import Radium from 'radium';
import ImageDiff from 'react-image-diff';
import { Slider } from '@blueprintjs/core';
// import ImageDiff from 'image-diff-view';

let styles = {};

export const FileDiffImage = React.createClass({
	propTypes: {
		baseFile: PropTypes.object,
		targetFile: PropTypes.object,
	},

	getInitialState() {
		return {
			sliderVal: .5,
			width: null,
			height: null,
			imagDiff: {},
		};
	},

	componentDidMount() {
		const targetFile = this.props.targetFile || {};
		// const baseURL = targetFile.url || 'http://cezary.github.io/react-image-diff/public/img/spot-the-difference-a.jpg' || baseFile.url;
		// const targetURL = 'https://ae01.alicdn.com/kf/HTB14qzTOXXXXXbeaFXXq6xXFXXXM/NEW-Candy-Stripe-Color-Warm-Winter-Spring-Cat-Sweater-Pet-Jumper-Cat-Clothes-For-Small-Cat.jpg_50x50.jpg' || targetFile.url;

		// const img = new Image();
		// img.onload = function(){
		// 	const imageWidth = this.width;
		// 	const imageHeight = this.height;
		// 	const container = document.getElementsByClassName('image-diff-container' + targetFile.id)[0]
		// 	const containerWidth = container.offsetWidth;

		//     // this.setState({ width: 600, height: 400 });
		//     if (containerWidth < imageWidth) {
		// 		const newWidth = imageWidth * (imageWidth / containerWidth);
		// 		const newHeight = imageHeight * (imageWidth / containerWidth);
		// 		this.setState({
		// 			width: newWidth,
		// 			height: newHeight,
		// 		});		
		// 	}
		// };
		// img.src = targetURL;
		window.addEventListener('resize', this.updateDimensions);
	},
	componentWillUnmount: function() {
        window.removeEventListener('resize', this.updateDimensions);
    },
	// componentDidMount() {
		// const baseFile = this.props.baseFile || {};
		// const targetFile = this.props.targetFile || {};
		// const baseURL = baseFile.url;
		// const targetURL = targetFile.url;
		// const imageDiff = new ImageDiff(document.getElementById('image-diff'), baseURL, targetURL, 'swipe');
		// imageDiff.swipe(.5);

		// this.setState({ width: 600, height: 400 });

	// },

	sliderChange: function(value) {
		this.setState({ sliderVal: value})
		// this.state.imageDiff.swipe(value / 100);
	},

	renderSliderLabel: function(value) {
		return Math.round(value * 100) + '%';
	},
	// resizeImage: function(evt) {
	// 	console.log(evt);
	// 	const targetFile = this.props.targetFile || {};
	// 	const image = document.getElementsByClassName('ImageDiff__after')[0]
	// 	const container = document.getElementsByClassName('image-diff-container' + targetFile.id)[0]
	// 	if (!image) {return;}
	// 	const imageWidth = image.offsetWidth;
	// 	const imageHeight = image.offsetHeight;
	// 	const containerWidth = container.offsetWidth;
	// 	debugger;
	// 	if (containerWidth < imageWidth) {
	// 		const newWidth = imageWidth * (imageWidth / containerWidth);
	// 		const newHeight = imageHeight * (imageWidth / containerWidth);
	// 		if (this.state.width !== newWidth) {
	// 			setTimeout(()=> {
	// 				this.setState({
	// 					width: newWidth,
	// 					height: newHeight,
	// 				});		
	// 			}, 0)
				
	// 		}	
	// 	}
	// },

	imageLoad: function() {
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};
		const targetImage = document.getElementById('image-holder-' + targetFile.id);
		const baseImage = document.getElementById('image-holder-' + baseFile.id);
		if (!targetImage || !baseImage) { return null; }
		return this.updateDimensions();
	},

	updateDimensions: function() {
		console.log('Im here');
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};

		const baseImage = document.getElementById('image-holder-' + baseFile.id);
		const targetImage = document.getElementById('image-holder-' + targetFile.id);
		const container = document.getElementsByClassName('image-diff-container' + targetFile.id)[0]
		
		const width = Math.max(targetImage.offsetWidth, baseImage.offsetWidth);
		const height = Math.max(targetImage.offsetHeight, baseImage.offsetHeight);
		const factor = Math.max((width / container.offsetWidth), 1);

		return this.setState({
			width: width * factor,
			height: height * factor,
			targetWidth: targetImage.offsetWidth * factor,
			targetHeight: targetImage.offsetHeight * factor,
		});
	},

	// <div style={[
	// 						// { opacity: this.state.sliderVal},
	// 						// { backgroundRepeat: 'no-repeat', backgroundImage: targetURLSmall ? 'url("' + targetURLSmall + '")' : '' }
	// 					]}>
							
	// 					</div>
	render: function() {
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};
		// const baseURL = targetFile.url || 'http://cezary.github.io/react-image-diff/public/img/spot-the-difference-a.jpg' || baseFile.url;
		// const targetURL = 'https://ae01.alicdn.com/kf/HTB14qzTOXXXXXbeaFXXq6xXFXXXM/NEW-Candy-Stripe-Color-Warm-Winter-Spring-Cat-Sweater-Pet-Jumper-Cat-Clothes-For-Small-Cat.jpg_50x50.jpg' || targetFile.url;
		// this.resizeImage();
		const baseURL = 'http://i.imgur.com/qMBBroL.png';
		const targetURL = 'http://i.imgur.com/932xbyX.png';
		const baseURLSmall = 'http://i.imgur.com/KupLxPa.png';
		const targetURLSmall = 'http://cezary.github.io/react-image-diff/public/img/spot-the-difference-a.jpg' || 'http://i.imgur.com/4Ulz1rH.png';

		const mode = 'slide' // slide, fade, or diff
		return (
			<div style={styles.container} className={'image-diff-container' + targetFile.id}>
				
				{/*<ImageDiff before={baseURL} after={targetURL} type="swipe" value={this.state.sliderVal / 100} width={this.state.width} height={this.state.height}/>*/}

				<div style={{ maxWidth: '100%', position: 'relative' }}>
					<img src={targetURLSmall} id={'image-holder-' + targetFile.id} style={styles.imageFloat} onLoad={this.imageLoad}/>
					<img src={baseURL} id={'image-holder-' + baseFile.id} style={styles.imageFloat} onLoad={this.imageLoad}/>		
				</div>
				

				<div style={[styles.imagesWrapper, { width: this.state.width, height: this.state.height }]}>
					<div style={styles.tableCell}>
						<img src={baseURL} style={styles.image} />	
					</div>

					<div style={styles.tableCell}>
						<div style={[
							{ width: this.state.targetWidth, height: this.state.targetHeight, overflow: 'hidden' },
							mode === 'slide' ? { paddingLeft: (this.state.sliderVal * 100 + '%')} : {},
						]}>
							<div style={[
								styles.targetImage,
								{ backgroundImage: targetURLSmall ? 'url("' + targetURLSmall + '")' : '' },
							]}>
							</div>
						</div>
						
						{/*<img src={targetURLSmall} style={[styles.image]} />		*/}
					</div>
				
					

					{/*<div style={styles.flex}>
						<div style={[styles.floatingImageWrapper, { opacity: this.state.sliderVal}]}>
							<img src={targetURLSmall} style={styles.image} />
						</div>
					</div>*/}
				</div>

				<div style={{margin: '1em auto', maxWidth: '400px'}}>
					<Slider value={this.state.sliderVal} min={0} max={1} stepSize={.01} labelStepSize={.5} renderLabel={this.renderSliderLabel} onChange={this.sliderChange}/>
				</div>
				
			</div>
		);
	}
});

export default Radium(FileDiffImage);

styles = {
	container: {
		// textAlign: 'center',
	},
	imagesWrapper: {
		position: 'relative',
		// border: '1px solid blue',
		boxShadow: '0px 0px 0px 1px blue',
		margin: '0 auto',
		// height: '300px',
		// width: '100%',
		// display: 'table',
		// display: 'flex',
		// maxWidth: '100%',
		// display: 'inline-block',
		// textAlign: 'center',

	},
	cat: {
		position: 'absolute',
	},
	tableCell: {
		// display: 'table-cell',
		// verticalAlign: 'middle',
		// textAlign: 'center',
		display: 'flex',
	    justifyContent: 'center',
	    alignItems: 'center',
	    height: '100%',
	    width: '100%',
	    position: 'absolute',
	},
	image: {
		maxWidth: '100%',
		objectFit: 'scale-down',
		flex: '0 0 auto',
	},
	imageFloat: {
		maxWidth: '100%',
		position: 'absolute',
		opacity: '0.1',
	},
	targetImage: {
		width: '100%', 
		height: '100%', 
		overflow: 'hidden',
		backgroundPosition: 'right center', 
		backgroundRepeat: 'no-repeat', 
	},
	flex: {
		display: 'flex',
		width: '100%',
		height: '100%',
		justifyContent: 'center',
	},
	floatingImageWrapper: {
		position: 'absolute',
		left: 0,
		top: 0,
	},
	// tranparency: {
	// 	width: '100%',
	// 	height: '100%',
	// 	opacity: '0.5',
	// 	// backgroundColor: 'red',
	// 	right: 0,
	// 	top: 0,
	// 	position: 'absolute',
	// },
	// targetWrapper: {
	// 	width: '100%',
	// 	height: '100%',
	// 	overflow: 'hidden',
	// 	position: 'absolute',
	// 	top: 0,
	// 	right: 0,
	// 	backgroundPosition: 'right'
	// },
	// image2: {
		
	// },
	
};


// {/*<div className='image-diff' id='image-diff' style={{userSelect: 'none', width: '200px'}}>
// 					<div className='image-diff__inner'>
// 						<div className='image-diff__before'><img/></div>
// 						<div className='image-diff__wrapper'><div className='image-diff__after'><img/></div></div>
// 					</div>
// 				</div>*/}
// 				<div style={styles.imageWrapper}>
					
// 					<img src={baseURL} style={[styles.image]}/>	
// 					<div style={[styles.tranparency, { backgroundImage: targetURL ? 'url("' + targetURL + '")' : '' }]}>
// 					</div>
// 					{/*<span style={[
// 						styles.targetWrapper, 
// 						{ width: ((100-this.state.sliderVal) + '%')},
						
// 					]}>
							
// 					</span>*/}
					
// 				</div>