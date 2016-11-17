/* eslint react/no-did-mount-set-state: 0 */
import React, { PropTypes } from 'react';

let TagComponent;
export const Tag = React.createClass({
	propTypes: {
		children: PropTypes.object,
	},

	getInitialState() {
		return {
			isClient: false,
		};
	},

	componentDidMount() {
		TagComponent = require('@blueprintjs/core').Tag;
		this.setState({ isClient: true });
	},

	render() {
		if (this.state.isClient) { return <TagComponent {...this.props} />; }
		return <div>{this.props.children}</div>;
	}
});

export default Tag;
