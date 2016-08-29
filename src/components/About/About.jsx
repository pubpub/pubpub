import React from 'react';
import Radium from 'radium';
import {globalStyles} from 'utils/styleConstants';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import smoothScroll from 'smoothscroll';

import {styles as aboutStyles} from './aboutStyles';

let styles = {};

import {globalMessages} from 'utils/globalMessages';
import {FormattedMessage} from 'react-intl';

export const About = React.createClass({

	scroll: function(id) {
		const destination = document.getElementById(id);
		if (!destination) { return undefined; }
		smoothScroll(destination);
	},

	render: function() {
		const metaData = {
			title: 'PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<div className={'lightest-bg'}>
					<div className={'section'}>

						<div style={styles.headerText}>
							<h1 style={styles.headerTextMax}>
								<FormattedMessage id="about.H1Description" defaultMessage="Open, Continuous Publishing"/>
							</h1>
							<p style={[styles.headerSubtitle, styles.headerTextMax]}>
								<FormattedMessage id="about.PDescription1" defaultMessage="	PubPub is a free and open tool for collaborative editing, instant publishing, continuous review, and grassroots journals."/>
							</p>
							<Link style={globalStyles.link} to={'/signup'}><div className={'button'} style={styles.headerButton}>
								<FormattedMessage {...globalMessages.SignUp}/>
							</div></Link>
						</div>

						<div style={styles.headerButtons}>
							<div onClick={this.scroll.bind(this, 'readers')} className={'underlineOnHover'} style={styles.buttonTitle}>
								<FormattedMessage id="about.ForReaders" defaultMessage="For Readers."/>
							</div>
							<p style={styles.buttonText}>
								<FormattedMessage id="about.PDescription2" defaultMessage="All is free to read and share"/>
							</p>

							<div onClick={this.scroll.bind(this, 'authors')} className={'underlineOnHover'} style={styles.buttonTitle}>
								<FormattedMessage id="about.ForAuthors" defaultMessage="For Authors"/>
							</div>
							<p style={styles.buttonText}>
								<FormattedMessage id="about.FreeImmediate" defaultMessage="Free, immediate publishing"/>
							</p>

							<div onClick={this.scroll.bind(this, 'reviewers')} className={'underlineOnHover'} style={styles.buttonTitle}>
								<FormattedMessage id="about.ForReviewers" defaultMessage="For Reviewers"/>
							</div>
							<p style={styles.buttonText}>
								<FormattedMessage id="about.BeRewarded" defaultMessage="Be rewarded for your work"/>
							</p>

							<div onClick={this.scroll.bind(this, 'journals')} className={'underlineOnHover'} style={styles.buttonTitle}>
								<FormattedMessage id="about.ForJournals" defaultMessage="For Journals"/>

							</div>
							<p style={styles.buttonText}>
								<FormattedMessage id="about.Curate" defaultMessage="Curate for your community"/>
							</p>
						</div>
					</div>
				</div>

				<div>
					<div className={'section'} >
						<h2>
							<FormattedMessage id="about.MadeWithPubPub" defaultMessage="Made with PubPub"/>
						</h2>

						<Link style={globalStyles.link} to={'/jods'}>
							<div style={styles.madeWithBlock} className={'lightest-bg-hover'}>
								<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/jodsIcon.png'} alt={'Journal of Design and Science'} />
								<div style={styles.madeWithTextWrapper}>
									<h3 style={styles.noMargin}>
										Journal of Design and Science
									</h3>
									<div style={styles.noMargin}>
										<FormattedMessage id="about.MITPressAndML" defaultMessage="MIT Press and MIT Media Lab"/>
									</div>
								</div>
							</div>
						</Link>

						<Link style={globalStyles.link} to={'/constitucioncdmx'}>
							<div style={styles.madeWithBlock} className={'lightest-bg-hover'}>
								<img style={styles.madeWithImage} src={'https://jake.pubpub.org/unsafe/75x75/https://assets.pubpub.org/_site/cdmxIcon.png'} alt={'Constitucion CDMX'} />
								<div style={styles.madeWithTextWrapper}>
									<h3 style={styles.noMargin}>Constitucion CDMX</h3>
									<div style={styles.noMargin}>Laboratorio CDMX, Government Mexico City</div>
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

				<div className={'lightest-bg'}>
					<div className={'section'} >
						<h2 style={styles.noMargin}>
							<FormattedMessage id="about.AFullStackPublishingTool" defaultMessage="A full-stack publishing tool"/>
						</h2>

						<div style={[styles.forWhoBlock, styles.forWhoBorderBottom]} id={'readers'}>
							<div style={[styles.forWhoText, styles.forWhoLeft]}>
								<h3 style={styles.noMargin}>
									<FormattedMessage id="about.ForReadersH" defaultMessage="For Readers"/>
								</h3>
								<p>
									<FormattedMessage id="about.ForReadersP" defaultMessage="A rich and collaborative open-source editor allows for evolving content and formats. Publishing is by the author and immediate. Publishing is versioned and we encourage publishing early and often to capture the full history of your work."/>
								</p>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoRight]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451416390/history_hires_ou47rn.gif'} alt={'PubPub Reading'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

						<div style={[styles.forWhoBlock, styles.forWhoBorderBottom]} id={'authors'}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h3 style={styles.noMargin}>
									<FormattedMessage id="about.ForAuthorsH" defaultMessage="For Authors"/>
								</h3>
								<p>
									<FormattedMessage id="about.ForAuthorsP" defaultMessage="	Author-driven free and immediate publishing. PubPub provides versioned histories and uses a rich and collaborative open-source editor that allows for evolving content and formats. PubPub encourages publishing early and often to capture the full history of your work."/>
								</p>
								<Link to={'/pubs'} style={globalStyles.link}>
									<div className={'button'}>
										<FormattedMessage id="about.MoreOnPubs" defaultMessage="More on Pubs"/>
									</div>
								</Link>
							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451416401/editing_hires_svywu2.gif'} alt={'PubPub Authoring'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

						<div style={[styles.forWhoBlock, styles.forWhoBorderBottom]} id={'reviewers'}>
							<div style={[styles.forWhoText, styles.forWhoLeft]}>
								<h3 style={styles.noMargin}>
									<FormattedMessage id="about.ForReviewersH" defaultMessage="For Reviewers"/>
								</h3>
								<p>
									<FormattedMessage id="about.ForReviewersP" defaultMessage="Review is distributed across many communities and done in the open. Rewarding constructive reviews and incentivizing progress opens the process to all that are capable."/>

								</p>
								{/* <Link to={'/reviews'} style={globalStyles.link}><div className={'button'}>More on Reviews</div></Link> */}
							</div>
							<img style={[styles.forWhoImage, styles.forWhoRight]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451416396/discussion_hires_jhdoga.gif'} alt={'PubPub Reviews'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

						<div style={styles.forWhoBlock} id={'journals'}>
							<div style={[styles.forWhoText, styles.forWhoRight]}>
								<h3 style={styles.noMargin}>
									<FormattedMessage id="about.ForJournalsH" defaultMessage="For Journals"/>
								</h3>
								<p>
									<FormattedMessage id="about.ForJournalsP" defaultMessage="Created by anyone for any community. Journals become tools for curating published content, not gatekeepers of scientific progress. Pubs can be submitted to and featured in as many journals as relevant. Journals can be run for large or small audiences, by institutions or individuals."/>
								</p>
								<Link to={'/journals'} style={globalStyles.link}>
									<div className={'button'} style={styles.marginRight}>
										<FormattedMessage id="about.MoreOnJournals" defaultMessage="More on Journals"/>

									</div>

								</Link>
								<Link to={'/journals/create'} style={globalStyles.link}>
									<div className={'button'}>
										<FormattedMessage {...globalMessages.CreateJournal}/>
									</div>
								</Link>

							</div>
							<img style={[styles.forWhoImage, styles.forWhoLeft]} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_415/v1451417712/outputjournal_qcdqyh.gif'} alt={'PubPub Journals'}/>
							<div style={globalStyles.clearFix}></div>
						</div>

					</div>
				</div>

				<div>
					<div className={'section'} >
						<h2>
							<FormattedMessage id="about.BuildThePublishingH" defaultMessage="Build the publishing world you want"/>
						</h2>
						<p style={styles.headerTextMax}>
							<FormattedMessage id="about.BuildThePublishingP" defaultMessage="PubPub is an open-source tool built for and by the community that uses it. Join PubPub, contribute code, design, features. Keep up to date with where we’re heading."/>
						</p>
						<a style={globalStyles.link} href={'https://github.com/pubpub/pubpub'}>
							<div className={'button'}>
								<FormattedMessage id="about.ViewCode" defaultMessage="View Code"/>
							</div>
						</a>
					</div>
				</div>
			</div>
		);
	}

});


export default Radium(About);

styles = {
	...aboutStyles,

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
	marginRight: {
		marginRight: '1em',
	},

	buttonTitle: {
		...globalStyles.link,
		fontSize: '1.1em',
		fontWeight: 'bold',
		whiteSpace: 'nowrap',
		cursor: 'pointer',
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

};
