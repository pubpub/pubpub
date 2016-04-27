import React from 'react';
import createPubPubPlugin from './PubPub';

const InputFields = [
	{title: 'linebreaks', type: 'explainer', params: {explainerText: 'Linebreaks add new lines'}},
];

const Config = {
	title: 'linebreak',
	autocomplete: true,
	preview: false,
	color: 'rgba(185, 215, 249, 0.5)',
};

const EditorWidget = (inputProps) => (<span>Linebreak</span>);

const Plugin = React.createClass({
	propTypes: {
	},
	render: function() {
		return <br/>;
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
