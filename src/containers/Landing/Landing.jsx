import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {globalStyles} from 'utils/styleConstants';
import {PreviewCard} from 'components';
import AboutHeader from 'containers/About/AboutHeader';
import { Link } from 'react-router';

let styles = {};

const Landing = React.createClass({
	propTypes: {
		landingData: PropTypes.object,
		dispatch: PropTypes.func
	},

	getInitialState() {
		return {
			activeFeature: 'editing',
		};
	},

	setFeature: function(newFeature) {
		return ()=> {
			this.setState({activeFeature: newFeature});
		};
	},

	render: function() {
		const metaData = {
			title: 'PubPub',
		};

		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				<AboutHeader />

				<div>
					<div style={styles.lower}>
						<div style={styles.textDark}>
							<div style={styles.centerMedium}>Read, Write, Publish, Review.</div>
							<div style={styles.centerMedium}>PubPub is a platform for totally transparent publishing.</div>
							<div style={styles.centerTitle}>Three Core Experiments</div>
							<div style={styles.experimentBlock}>
								<div style={styles.experimentTitle}>Modern Publishing</div>
								<div style={styles.experimentText}>A rich and collaborative open-source editor allows for evolving content and formats. Publishing is by the author and immediate. Publishing is versioned and we encourage publishing early and often to capture the full history of your work.</div>
							</div>

							<div style={styles.experimentBlock}>
								<div style={styles.experimentTitle}>Distributed Review</div>
								<div style={styles.experimentText}>Review is distributed across many communities and done in the open. Rewarding constructive reviews and incentivizing progress rather than elitism opens the process to all that are capable.</div>
							</div>

							<div style={styles.experimentBlock}>
								<div style={styles.experimentTitle}>Grassroots Journals</div>
								<div style={styles.experimentText}>Journals serve as curators rather than gatekeepers. Pubs can be submitted to and featured in as many journals as is relevant. No more silos. Journals can be run for large or small audiences, by institutions or individuals. Everyone can be a journal.</div>
							</div>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>

					<div style={styles.section}>
						<div style={styles.sectionContent}>
							<div style={styles.sectionDetails}>
								<div style={styles.sectionTitle}>Open, Rich Publishing</div>
								<div style={styles.sectionDetail}>Author-driven publishing</div>
								<div style={styles.sectionDetail}>Free and immediate publishing</div>
								<div style={styles.sectionDetail}>Versioned histories</div>
							</div>

							<div style={styles.sectionExamples}>
								<Link to={'/pub/designandscience'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										<span style={styles.sectionExampleTitle}>Design and Science</span>
										<span style={styles.sectionExampleAuthor}>by Joi Ito</span>
									</div>
								</Link>
								<Link to={'/pub/design-as-participation'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										<span style={styles.sectionExampleTitle}>Design as Participation</span>
										<span style={styles.sectionExampleAuthor}>by Kevin Slavin</span>
									</div>
								</Link>
								<Link to={'/pubs/create'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										+ Create new Pub
									</div>
								</Link>
							</div>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>

					<div style={styles.sectionDark}>
						<div style={styles.sectionContent}>

							<div style={[styles.sectionDetails, styles.sectionDetailsRight, globalStyles.right]}>
								<div style={styles.sectionTitle}>Built Open</div>
								<div style={styles.sectionDetail}>An open medium for dynamic, rich peer-review and discussion</div>
								<div style={styles.sectionDetail}>Open-sourced and evolving. PubPub is a dedicated to building a platform accessible to all</div>
								<div style={styles.sectionDetail}>Focused on implementing open standards that make your publication exportable, machine-readable, and interopable.</div>
							</div>

							<div style={[styles.sectionExamples, globalStyles.right]}>

								<a href={'https://github.com/pubpub/pubpub'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										Code
									</div>
								</a>
								<a href={'https://github.com/pubpub/pubpub/blob/master/CHANGELOG.md'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										Updates and Roadmap
									</div>
								</a>
								<a href={'https://github.com/pubpub/pubpub/blob/master/CONTRIBUTING.md'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										+ Contribute
									</div>
								</a>
							</div>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>

					<PreviewCard 
						image={'http://res.cloudinary.com/pubpub/image/upload/c_limit,h_250,w_250/v1449761714/3eb7882_iavg9s.jpg'}
						title={'Thariq Shihipar'}
						description={'Intent on eating every bagel on earth until I burst.'} />


					<div style={styles.section}>
						<div style={styles.sectionContent}>
							<div style={styles.sectionDetails}>
								<div style={styles.sectionTitle}>Grassroots Journals</div>
								<div style={styles.sectionDetail}>Created by anyone for any community</div>
								<div style={styles.sectionDetail}>Journals become tools for curating published content. Not gatekeepers of scientific progress</div>
							</div>

							<div style={styles.sectionExamples}>
								<a href={'http://jods.mitpress.mit.edu'} style={globalStyles.link}>
									<div style={[styles.sectionExample, styles.exampleJoDS]}>
										Journal of Design and Science
									</div>
								</a>
								<a href={'http://cdmxglobal.pubpub.org'} style={globalStyles.link}>
									<div style={[styles.sectionExample, styles.exampleCDMX]}>
										CDMX Global
									</div>
								</a>
								<a href={'http://viral.pubpub.org'} style={globalStyles.link}>
									<div style={[styles.sectionExample, styles.exampleViral]}>
										Viral Communications
									</div>
								</a>
								<Link to={'/journals/create'} style={globalStyles.link}>
									<div style={styles.sectionExample}>
										+ Create new Journal
									</div>
								</Link>
							</div>
							<div style={globalStyles.clearFix}></div>
						</div>
					</div>

					<div style={styles.featureDemos}>
						<div style={styles.features}>
							<div key={'feature0'} style={[styles.feature, this.state.activeFeature === 'editing' && styles.featureActive]} onClick={this.setFeature('editing')}>Rich, Collaborative Editing</div>
							<div key={'feature1'} style={[styles.feature, this.state.activeFeature === 'discussions' && styles.featureActive]} onClick={this.setFeature('discussions')}>In-line rich discussion</div>
							<div key={'feature2'} style={[styles.feature, this.state.activeFeature === 'history' && styles.featureActive]} onClick={this.setFeature('history')}>Versioned Publication History</div>
							<div key={'feature3'} style={[styles.feature, this.state.activeFeature === 'journals' && styles.featureActive]} onClick={this.setFeature('journals')}>Custom grassroots journals</div>
						</div>
						<div style={styles.featurePreview}>

							<div style={styles.featurePreviewImageWrapper}>
								{(()=>{
									switch (this.state.activeFeature) {
									case 'editing':
										return <img style={styles.featurePreviewImage} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451416401/editing_hires_svywu2.gif'}/>;
									case 'discussions':
										return <img style={styles.featurePreviewImage} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451416396/discussion_hires_jhdoga.gif'}/>;
									case 'history':
										return <img style={styles.featurePreviewImage} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451416390/history_hires_ou47rn.gif'}/>;
									case 'journals':
										return <img style={styles.featurePreviewImage} src={'https://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451417712/outputjournal_qcdqyh.gif'}/>;
									default:
										return <img style={styles.featurePreviewImage} src={'https://i.imgur.com/X5ZSCJT.jpg'}/>;
									}
								})()}
							</div>

						</div>
						<div style={globalStyles.clearFix}></div>
					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		loginData: state.login,
		landingData: state.landing,
	};
})( Radium(Landing) );

styles = {
	container: {

		// height: '100%',
		// overflow: 'hidden',
		// overflowY: 'scroll',
		// fontFamily: globalStyles.headerFont,
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	height: 'auto',
		// 	overflow: 'hidden',
		// },
	},
	top: {
		// backgroundColor: globalStyles.headerText,
		backgroundColor: '#F4F4F4',
		overflow: 'hidden',
		height: 400,
		textAlign: 'center',
	},
	topPub: {
		fontFamily: '"Yrsa", Georgia, serif',
		fontWeight: 900,
		fontSize: '6.5em',
		margin: '30px 0px 0px 0px',
		color: '#2C2A2B',

	},
	subheader: {
		fontFamily: '"Clear Sans", Helvetica Neue, Arial, sans-serif',
		// color: globalStyles.headerBackground,
		color: '#2C2A2B',
		fontSize: '1.2em',
		textTransform: 'uppercase',
		letterSpacing: '.2em',
		margin: '-20px 0px 50px 0px',
	},
	showMeScience: {
		// width: 250,
		// height: 80,
		// lineHeight: '80px',
		textAlign: 'center',
		display: 'inline-block',
		// fontSize: '22px',
		// backgroundColor: globalStyles.headerBackground,
		// margin: '80px auto',
		fontFamily: '"Clear Sans", Helvetica Neue, Arial, sans-serif',
		fontSize: '1.2em',
		border: '2px solid #585858',
		padding: '.9em 1.8em',
		':hover': {
			backgroundColor: '#58585B',
			color: '#F4F4F4',
		},
		':active': {
			position: 'relative',
			top: '1px',
		},
	},
	// scienceText: {
	// 	textDecoration: 'none',
	// 	// color: '#58585B',
	// 	width: '100%',
	// 	height: '100%',
	// 	display: 'block',
	// 	// ':hover': {
	// 	// 	color: globalStyles.headerHover,
	// 	// },
	// },
	search: {
		width: 'calc(100% - 60px)',
		padding: '10px 30px',
		// backgroundColor: '#2A2A2A',
		// color: '#EFEFEF',
		backgroundColor: 'white',
	},
	text: {
		color: globalStyles.headerBackground,
		textDecoration: 'none',
	},
	textDark: {
		color: globalStyles.headerText,
		maxWidth: 1024,
		padding: 20,
		margin: '40px auto 60px auto',
		fontSize: '22px',

	},
	lower: {
		overflow: 'hidden',
		// height: 900,
		backgroundColor: globalStyles.headerBackground
	},
	section: {
		backgroundColor: '#F4F4F4',
		// backgroundColor: '#BBBDC0',
	},
	sectionDark: {
		backgroundColor: 'inherit',
		// backgroundColor: '#F4F4F4',
	},
	sectionContent: {
		maxWidth: 1024,
		padding: '60px 20px 60px 20px',
		margin: '0 auto',
	},
	sectionDetails: {
		float: 'left',
		width: '55%',
		paddingRight: '5%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'auto',
			paddingRight: '0px',
			margin: '0 auto',
			float: 'none',
		},
	},
	sectionDetailsRight: {
		paddingRight: '0px',
		paddingLeft: '5%',
		textAlign: 'right',
	},
	sectionTitle: {
		fontSize: '2em',
		textTransform: 'uppercase',
		letterSpacing: '.1em',
		paddingBottom: '20px',
	},
	sectionDetail: {
		padding: '15px 0px',
		fontSize: '1.2em',
	},
	sectionExamples: {
		float: 'left',
		width: '40%',
		paddingTop: '78px', // Height of sectionTitle + scetionTitlePadding + detailPadding
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: '85%',
			margin: '0 auto',
			float: 'none',
		},
	},
	sectionExample: {
		border: '2px solid #585858',
		borderRadius: '2px',
		textAlign: 'center',
		margin: '10px 0px',
		padding: '10px 0px',
	},
	sectionExampleAuthor: {
		fontSize: '0.8em',
		fontStyle: 'italic',
		paddingLeft: '0.5em',
	},
	exampleJoDS: {
		backgroundColor: 'black',
		color: 'white',
		fontFamily: 'Helvetica'
	},
	exampleCDMX: {
		backgroundColor: 'white',
		color: '#D61A7B',
		fontFamily: 'Helvetica'
	},
	exampleViral: {
		fontFamily: 'Helvetica',
		backgroundColor: '#CCCCCC',
	},
	results: {
		// backgroundColor: 'rgba(255,90,80,0.3)',
		margin: '9px 0px',
	},
	result: {
		padding: '10px 0px',
		// backgroundColor: 'rgba(100,200,49,0.5)',
		height: 40,
		borderTop: '1px solid #DDD',
	},
	imageWrapper: {
		float: 'left',
		height: 40,
		margin: '0px 10px 0px 0px',
	},
	pub: {
		imageWrapper: {
			display: 'none',
		},
	},
	user: {
	},
	image: {
		height: '100%',
	},

	type: {
		width: 40,
		float: 'left',
		fontSize: '15px',
		fontFamily: 'Courier',
		lineHeight: '40px',
		padding: '0px 25px 0px 0px',
		color: globalStyles.veryLight,
	},
	name: {
		float: 'left',
		fontSize: '20px',
		lineHeight: '40px',
		padding: '0px 10px 0px 0px',
	},
	noResults: {
		fontSize: '25px',
		height: 30,
		lineHeight: '30px',
		textAlign: 'center',
	},
	resultLink: {
		display: 'inline-block',
		height: '100%',
		color: globalStyles.sideText,
		// color: '#F4F4F4',
		':hover': {
			color: globalStyles.sideHover,
			// color: '#CCC'
		},
	},
	centerMedium: {
		fontSize: '20px',
		textAlign: 'center',
		fontFamily: globalStyles.headerFont,
		color: '#A8A8A8',
	},
	centerTitle: {
		fontSize: '50px',
		textAlign: 'center',
		// fontFamily: globalStyles.headerFont,
		fontFamily: '"Yrsa", Georgia, serif',
		fontWeight: 900,
		color: '#D1D1D1',
		margin: '40px 0px 70px 0px',
	},
	experimentBlock: {
		width: 'calc((100% / 3) - 20px)',
		padding: '0px 10px',
		float: 'left',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			width: 'calc(100% - 20px)',
		},
	},
	experimentTitle: {
		fontWeight: 900,
		fontSize: '22px',
		textAlign: 'center',
		color: '#D1D1D1',
	},
	experimentText: {
		fontSize: '17px',
		textAlign: 'justify',
		padding: '15px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginBottom: '30px',
		},
	},
	featureDemos: {
		maxWidth: 1024,
		// backgroundColor: 'red',
		margin: '50px auto',
		padding: 10,
		display: 'table',
		tableLayout: 'fixed',

	},
	features: {
		// backgroundColor: 'orange',
		display: 'table-cell',
		width: '40%',
		verticalAlign: 'middle',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			width: '100%',
		},
	},
	feature: {
		padding: '15px 0px',
		fontSize: '18px',
		cursor: 'pointer',
		color: '#aaa',
		':hover': {
			color: 'black',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			textAlign: 'center',
			padding: '5px 10px'
		},
	},
	featureActive: {
		color: 'black',
	},
	featurePreview: {
		// backgroundColor: 'green',
		display: 'table-cell',
		width: '60%',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			marginTop: '20px',
			display: 'block',
			width: '100%',
		},
	},
	featurePreviewImageWrapper: {
		width: '100%',
		// float: 'right',
	},
	featurePreviewImage: {
		width: '100%',
		boxShadow: '0px 3px 4px rgba(0,0,0,0.4)',
	},
	// footer: {
	// 	padding: '50px 0px',
	// 	backgroundColor: globalStyles.headerBackground,
	// 	color: globalStyles.headerText,
	// 	fontSize: '18px',
	// 	textAlign: 'center',
	// },
	// footerItem: {
	// 	color: '#aaa',
	// 	':hover': {
	// 		color: '#fff',
	// 	},
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'block',
	// 		padding: '15px 0px',
	// 	},
	// },
	// footerSeparator: {
	// 	padding: '0px 30px',
	// 	'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
	// 		display: 'none',
	// 	}
	// },


};
