import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Slider } from '@blueprintjs/core';

let styles = {};

export const FileDiffImage = React.createClass({
	propTypes: {
		baseFile: PropTypes.object,
		targetFile: PropTypes.object,
	},

	getInitialState() {
		return {
			sliderVal: .5,
			mode: 'slide',
			containerStyle: {},
			targetStyle: {},
			baseStyle: {},
		};
	},

	componentDidMount() {
		window.addEventListener('resize', this.buildDimensions);
	},
	componentWillUnmount: function() {
        window.removeEventListener('resize', this.buildDimensions);
    },

	sliderChange: function(value) {
		this.setState({ sliderVal: value})
	},

	imageLoad: function() {
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};
		const targetImage = document.getElementById('image-holder-' + targetFile.id);
		const baseImage = document.getElementById('image-holder-' + baseFile.id);
		if (!targetImage || !baseImage) { return null; }

		const originalDimensions = {
			originalTargetWidth: targetImage.offsetWidth,
			originalTargetHeight: targetImage.offsetHeight,
			originalBaseWidth: baseImage.offsetWidth,
			originalBaseHeight: baseImage.offsetHeight,
		};

		this.setState(originalDimensions);

		return this.buildDimensions(originalDimensions);
	},

	buildDimensions: function(originalDimensions) {
		const input = originalDimensions || {};
		const originalTargetWidth = this.state.originalTargetWidth || input.originalTargetWidth;
		const originalTargetHeight = this.state.originalTargetHeight || input.originalTargetHeight;
		const originalBaseWidth = this.state.originalBaseWidth || input.originalBaseWidth;
		const originalBaseHeight = this.state.originalBaseHeight || input.originalBaseHeight;

		const targetFile = this.props.targetFile || {};
		const container = document.getElementsByClassName('image-diff-container' + targetFile.id)[0]
		const containerWidth = container.offsetWidth;

		const maxWidth = Math.max(originalTargetWidth, originalBaseWidth);
		const maxHeight = Math.max(originalTargetHeight, originalBaseHeight);
		const factor = Math.min((containerWidth / maxWidth), 1);

		const targetWidth = originalTargetWidth * factor;
		const targetHeight = originalTargetHeight * factor;
		const baseWidth = originalBaseWidth * factor;
		const baseHeight = originalBaseHeight * factor;

		const scaledMaxWidth = maxWidth * factor;
		const scaledMaxHeight = maxHeight * factor;

		const targetHorizontalMargin = (scaledMaxWidth - targetWidth) / 2;
		const targetVerticalMargin = (scaledMaxHeight - targetHeight) / 2;

		const baseHorizontalMargin = (scaledMaxWidth - baseWidth) / 2;
		const baseVerticalMargin = (scaledMaxHeight - baseHeight) / 2;

		const containerStyle = {
			width: scaledMaxWidth,
			height: scaledMaxHeight,
			margin: '0 auto',
		};

		const targetStyle = {
			width: targetWidth,
			height: targetHeight,
			margin: targetVerticalMargin + ' ' + targetHorizontalMargin,
		};

		const baseStyle = {
			width: baseWidth,
			height: baseHeight,
			margin: baseVerticalMargin + ' ' + baseHorizontalMargin,
		};

		this.setState({
			containerStyle: containerStyle,
			targetStyle: targetStyle,
			baseStyle: baseStyle,
		})
	},

	setMode: function(mode) {
		this.setState({ mode: mode });
	},

	render: function() {
		const baseFile = this.props.baseFile || {};
		const targetFile = this.props.targetFile || {};
		
		const baseURL = baseFile.url;
		const targetURL = targetFile.url;
		const hasBase = !!baseURL;
		const hasTarget = !!targetURL;
		const mode = this.state.mode; // slide, fade, or diff

		const containerStyle = this.state.containerStyle || {};
		const containerWidth = containerStyle.width || 0;
		const sliderLocation = containerWidth * this.state.sliderVal;
		const sliderWidth = {
			width: containerWidth - sliderLocation
		};
		const fadeValue = {
			opacity: this.state.sliderVal
		};
		const diffStyle = {
			mixBlendMode: 'difference',
		};

		return (
			<div style={styles.container} className={'image-diff-container' + targetFile.id}>
				<div className={'pt-button-group'} style={styles.controls}>
					<button type="button" className={mode === 'slide' ? 'pt-button pt-active' : 'pt-button'} onClick={this.setMode.bind(this, 'slide')}>Slide</button>
					<button type="button" className={mode === 'fade' ? 'pt-button pt-active' : 'pt-button'} onClick={this.setMode.bind(this, 'fade')}>Fade</button>
					<button type="button" className={mode === 'diff' ? 'pt-button pt-active' : 'pt-button'} onClick={this.setMode.bind(this, 'diff')}>Diff</button>
				</div>

				<div style={{ maxWidth: '100%', position: 'relative' }}>
					<img src={targetURL || baseURL} id={'image-holder-' + targetFile.id} style={styles.imageFloat} onLoad={this.imageLoad}/>
					<img src={baseURL || targetURL} id={'image-holder-' + baseFile.id} style={styles.imageFloat} onLoad={this.imageLoad}/>		
				</div>
				
				<div style={[{ position: 'relative' }, this.state.containerStyle]}>
					<div style={[styles.imageWrapper, this.state.baseStyle]}>
						<img src={baseURL || targetURL} style={[styles.image, !hasBase && { opacity: 0 }]}/>
						{!hasBase &&
							<div style={[styles.noImage, mode === 'diff' && styles.noImageBlack]}/>
						}

						<div style={styles.redShadow} />
					</div>
					<div style={[styles.slider, this.state.containerStyle, mode === 'slide' && sliderWidth, mode === 'fade' && fadeValue, mode === 'diff' && diffStyle]}>
						<div style={[styles.imageWrapper, this.state.targetStyle]}>
							<img src={targetURL || baseURL} style={[styles.image, !hasTarget && { opacity: 0 }]}/>
							{!hasTarget &&
								<div style={[styles.noImage, mode === 'diff' && styles.noImageWhite]}/>
							}
							<div style={styles.greenShadow} />
						</div>
					</div>

					{mode === 'slide' &&
						<div style={[styles.sliderBar, { left: sliderLocation }]}></div>
					}
					
				</div>
				
				{mode !== 'diff' &&
					<div style={{margin: '1em auto', width: containerWidth}}>
						<Slider value={this.state.sliderVal} min={0} max={1} stepSize={.01} labelStepSize={.5} renderLabel={false} onChange={this.sliderChange}/>
					</div>
				}
				
			</div>
		);
	}
});

export default Radium(FileDiffImage);

styles = {
	container: {
		
	},
	controls: {
		position: 'absolute',
		top: '12px',
		right: '20px',
	},

	imageWrapper: {
		position: 'absolute',
		right: '0',
	},
	slider: {
		position: 'absolute',
		right: '0',
		overflow: 'hidden',
	},
	redShadow: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		boxShadow: 'inset 0px 0px 0px 2px red',
	},
	greenShadow: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		boxShadow: 'inset 0px 0px 0px 2px green',
	},
	sliderBar: {
		width: '1px',
		backgroundColor: '#555',
		boxShadow: '0px 0px 2px #888',
		height: '100%',
		position: 'absolute',
		top: '0',
	},

	image: {
		width: '100%',
		userSelect: 'none',
	},
	noImage: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		backgroundImage: 'url(\'https://assets.pubpub.org/_site/grid.png\')'
	},
	noImageBlack: {
		backgroundImage: 'none',
		backgroundColor: '#000',
	},
	noImageWhite: {
		backgroundImage: 'none',
		backgroundColor: '#fff',
	},
	imageFloat: {
		maxWidth: '100%',
		position: 'absolute',
		opacity: '0',
	},
	
};
