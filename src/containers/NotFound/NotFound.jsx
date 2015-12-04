import React from 'react';
import DocumentMeta from 'react-document-meta';


export default React.createClass({

	componentWillMount: function() {
		// console.log('it will mount...');
	},
	componentDidMount: function() {
		// console.log('it mounted!');
	},

	componentWillUnmount() {
		window.scrollTo(0, 0);
	},
	
	render: function() {
		const metaData = {
			title: 'PubPub - Not Found'
		};

		return (
			<div className="container">

				<DocumentMeta {...metaData} />

				<h1>Doh! 404!</h1>
				<p>That page does not seem to exist!</p>
			</div>
			
		);
	}
});
