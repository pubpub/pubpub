import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';

let styles = {};

export const AboutHeader = React.createClass({

	render: function() {

		return (
			<div style={styles.container}>

				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={[styles.section, styles.table]}>

						<div style={styles.headerText}>
							<h1 style={[styles.headerTitle, styles.headerTextMax]}>Open, Continuous Publishing</h1>
							<p style={[styles.headerSubtitle, styles.headerTextMax]}>PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals.</p>
							<Link style={globalStyles.link} to={'/signup'}><div className={'button'} style={styles.signUpButton}>Sign Up</div></Link>
						</div>

						<div style={styles.headerButtons}>
							<a href={'#journals'} className={'underlineOnHover'} style={styles.buttonTitle}>For Readers</a>
							<p style={styles.buttonText}>All is free to read and share</p>

							<a href={'#authors'} className={'underlineOnHover'} style={styles.buttonTitle}>For Authors</a>
							<p style={styles.buttonText}>Free, immediate publishing</p>
							
							<a href={'#reviewers'} className={'underlineOnHover'} style={styles.buttonTitle}>For Reviewers</a>
							<p style={styles.buttonText}>Be rewarded for your work</p>
							
							<a href={'#journals'} className={'underlineOnHover'} style={styles.buttonTitle}>For Journals</a>
							<p style={styles.buttonText}>Curate for your community</p>
						</div>

					</div>
				</div>

				<div style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Made with PubPub</h2>
						
						<Link style={globalStyles.link} to={'/jods'}>
						<div style={styles.madeWithBlock}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/jodsIcon.png'} alt={'Journal of Design and Science'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.madeWithText}>Journal of Design and Science</h3>
								<div style={styles.madeWithText}>MIT Press and MIT Media Lab</div>
							</div>
						</div>
						</Link>

						<Link style={globalStyles.link} to={'/constitucioncdmx'}>
						<div style={styles.madeWithBlock}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/cdmxIcon.png'} alt={'Constitucion CDMX'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.madeWithText}>Constitucion CDMX</h3>
								<div style={styles.madeWithText}>Laboratoria CDMX, Government Mexico City</div>
							</div>
							
						</div>
						</Link>

						<Link style={globalStyles.link} to={'/tjoe'}>
						<div style={styles.madeWithBlock}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/tjoeIcon.png'} alt={'The Journal of Open Engineering'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.madeWithText}>Journal of Open Engineering</h3>
								<div style={styles.madeWithText}>Devin Berg, University of Wisconsin</div>
							</div>
						</div>
						</Link>

						<Link style={globalStyles.link} to={'/resci'}>
						<div style={styles.madeWithBlock}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/resciIcon.png'} alt={'Responsive Science'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.madeWithText}>Responsive Science</h3>
								<div style={styles.madeWithText}>Kevin Esvelt, MIT</div>
							</div>
						</div>
						</Link>
						
					</div>
				</div>

				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>A full-stack publishing tool</h2>
						<div style={styles.sectionSubHeader}>For Readers</div>
						<div style={styles.sectionSubHeader}>For Authors</div>
						<div style={styles.sectionSubHeader}>For Reviewers</div>
						<div style={styles.sectionSubHeader}>For Journals</div>
					</div>
				</div>

				<div style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Build the publishing world you want</h2>
						<p style={styles.headerTextMax}>PubPub is an open-source tool built for and by the community that uses it. Join PubPub, contribute code, design, features. Keep up to date with where we’re heading.</p>
						<a style={globalStyles.link} href={'https://github.com/pubpub/pubpub'}><div className={'button'} style={styles.signUpButton}>Sign Up</div></a>
					</div>
				</div>

				
			</div>
		);
	}

});


export default Radium(AboutHeader);

styles = {
	container: {
	},
	sectionWrapper: {
		padding: '3em 2em',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			padding: '3em 1em',
		}
	},
	section: {
		maxWidth: '1024px',
		margin: '0 auto',
	},
	table: {
		display: 'table',
	},
	headerText: {
		display: 'table-cell',
	},
	headerButtons: {
		display: 'table-cell',
		width: '1%',
		textAlign: 'right',
		paddingLeft: '2em',
		verticalAlign: 'middle',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},
	headerTitle: {
		fontSize: '3.5em',
		marginTop: '0em',
		letterSpacing: '-3px',
		lineHeight: '1em',
	},
	headerSubtitle: {
		fontSize: '1.5em',
	},
	headerTextMax: {
		maxWidth: '600px',
	},

	sectionHeader: {
		fontSize: '2.5em',
		marginTop: '0em',
	},

	signUpButton: {
		margin: '2em 0em 0em 0em',
		padding: '1em 5em',
	},
	buttonTitle: {
		...globalStyles.link,
		fontSize: '1.1em',
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
	},
	buttonText: {
		marginTop: 0,
		whiteSpace: 'nowrap',
		fontSize: '0.9em',
	},
	madeWithBlock: {
		width: 'calc(50% - 2px - 10px)',
		margin: '0px 10px 10px 0px',
		border: '1px solid #BBBDC0',
		display: 'inline-table',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'table',
			width: 'auto',
		}
	},
	madeWithImage: {
		borderRight: '1px solid #DDD',
		display: 'table-cell',
	},
	madeWithTextWrapper: {
		display: 'table-cell',
		verticalAlign: 'top',
		width: '100%',
		padding: '.5em',
	},
	madeWithText: {
		margin: 0,
	}

};
