import React, { PropTypes } from 'react';
import Radium from 'radium';

export const PubSidePanel = React.createClass({
	propTypes: {
		children: PropTypes.node,
		parentId: PropTypes.string,
	},

	getInitialState: function() {
		return {
			top: 0,
			bottom: 0,
			width: 0,
			left: 0,
		};
	},
	componentDidMount() {
		setTimeout(()=> {
			this.positionContainer();
		}, 0);
	},

	componentWillMount() {
		const events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
		// this.positionContainer();
		events.map((event)=> {
			window.addEventListener(event, this.positionContainer);	
		});
		
	},
	componentWillUnmount() {
		const events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
		events.map((event)=> {
			window.removeEventListener(event, this.positionContainer);	
		});
	},

	positionContainer: function(evt) {
		const component = document.getElementById(this.props.parentId);
		if (!component) { return null; }
		const boundingRect = component.getBoundingClientRect();

		const isFixed = Math.max(boundingRect.top, 0) === 0;
		return isFixed
			? this.setState({
				top: 0,
				bottom: Math.max(0, window.innerHeight - boundingRect.bottom),
				width: boundingRect.width * 0.35,
				left: boundingRect.left + (boundingRect.width * 0.65),
				position: 'fixed',
			})
			: this.setState({
				top: 0,
				bottom: undefined,
				width: boundingRect.width * 0.35,
				left: undefined,
				right: 0,
				position: 'absolute',
			});
	},

	render: function() {
		
		return (
			<div style={{ ...this.state }}>
				{this.props.children}
			</div>
		);
	}
});

export default Radium(PubSidePanel);
