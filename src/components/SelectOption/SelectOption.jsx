import React, {PropTypes} from 'react';
import Radium from 'radium';
let styles = {};

export const SelectOption = React.createClass({
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
		const option = this.props.option || {};
		return (
			<div className={this.props.className} onMouseDown={this.handleMouseDown} onMouseEnter={this.handleMouseEnter} onMouseMove={this.handleMouseMove} title={option.title}>
				{option && option.image &&
					<img src={'https://jake.pubpub.org/unsafe/50x50/' + option.image} style={styles.image} />
				}
				<span>{option.label}</span><span style={styles.userName}> ({option.slug})</span>
			</div>
		);
	}
});

export default Radium(SelectOption);

styles = {
	image: {
		padding: '0em 1em 0em 0em',
		height: '26px',
		float: 'left',
	},	
	userName: {
		color: '#808284',	
	},
	
};
