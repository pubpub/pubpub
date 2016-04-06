import React, {PropTypes} from 'react';
import MarkdownPlugins from 'components/Markdown/MarkdownPlugins';
import Radium from 'radium';

const widgetStyle = function(PluginColor) {
	return {
		backgroundColor: PluginColor || 'rgba(100,200,100,0.5)',
		cursor: 'pointer',
		color: '#222',
		padding: '0px 4px',
		':hover': {
			color: '#444',
			outline: '1px dashed #666',
		},
	};
};

const WidgetComponent = React.createClass({
	propTypes: {
		pluginType: PropTypes.string,
		openPopup: PropTypes.func,
	},
	componentDidMount: function() {
		// console.log('Mounted this!!');
	},
	componentWillUnmount: function() {
		// console.log('unmounted this!!');
	},
	handleClick: function() {
		if (this.props.openPopup) {
			this.props.openPopup();
		}
	},
	render: function() {
		let content;
		const Plugin = (this.props.pluginType && MarkdownPlugins[this.props.pluginType]) ? MarkdownPlugins[this.props.pluginType] : null;
		const PluginWidget = (Plugin	&& Plugin.Widget) ? Plugin.Widget : null;
		const PluginColor = (Plugin && Plugin.Config) ? Plugin.Config.color : null;

		if (PluginWidget) {
			content = (<PluginWidget {...this.props}/>);
		} else {
			content = (<span>{this.props.pluginType}</span>);
		}
		return (<span style={widgetStyle(PluginColor)} onClick={this.handleClick} className="ppm-widget">{content}</span>);
	}
});

export default Radium(WidgetComponent);
