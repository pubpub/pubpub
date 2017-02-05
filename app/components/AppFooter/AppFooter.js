import React from 'react';
// import { Link } from 'react-router';

let styles;

export const AppFooter = React.createClass({
	
	render() {
		return (
			<div style={styles.container}>
				<a target={'_blank'} href={'https://github.com/pubpub/pubpub'} className={'link'} style={styles.item}>Github</a>
				<a target={'_blank'} href={'http://docs.pubpub.org'} className={'link'} style={styles.item}>API</a>
				<a target={'_blank'} href={'mailto:pubpub@media.mit.edu'} className={'link'} style={styles.item}>pubpub@media.mit.edu</a>
				<a target={'_blank'} href={'https://www.twitter.com/pubpub'} className={'link'} style={styles.item}>@pubpub</a>
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
