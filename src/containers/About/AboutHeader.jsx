import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';

let styles = {};

export const AboutHeader = React.createClass({

	render: function() {

		return (
			<div style={styles.container}>

				<div style={styles.header}>
					<div style={styles.headerText}>
						<div style={styles.headerTitle}>Open, Continuous Publishing</div>
						<div style={styles.headerSubtitle}>PubPub is a free and open tool for collaboratively writing documents, publishing, continuous review, and grassroots journals.</div>
					</div>

					<div style={styles.headerButtons}>
						<a href={'#authors'} className={'underlineOnHover'} style={styles.buttonTitle}>For Authors</a>
						<p style={styles.buttonText}>Free, immediate publishing</p>
						
						<a href={'#reviewers'} className={'underlineOnHover'} style={styles.buttonTitle}>For Reviewers</a>
						<p style={styles.buttonText}>Be rewarded for your work</p>
						
						<a href={'#journals'} className={'underlineOnHover'} style={styles.buttonTitle}>For Journals</a>
						<p style={styles.buttonText}>Curate for your community</p>

						<div className={'button'} style={styles.signUpButton}>Sign Up</div>
					</div>

				</div>
				

				
			</div>
		);
	}

});

export default Radium(AboutHeader);

styles = {
	container: {
		padding: '2em',
	},
	header: {
		display: 'table',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block'
		}
	},
	headerText: {
		display: 'table-cell',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
		}
	},
	headerButtons: {
		display: 'table-cell',
		width: '1%',
		textAlign: 'right',
		paddingLeft: '10px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
		}
	},
	headerTitle: {
		fontSize: '3.5em',
		maxWidth: '600px',
	},
	headerSubtitle: {
		fontSize: '1.5em',
		maxWidth: '600px',
	},
	buttonTitle: {
		...globalStyles.link,
		fontSize: '1.5em',
		whiteSpace: 'nowrap',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	buttonText: {
		marginTop: 0,
		whiteSpace: 'nowrap',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	signUpButton: {
		display: 'block',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '60%',
			margin: '1em auto',
			padding: '1em inherit',
		}
	}

};
