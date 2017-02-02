import React from 'react';
// import { Link } from 'react-router';

let styles;

export const AppFooter = React.createClass({
	
	render() {
		return (
			<div style={styles.container}>
				<a href={'https://github.com/pubpub/pubpub'} className={'link'} style={styles.item}>Github</a>
				<a href={'http://docs.pubpub.org'} className={'link'} style={styles.item}>API</a>
				<a href={'mailto:pubpub@media.mit.edu'} className={'link'} style={styles.item}>Contact us at pubpub@media.mit.edu</a>
			</div>
		);
	}

});

export default AppFooter;

styles = {
	container: {
		borderTop: '1px solid #888',
		marginBottom: '1em',
		paddingTop: '1em',
		textAlign: 'center',
	},
	item: {
		display: 'inline-block',
		padding: '0em 1em',
		color: '#888',
		fontSize: '0.9em',
	},
};
