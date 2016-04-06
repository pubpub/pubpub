// Originally taken from https://github.com/mosch/react-avatar-editor
// Modified to include onImageChange
const React = require('react');
const ReactDOM = require('react-dom');

const isTouchDevice =
	!!(typeof window !== 'undefined' &&
		typeof navigator !== 'undefined' &&
		('ontouchstart' in window || navigator.msMaxTouchPoints > 0)
	);
const draggableEvents = {
	mobile: {
		react: {
			down: 'onTouchStart',
			drag: 'onTouchMove',
			drop: 'onTouchEnd',
			move: 'onTouchMove',
			up: 'onTouchUp'
		},
		native: {
			down: 'touchstart',
			drag: 'touchmove',
			drop: 'touchend',
			move: 'touchmove',
			up: 'touchup'
		}
	},
	desktop: {
		react: {
			down: 'onMouseDown',
			drag: 'onDragOver',
			drop: 'onDrop',
			move: 'onMouseMove',
			up: 'onMouseUp'
		},
		native: {
			down: 'mousedown',
			drag: 'dragStart',
			drop: 'drop',
			move: 'mousemove',
			up: 'mouseup'
		}
	}
};
const deviceEvents = isTouchDevice ? draggableEvents.mobile : draggableEvents.desktop;

const ImageCropperEditor = React.createClass({
	propTypes: {
		scale: React.PropTypes.number,
		image: React.PropTypes.object,
		border: React.PropTypes.number,
		width: React.PropTypes.number,
		height: React.PropTypes.number,
		color: React.PropTypes.arrayOf(React.PropTypes.number),
		style: React.PropTypes.object,

		onDropFile: React.PropTypes.func,
		onLoadFailure: React.PropTypes.func,
		onLoadSuccess: React.PropTypes.func,
		onImageReady: React.PropTypes.func,
		onImageChange: React.PropTypes.func,
	},

	getDefaultProps() {
		return {
			scale: 1,
			border: 25,
			width: 200,
			height: 200,
			color: [0, 0, 0, 0.5],
			style: {},
			onDropFile() {},
			onLoadFailure() {},
			onLoadSuccess() {},
			onImageReady() {},
			onImageChange() {},
		};
	},

	getInitialState() {
		return {
			drag: false,
			my: null,
			mx: null,
			image: {
				xloc: 0,
				yloc: 0
			}
		};
	},

	getDimensions() {
		return {
			width: this.props.width,
			height: this.props.height,
			border: this.props.border,
			canvas: {
				width: this.props.width + (this.props.border * 2),
				height: this.props.height + (this.props.border * 2)
			}
		};
	},

	getImage(type, quality) {
		const dom = document.createElement('canvas');
		const context = dom.getContext('2d');
		const dimensions = this.getDimensions();
		const border = 0;

		dom.width = dimensions.width;
		dom.height = dimensions.height;

		context.globalCompositeOperation = 'destination-over';

		this.paintImage(context, this.state.image, border);

		return dom.toDataURL(type, quality);
	},

	isDataURL(str) {
		const regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;
		return !!str.match(regex);
	},

	loadImage(imageURL) {
		const imageObj = new Image();
		imageObj.onload = this.handleImageReady.bind(this, imageObj);
		imageObj.onerror = this.props.onLoadFailure;
		if (!this.isDataURL(imageURL)) imageObj.crossOrigin = 'anonymous';
		imageObj.src = imageURL;
	},
	loadImageLocal(imageFile) {
		if (!imageFile) { return; }

		const reader = new FileReader();
		const file = imageFile;
		reader.onload = (evt) => {this.loadImage(evt.target.result);};
		reader.readAsDataURL(file);
	},

	// handleDrop(e) {
	// 	e.stopPropagation();
	// 	e.preventDefault();

	// 	if (e.dataTransfer.files.length) {
	// 		this.props.onDropFile(e);
	// 		let reader = new FileReader();
	// 		let file = e.dataTransfer.files[0];
	// 		reader.onload = (e) => this.loadImage(e.target.result);
	// 		reader.readAsDataURL(file);
	// 	}
	// },

	componentDidMount() {
		const context = ReactDOM.findDOMNode(this.refs.canvas).getContext('2d');
		if (this.props.image) {
			this.loadImageLocal(this.props.image);
		}
		this.paint(context);
		if (document) {
			document.addEventListener(deviceEvents.native.move, this.handleMouseMove, false);
			document.addEventListener(deviceEvents.native.up, this.handleMouseUp, false);
		}

		// if (isTouchDevice) React.initializeTouchEvents(true);
	},

	componentWillUnmount() {
		if (document) {
			document.removeEventListener(deviceEvents.native.move, this.handleMouseMove, false);
			document.removeEventListener(deviceEvents.native.up, this.handleMouseUp, false);
		}

	},

	componentDidUpdate() {
		const context = ReactDOM.findDOMNode(this.refs.canvas).getContext('2d');
		context.clearRect(0, 0, this.getDimensions().canvas.width, this.getDimensions().canvas.height);
		this.paint(context);
		this.paintImage(context, this.state.image, this.props.border);
	},

	handleImageReady(image) {
		const imageState = this.getInitialSize(image.width, image.height);
		imageState.resource = image;
		imageState.xloc = 0;
		imageState.yloc = 0;
		this.props.onLoadSuccess(imageState);
		this.setState({drag: false, image: imageState}, this.props.onImageReady);
	},

	getInitialSize(width, height) {
		const dimensions = this.getDimensions();

		const canvasRatio = dimensions.height / dimensions.width;
		const imageRatio = height / width;

		let newHeight;
		let newWidth;
		if (canvasRatio > imageRatio) {
			newHeight = (this.getDimensions().height);
			newWidth = (width * (newHeight / height));
		} else {
			newWidth = (this.getDimensions().width);
			newHeight = (height * (newWidth / width));
		}

		return {
			height: newHeight,
			width: newWidth
		};
	},

	componentWillReceiveProps(newProps) {
		if (this.props.image !== newProps.image) {
			this.loadImageLocal(newProps.image);
		}
		if (
			this.props.scale !== newProps.scale
			|| this.props.height !== newProps.height
			|| this.props.width !== newProps.width
			|| this.props.border !== newProps.border
		) {
			this.squeeze(newProps);
		}
	},

	paintImage(context, image, border) {
		if (image.resource) {
			const position = this.calculatePosition(image, border);
			context.save();
			context.globalCompositeOperation = 'destination-over';
			context.drawImage(image.resource, position.xloc, position.yloc, position.width, position.height);

			context.restore();
		}
	},

	calculatePosition(image, border) {
		const thisImage = image || this.state.image;
		const dimensions = this.getDimensions();
		const width = thisImage.width * this.props.scale;
		const height = thisImage.height * this.props.scale;

		const widthDiff = (width - dimensions.width) / 2;
		const heightDiff = (height - dimensions.height) / 2;
		const xloc = thisImage.xloc * this.props.scale - widthDiff + border;
		const yloc = thisImage.yloc * this.props.scale - heightDiff + border;

		return {
			xloc: xloc,
			yloc: yloc,
			height: height,
			width: width
		};
	},

	paint(context) {
		context.save();
		context.translate(0, 0);
		context.fillStyle = 'rgba(' + this.props.color.slice(0, 4).join(',') + ')';

		const dimensions = this.getDimensions();

		const borderSize = dimensions.border;
		const height = dimensions.canvas.height;
		const width = dimensions.canvas.width;

		context.fillRect(0, 0, width, borderSize); // top
		context.fillRect(0, height - borderSize, width, borderSize); // bottom
		context.fillRect(0, borderSize, borderSize, height - (borderSize * 2)); // left
		context.fillRect(width - borderSize, borderSize, borderSize, height - (borderSize * 2)); // right

		context.restore();
	},

	handleMouseDown() {
		this.setState({
			drag: true,
			mx: null,
			my: null
		});
	},
	handleMouseUp() {
		if (this.state.drag) {
			this.setState({drag: false});
		}
	},

	handleMouseMove(evt) {
		if (this.state.drag === false) {
			return;
		}

		const imageState = this.state.image;
		const lastX = imageState.xloc;
		const lastY = imageState.yloc;

		const mousePositionX = isTouchDevice ? event.targetTouches[0].pageX : evt.clientX;
		const mousePositionY = isTouchDevice ? event.targetTouches[0].pageY : evt.clientY;

		const newState = { mx: mousePositionX, my: mousePositionY, image: imageState };

		if (this.state.mx && this.state.my) {
			const xDiff = (this.state.mx - mousePositionX) / this.props.scale;
			const yDiff = (this.state.my - mousePositionY) / this.props.scale;

			imageState.yloc = this.getBoundedY(lastY - yDiff, this.props.scale);
			imageState.xloc = this.getBoundedX(lastX - xDiff, this.props.scale);
		}
		this.props.onImageChange();
		this.setState(newState);
	},

	squeeze(props) {
		const imageState = this.state.image;
		imageState.yloc = this.getBoundedY(imageState.yloc, props.scale);
		imageState.xloc = this.getBoundedX(imageState.xloc, props.scale);
		this.setState({ image: imageState });
	},

	getBoundedX(xloc, scale) {
		const image = this.state.image;
		const dimensions = this.getDimensions();
		const widthDiff = Math.floor((image.width - dimensions.width / scale) / 2);
		return Math.max(-widthDiff, Math.min(xloc, widthDiff));
	},

	getBoundedY(yloc, scale) {
		const image = this.state.image;
		const dimensions = this.getDimensions();
		const heightDiff = Math.floor((image.height - dimensions.height / scale) / 2);
		return Math.max(-heightDiff, Math.min(yloc, heightDiff));
	},

	handleDragOver(evt) {
		evt.preventDefault();
	},

	handleDrop(evt) {
		evt.stopPropagation();
		evt.preventDefault();

		if (evt.dataTransfer.files.length) {
			// console.log(e);
			this.props.onDropFile(evt);
			const reader = new FileReader();
			const file = evt.dataTransfer.files[0];
			reader.onload = (event) => this.loadImage(event.target.result);
			reader.readAsDataURL(file);
		}
	},

	render() {
		const defaultStyle = {
			cursor: this.state.drag ? 'grabbing' : 'grab'
		};

		const attributes = {
			width: this.getDimensions().canvas.width,
			height: this.getDimensions().canvas.height,
			style: Object.assign(defaultStyle, this.props.style)
		};

		attributes[deviceEvents.react.down] = this.handleMouseDown;
		attributes[deviceEvents.react.drag] = this.handleDragOver;
		attributes[deviceEvents.react.drop] = this.handleDrop;

		return <canvas ref={'canvas'} {...attributes} />;
	}
});

export default ImageCropperEditor;
