import React from 'react';
import createPubPubPlugin from './PubPub';

const InputFields = [
	{title: 'pagebreaks', type: 'explainer', params: {explainerText: 'Pagebreaks adds a pagebreak while printing.'}},
];

const Config = {
	title: 'pagebreak',
	autocomplete: true,
	preview: false,
	color: 'rgba(185, 215, 249, 0.5)',
};

const EditorWidget = (inputProps) => (<span>Pagebreak</span>);

const Plugin = React.createClass({
	propTypes: {
	},
	render: function() {
		return <div className={'pagebreak'} style={{display: 'block', borderTop: '1px dashed #ddd'}}></div>;
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
