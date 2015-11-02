import React from 'react';
import DocumentMeta from 'react-document-meta';


export default React.createClass({
	statics: {
		// fetchData: function(getState, dispatch) {
		// 	console.log('in the static fetchdata');
		// }
	},
	componentWillMount: function() {
		console.log('it will mount...');
	},
	componentDidMount: function() {
		console.log('it mounted!');
	},

	render: function() {
		const metaData = {
			title: 'PubPub - Not Found'
		};

		return (
			<div className="container">

				<DocumentMeta {...metaData} />

				<h1>Doh! 404!</h1>
				<p>These are <em>not</em> the droids you are looking for!</p>
			</div>
			
		);
	}
});
