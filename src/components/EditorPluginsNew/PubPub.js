import Radium from 'radium';
import ErrorMsg from './ErrorPlugin';
import React, {PropTypes} from 'react';

function attachPopup(Component, options, props) {
	const PluginWrapper = React.createClass({
		render() {
			try {
				return (<Component {...this.props} {...this.state} />);
			} catch (err) {
				console.log(err);
				return (<ErrorMsg>Error rendering {options.name} plugin</ErrorMsg>);
			}
		}
	});
	return PluginWrapper;

}

export getProp(propName, propOption) {
  return {name: propName, option: propOption};
}

export default function(reactComponent, options, props) {
	return {
		options: options,
		props: props,
		Component: attachPopup(Radium(reactComponent))
	};
}
