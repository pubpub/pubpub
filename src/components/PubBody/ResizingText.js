import React, {PropTypes} from 'react';
import {findDOMNode} from 'react-dom';

class ResizingText extends React.Component {

	componentDidMount() {
		this.updateSettings();
		this.updateWidthFont();
		this.resizeFunc = this.updateWidthFont.bind(this);
		window.addEventListener('resize', this.resizeFunc);
	}
	componentWillUnmountMount() {
		window.removeEventListener('resize', this.resizeFunc);
	}
	componentWillReceiveProps() {
		this.updateSettings();
		this.updateFontSize();
	}
	updateSettings() {
		this.settings = {
			maximum: this.props.maximum || 9999,
			minimum: this.props.minimum || 1,
			maxFont: this.props.maxFont || 9999,
			minFont: this.props.minFont || 15,
			fontRatio: this.props.fontRatio
		};
	}
	updateWidthFont() {
		const node = findDOMNode(this.refs.textBody);
		this.elemWidth = node ? node.offsetWidth : 800;
		this.updateFontSize();
	}
	calcWithBounds(max, min, elw) {
		let width;
		if (elw > max) {
			width = max;
		} else if (elw < min) {
			width = min;
		} else {
			width = elw;
		}
		return width;
	}
	updateFontSize() {
		const settings = this.settings;
		const elw = this.elemWidth;
		const width = this.calcWithBounds(settings.maximum, settings.minimum, elw);
		const fontBase = width / settings.fontRatio;
		const fontSize = Math.round(this.calcWithBounds(settings.maxFont, settings.minFont, fontBase));
		this.setState({fontSize: fontSize});
	}
	render() {
		let fontSize = this.state && this.state.fontSize;
		if (isNaN(fontSize)) {
			fontSize = this.props.default || null;
		}
		const divStyle = (fontSize) ? {'fontSize': fontSize + 'px' } : {};
		return (
			<div style={divStyle} ref="textBody">
				{this.props.children}
			</div>
  	);
	}
}

ResizingText.propTypes = {
	default: PropTypes.number,
	fontRatio: PropTypes.number.isRequired,
	maximum: PropTypes.number,
	minimum: PropTypes.number,
	minFont: PropTypes.number,
	maxFont: PropTypes.number,
	children: PropTypes.object
};

export default ResizingText;
