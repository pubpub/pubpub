import React, {PropTypes} from 'react';
import Radium from 'radium';
let styles = {};

export const Loader = React.createClass({
	propTypes: {
		children: PropTypes.node,
		className: PropTypes.string,
		isDisabled: PropTypes.bool,
		isFocused: PropTypes.bool,
		isSelected: PropTypes.bool,
		onFocus: PropTypes.func,
		onSelect: PropTypes.func,
		option: PropTypes.object.isRequired,
	},
	handleMouseDown(event) {
		event.preventDefault();
		event.stopPropagation();
		this.props.onSelect(this.props.option, event);
	},
	handleMouseEnter(event) {
		this.props.onFocus(this.props.option, event);
	},
	handleMouseMove(event) {
		if (this.props.isFocused) return;
		this.props.onFocus(this.props.option, event);
	},
	render() {
		return (
			<div className={this.props.className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} title={this.props.option.title}>
				{this.props.option && this.props.option.image &&
					<img src={'https://jake.pubpub.org/unsafe/50x50/' + this.props.option.image} style={styles.image} />
				}
				<span>{this.props.option.label}</span>
			</div>
		);
	}
});

export default Radium(Loader);

styles = {
	image: {
		padding: '.25em',
		height: '26px',
		float: 'left',
	},	
};
