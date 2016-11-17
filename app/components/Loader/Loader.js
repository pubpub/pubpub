import React, {PropTypes} from 'react';
import Radium from 'radium';
let styles = {};

export const Loader = React.createClass({
	propTypes: {
		loading: PropTypes.bool,
		showCompletion: PropTypes.bool,
	},

	getInitialState() {
		return {
			showDone: false,
		};
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.loading === true && nextProps.loading === false && nextProps.showCompletion === true) {
			this.setState({showDone: true});
			setTimeout(()=>{
				if (this.isMounted()) {
					this.setState({showDone: false});
				}

			}, 2000);
		}
	},

	render: function() {
		return (
			<div style={styles.container}>
				
				<div style={[styles.spinner, (!this.props.loading || this.state.showDone) && {display: 'none'}]}></div>
				
				<div style={[styles.done, this.state.showDone && styles.showDone]}>
					✓
				</div>

			</div>
		);
	}
});

export default Radium(Loader);

const loaderFrames = Radium.keyframes({
	'0%': {transform: 'scale(0)'},
	'100%': {transform: 'scale(1.0)', opacity: 0},
}, 'loaderFrames');

styles = {
	container: {
		userSelect: 'none',
		height: '40px',
		width: '40px',
		position: 'relative',
	},
	spinner: {
		width: '100%',
		height: '100%',
		backgroundColor: '#333',
		borderRadius: '100%',
		animation: 'x 1.0s infinite ease-in-out',
		animationName: loaderFrames,
	},
	done: {
		opacity: 0,
		transition: '.1s linear opacity',
		textAlign: 'center',
		fontSize: '1.3em',
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		lineHeight: '40px',

	},
	showDone: {
		opacity: 1,
	},
};
