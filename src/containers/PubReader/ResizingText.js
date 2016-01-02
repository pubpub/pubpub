import React, {PropTypes} from 'react';

class ResizingText extends React.Component {

	componentDidMount() {
		this.updateSettings();
		this.updateWidthFont();
		window.addEventListener('resize', this.updateWidthFont.bind(this));
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
			minFont: this.props.minFont || 20,
			fontRatio: this.props.fontRatio
		};
	}
	updateWidthFont() {
		this.elemWidth = this.refs.textBody.getDOMNode().offsetWidth;
		this.updateFontSize();
	}
	updateFontSize() {
		const settings = this.settings;
		const elw = this.elemWidth;
		const width = elw > settings.maximum ? settings.maximum : elw < settings.minimum ? settings.minimum : elw;
		const fontBase = width / settings.fontRatio;
		let fontSize = fontBase > settings.maxFont ? settings.maxFont : fontBase < settings.minFont ? settings.minFont : fontBase;
		fontSize = Math.round(fontSize);
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
