import React, {PropTypes} from 'react';
import Radium from 'radium';
let styles = {};

export const SelectValue = React.createClass({
	propTypes: {
		children: PropTypes.node,
		placeholder: PropTypes.string,
		value: PropTypes.object,
	},
	render() {
		return (
			<div className="Select-value" title={this.props.value.title}>
				<span className="Select-value-label">
					{this.props.value && this.props.value.image &&
						<img src={'https://jake.pubpub.org/unsafe/50x50/' + this.props.value.image} style={styles.image} />
					}
					
					<span>{this.props.value.label}</span>
				</span>
			</div>
		);
	}
});

export default Radium(SelectValue);


styles = {
	image: {
		padding: '.25em',
		height: '26px',
		float: 'left',
	},	
};
