import React, {PropTypes} from 'react';
import Radium from 'radium';
import ImageLoader from 'react-imageloader';

let styles = {};

const baseMediaPlugin = React.createClass({
	propTypes: {
		children: PropTypes.any,
		size: React.PropTypes.oneOf(['small', 'medium', 'large']),
		align: React.PropTypes.oneOf(['left', 'right', 'full']),
		caption: PropTypes.string,
	},
	getInitialState: function() {
		return {};
	},
	render: function() {
		const size = this.props.size || 'large';
		const align = this.props.align || 'full';
		const caption = this.props.caption || '';

		// whether floating flows all of the text or just some is dependent on how much space is left
		// a 'large' image is smaller when floating because it needs to leave space for the text
		const sizeOptions = {
			'small': (this.props.align === 'full') ? '30%' : '25%',
			'medium': (this.props.align === 'full') ? '50%' : '40%',
			'large': (this.props.align === 'full') ? '100%' : '60%'
		};

		const styleObject = {
			width: sizeOptions[size],
			height: sizeOptions[size],
			display: 'block'
		};

		if (align === 'left' || align === 'right' ) {
			styleObject.float = align;
			styleObject.margin = '2em';
		} else if (this.props.align === 'full') {
			styleObject.margin = '0px auto';
		}

		return (<div style={styleObject}>
			{this.props.children}
			{ (caption) ? <span style={styles.caption}>{caption}</span> : null }
		</div>
		);
	}
});

styles = {
	caption: {
		fontSize: '0.8em',
		color: '#757575',
		textAlign: 'justify'
	},
};


export default Radium(baseMediaPlugin);
