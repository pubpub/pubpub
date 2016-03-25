import React, {PropTypes} from 'react';
import createPubPubPlugin from './PubPub';
require('es6-promise').polyfill();
require('isomorphic-fetch');

const InputFields = [];

const Config = {
	title: 'pubList',
	autocomplete: true,
	color: 'rgba(185, 215, 249, 0.5)',
};

const EditorWidget = (props) => (<span>Pub List</span>);

const Plugin = React.createClass({
	propTypes: {
		error: PropTypes.string,
		children: PropTypes.string,
	},
	componentWillMount() {
		fetch('/api/autocompletePubsAll?string=auto')
		.then(function(response) {
			if (response.status >= 400) {
				throw new Error('Bad response from server');
			}
			return response.json();
		})
		.then(function(stories) {
			console.log(stories);
		});
	},
	getInitialState: function() {
		return {};
	},
	render: function() {

		return (
			<div>Here is the pub list!!</div>
		);
	}
});

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
