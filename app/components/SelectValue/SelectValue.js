import React, { PropTypes } from 'react';
import Radium from 'radium';
let styles = {};

export const SelectValue = React.createClass({
	propTypes: {
		children: PropTypes.node,
		placeholder: PropTypes.string,
		value: PropTypes.object,
	},
	render() {
		const value = this.props.value || {};
		return (
			<div className="Select-value" title={value.title}>
				<span className="Select-value-label">
					{value && value.image &&
						<img role={'presentation'} src={'https://jake.pubpub.org/unsafe/50x50/' + value.image} style={styles.image} />
					}
					<span>{value.label}</span><span style={[styles.userName, !value.slug && { display: 'none' }]}> ({value.slug})</span>
				</span>
			</div>
		);
	}
});

export default Radium(SelectValue);


styles = {
	image: {
		padding: '0.25em 1em .25em 0em',
		height: '100%',
		verticalAlign: 'top',
		display: 'inline-block',
	},
	userName: {
		color: '#808284',
	},
};
