import React from 'react';
import Radium from 'radium';
import Helmet from 'react-helmet';

import {FormattedMessage} from 'react-intl';

let styles = {};

const NotFound = React.createClass({

	render: function() {
		const metaData = {
			title: 'Not Found · PubPub ',
			meta: [
				{'name': 'robots', 'content': 'nofollow'},
				{'name': 'robots', 'content': 'noindex'},
			]
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<h1>
					<FormattedMessage id="notFound.pageDoesntExist" defaultMessage="Doh - That page does not seem to exist!"/>
				</h1>
					
				<img src={'http://res.cloudinary.com/pubpub/image/upload/v1448221655/pubSad_blirpk.png'} />
			</div>
			
		);
	}
});

export default Radium(NotFound);

styles = {
	container: {
		textAlign: 'center',
		padding: '5em 2em',
	},
};
