// Originally taken from https://github.com/lonelyclick/react-loading-bar
// Forked to add auto-incrementing feature and to consolidate CSS
import React, { PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

let styles = {};
let interval = undefined;

export const AppLoadingBar = React.createClass({
	propTypes: {
		color: PropTypes.string,
		show: PropTypes.bool
	},

	getDefaultProps() {
		return {
			color: '#BBBDC0',
			show: false,
		};
	},

	getInitialState() {
		return {
<<<<<<< Updated upstream
			disappearDelayHide: false, // when dispappear, first transition then display none
			percent: 0,
=======
			size: 0,
			disappearDelayHide: false, // when dispappear, first transition then display none
			percent: 0,
			appearDelayWidth: 0 // when appear, first display block then transition width
>>>>>>> Stashed changes
		};
	},

	componentWillReceiveProps(nextProps) {
<<<<<<< Updated upstream
		if (!this.props.show && nextProps.show) {
			this.show();
			interval = setInterval(this.show, 200);
		} 
		if (this.props.show && !nextProps.show) {
=======
		const { show } = nextProps;

		if (show) {
			this.show();
			interval = setInterval(this.show, 200);
		} else {
>>>>>>> Stashed changes
			this.hide();
			clearInterval(interval);
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	},

	show() {
<<<<<<< Updated upstream
		let { percent } = this.state;
		percent = this.calculatePercent(percent);
		this.setState({
			percent
		});
	},

	hide() {
		this.setState({
=======
		let { size, percent } = this.state;

		const appearDelayWidth = size === 0;
		percent = this.calculatePercent(percent);

		this.setState({
			size: ++size,
			appearDelayWidth,
			percent
		});

		if (appearDelayWidth) {
			setTimeout(() => {
				this.setState({
					appearDelayWidth: false
				});
			});
		}
	},

	hide() {
		let { size } = this.state;

		if (--size < 0) {
			this.setState({ size: 0 });
			return;
		}

		this.setState({
			size: 0,
>>>>>>> Stashed changes
			disappearDelayHide: true,
			percent: 1
		});

		setTimeout(() => {
			this.setState({
				disappearDelayHide: false,
				percent: 0
			});
		}, 600);
	},

	getBarStyle() {
<<<<<<< Updated upstream
		const { disappearDelayHide, percent } = this.state;
=======
		const { disappearDelayHide, appearDelayWidth, percent } = this.state;
>>>>>>> Stashed changes
		const { color } = this.props;

		return {
			...styles.bar,
			background: color,
<<<<<<< Updated upstream
			transform: `translate3d(calc(-100% + ${percent * 100}%), 0, 0)`,
=======
			width: appearDelayWidth ? 0 : `${percent * 100}%`,
>>>>>>> Stashed changes
			display: disappearDelayHide || percent > 0 ? 'block' : 'none',
			opacity: disappearDelayHide ? 0 : 1,
		};
	},

	
	calculatePercent(percent) {
		let currentPercent = percent || 0;
		let random = 0;

<<<<<<< Updated upstream
		if (currentPercent < 0.25) {
=======
		if (currentPercent >= 0 && currentPercent < 0.25) {
>>>>>>> Stashed changes
			random = (Math.random() * (5 - 3 + 1) + 10) / 100;
		} else if (currentPercent >= 0.25 && currentPercent < 0.65) {
			random = (Math.random() * 3) / 100;
		} else if (currentPercent >= 0.65 && currentPercent < 0.9) {
			random = (Math.random() * 2) / 100;
		} else if (currentPercent >= 0.9 && currentPercent < 0.99) {
			random = 0.005;
		} else {
			random = 0;
		}

		currentPercent += random;
		return currentPercent;
	},

	render() {
		return (
			<div style={styles.loading}>
				<div style={this.getBarStyle()}>
					<div style={styles.peg}></div>
				</div>
			</div>
		);
	}
});

export default AppLoadingBar;

styles = {
	loading: {
		pointerEvents: 'none',
<<<<<<< Updated upstream
		// transition: '400ms linear all'
=======
		transition: '400ms linear all'
>>>>>>> Stashed changes
	},
	bar: {
		position: 'fixed',
		top: 0,
		left: 0,
		zIndex: 10002,
		display: 'none',
		width: '100%',
		height: '2px',
		borderRadius: '0 1px 1px 0',
<<<<<<< Updated upstream
		transition: 'transform 350ms, opacity 250ms linear 350ms',
=======
		transition: 'width 350ms, opacity 250ms linear 350ms',
>>>>>>> Stashed changes
	},
	peg: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: '70px',
		height: '2px',
		borderRadius: '50%',
		opacity: 0.45,
		boxShadow: '#777 1px 0 6px 1px',
	}
};
