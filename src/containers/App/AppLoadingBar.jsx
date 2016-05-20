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
			size: 0,
			disappearDelayHide: false, // when dispappear, first transition then display none
			percent: 0,
			appearDelayWidth: 0 // when appear, first display block then transition width
		};
	},

	componentWillReceiveProps(nextProps) {
		const { show } = nextProps;

		if (show) {
			this.show();
			interval = setInterval(this.show, 200);
		} else {
			this.hide();
			clearInterval(interval);
		}
	},

	shouldComponentUpdate(nextProps, nextState) {
		return shallowCompare(this, nextProps, nextState);
	},

	show() {
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
		const { disappearDelayHide, appearDelayWidth, percent } = this.state;
		const { color } = this.props;

		return {
			...styles.bar,
			background: color,
			width: appearDelayWidth ? 0 : `${percent * 100}%`,
			display: disappearDelayHide || percent > 0 ? 'block' : 'none',
			opacity: disappearDelayHide ? 0 : 1,
		};
	},

	
	calculatePercent(percent) {
		let currentPercent = percent || 0;
		let random = 0;

		if (currentPercent >= 0 && currentPercent < 0.25) {
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
		transition: '400ms linear all'
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
		transition: 'width 350ms, opacity 250ms linear 350ms',
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
