import React from 'react';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {globalStyles} from '../../utils/styleConstants';

let styles = {};

const NotFound = React.createClass({

	render: function() {
		const metaData = {
			title: 'PubPub - Not Found'
		};

		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				<div style={styles.header}>Doh - That page does not seem to exist!</div>
				<img src={'http://res.cloudinary.com/pubpub/image/upload/v1448221655/pubSad_blirpk.png'} />
			</div>
			
		);
	}
});

export default Radium(NotFound);

styles = {
	container: {
		width: '100%',
		height: 'calc(100% - ' + globalStyles.headerHeight + ')',
		backgroundColor: 'white',
		fontFamily: globalStyles.headerFont,
		textAlign: 'center',
		color: globalStyles.sideText,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'calc(100% - ' + globalStyles.headerHeightMobile + ')',
		}
	},
	header: {
		fontSize: 35,
		padding: '40px 5px 60px 5px',
	}
};
