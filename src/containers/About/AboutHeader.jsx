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
							<a href={'#readers'} className={'underlineOnHover'} style={styles.buttonTitle}>For Readers</a>
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
						<div style={styles.madeWithBlock} className={'lightest-bg-hover'}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/jodsIcon.png'} alt={'Journal of Design and Science'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.noMargin}>Journal of Design and Science</h3>
								<div style={styles.noMargin}>MIT Press and MIT Media Lab</div>
							</div>
						</div>
						</Link>

						<Link style={globalStyles.link} to={'/constitucioncdmx'}>
						<div style={styles.madeWithBlock} className={'lightest-bg-hover'}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/cdmxIcon.png'} alt={'Constitucion CDMX'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.noMargin}>Constitucion CDMX</h3>
								<div style={styles.noMargin}>Laboratoria CDMX, Government Mexico City</div>
							</div>
							
						</div>
						</Link>

						<Link style={globalStyles.link} to={'/tjoe'}>
						<div style={styles.madeWithBlock} className={'lightest-bg-hover'}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/tjoeIcon.png'} alt={'The Journal of Open Engineering'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.noMargin}>Journal of Open Engineering</h3>
								<div style={styles.noMargin}>Devin Berg, University of Wisconsin</div>
							</div>
						</div>
						</Link>

						<Link style={globalStyles.link} to={'/resci'}>
						<div style={styles.madeWithBlock} className={'lightest-bg-hover'}>
							<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/resciIcon.png'} alt={'Responsive Science'} />
							<div style={styles.madeWithTextWrapper}>
								<h3 style={styles.noMargin}>Responsive Science</h3>
								<div style={styles.noMargin}>Kevin Esvelt, MIT</div>
							</div>
						</div>
						</Link>
						
					</div>
				</div>

				<div className={'lightest-bg'} style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={[styles.sectionHeader, styles.noMargin]}>A full-stack publishing tool</h2>

						<div style={[styles.forWhoBlock, styles.forWhoBorderBottom]} id={'readers'}>
							<div style={[styles.forWhoText, styles.forWhoLeft]}>
								<h3 style={styles.noMargin}>For Readers</h3>
								<p>A rich and collaborative open-source editor allows for evolving content and formats. Publishing is by the author and immediate. Publishing is versioned and we encourage publishing early and often to capture the full history of your work.</p>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoRight]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451416390/history_hires_ou47rn.gif'} alt={'PubPub Reading'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

						<div style={[styles.forWhoBlock, styles.forWhoBorderBottom]} id={'authors'}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h3 style={styles.noMargin}>For Authors</h3>
								<p>Author-driven. Free and immediate publishing. Versioned Histories. A rich and collaborative open-source editor allows for evolving content and formats. Publishing is by the author and immediate. Publishing is versioned and we encourage publishing early and often to capture the full history of your work.</p>
								<div className={'button'}>More on Pubs</div>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451416401/editing_hires_svywu2.gif'} alt={'PubPub Authoring'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

						<div style={[styles.forWhoBlock, styles.forWhoBorderBottom]} id={'reviewers'}>
							<div style={[styles.forWhoText, styles.forWhoLeft]}>
								<h3 style={styles.noMargin}>For Reviewers</h3>
								<p>Review is distributed across many communities and done in the open. Rewarding constructive reviews and incentivizing progress rather than elitism opens the process to all that are capable.</p>
								<div className={'button'}>More on Reviews</div>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoRight]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451416396/discussion_hires_jhdoga.gif'} alt={'PubPub Reviews'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

						<div style={styles.forWhoBlock} id={'journals'}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h3 style={styles.noMargin}>For Journals</h3>
								<p>Created by anyone for any community. Journals become tools for curating published content. Not gatekeepers of scientific progress. Journals serve as curators rather than gatekeepers. Pubs can be submitted to and featured in as many journals as is relevant. No more silos. Journals can be run for large or small audiences, by institutions or individuals. Everyone can be a journal.</p>
								<div className={'button'}>More on Journals</div>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451417712/outputjournal_qcdqyh.gif'} alt={'PubPub Journals'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

					</div>
				</div>

				<div style={styles.sectionWrapper}>
					<div style={styles.section}>
						<h2 style={styles.sectionHeader}>Build the publishing world you want</h2>
						<p style={styles.headerTextMax}>PubPub is an open-source tool built for and by the community that uses it. Join PubPub, contribute code, design, features. Keep up to date with where we’re heading.</p>
						<a style={globalStyles.link} href={'https://github.com/pubpub/pubpub'} className={'button'}>View Code</a>
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
	noMargin: {
		marginTop: 0,
		marginBottom: 0,
	},
	forWhoBlock: {
		padding: '4em 0em',
	},
	forWhoBorderBottom: {
		borderBottom: '1px solid #BBBDC0',
	},
	forWhoText: {
		width: '50%',
		verticalAlign: 'top',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
		}
	},
	forWhoImage: {
		width: 'calc(50% - 100px)',
		boxShadow: '0px 0px 5px #808284',
		margin: '0px 50px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '100%',
			margin: '2em 0em',
		}
	},
	forWhoLeft: {
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
		}
	},
	forWhoRight: {
		float: 'right',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			float: 'none',
		}
	},

};
