import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import Helmet from 'react-helmet';
import {Autocomplete} from '../';
import {globalStyles} from '../../utils/styleConstants';
import {LandingBody} from '../../components';
import {getRandomSlug} from '../../actions/journal';
import { pushState } from 'redux-router';
import { Link } from 'react-router';
const HoverLink = Radium(Link);

let styles = {};

const Landing = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		landingData: PropTypes.object,
		path: PropTypes.string,
		query: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	getInitialState() {
		return {
			activeFeature: 'editing',
		};
	},

	setQuery: function(queryObject) {
		this.props.dispatch(pushState(null, this.props.path, {...this.props.query, ...queryObject}));
	},

	renderLandingSearchResults: function(results) {
		// console.log(results);
		return (
			<div style={styles.results}>
				{

					results.map((item, index)=>{
						const url = item.slug ? '/pub/' + item.slug : '/user/' + item.username;
						const type = item.slug ? 'pub' : 'user';
						return (<div key={'landingSearchResult-' + index} style={styles.result}>
							<HoverLink key={'landingSearchResultLink-' + index} style={styles.resultLink} to={url}>
								<div style={styles.type}>{type}</div>
								<div style={[styles.imageWrapper, styles[type].imageWrapper]}>
									<img style={styles.image} src={item.thumbnail} />
								</div>
								<div style={styles.name}>{item.name}</div>
								<div style={styles.name}>{item.title}</div>
							</HoverLink>

						</div>);	
					})
				}

				{results.length === 0
					? <div style={styles.noResults}>No Results</div>
					: null
				}
			</div>
		);
	},

	showMeScienceClick: function() {
		const analyticsData = {
			location: '/',
			journalID: this.props.journalData.getIn(['journalData', '_id']),
			journalName: this.props.journalData.getIn(['journalData', 'journalName']),
		};
		this.props.dispatch(getRandomSlug(this.props.journalData.getIn(['journalData', '_id']), analyticsData));
	},

	setFeature: function(newFeature) {
		return ()=> {
			this.setState({activeFeature: newFeature});
		};
	},

	render: function() {
		const metaData = {
			title: this.props.journalData.getIn(['journalData', 'journalName']) || 'PubPub',
		};
		// console.log(this.props);
		const componentsArray = this.props.journalData.getIn(['journalData', 'design', 'layoutString'])
			? JSON.parse(this.props.journalData.getIn(['journalData', 'design', 'layoutString']).replace(/(['"])?([:]?[a-zA-Z0-9_]+)(['"])?: /g, '"$2": ').replace(/'/g, '"'))
			: [];

		
		const journalID = this.props.journalData.getIn(['journalData', '_id']);
		
		return (
			<div style={styles.container}>

				<Helmet {...metaData} />

				{
					this.props.journalData.get('baseSubdomain') === null
						? <div>
							<div style={styles.top}>
								<h1 style={styles.topPub}>PubPub</h1>
								<div style={styles.subheader}>Open Publishing</div>
								<div key="showMeScience" style={styles.showMeScience} onClick={this.showMeScienceClick}><Link to={'/pub/' + this.props.journalData.getIn(['journalData', 'randomSlug'])}style={styles.scienceText}>Show Me Science</Link></div>
							</div>
							<div style={styles.search}>
								<Autocomplete 
									autocompleteKey={'landingSearch'} 
									route={'autocompletePubsAndUsers'} 
									placeholder="Search Pubs and People" 
									height={40}
									showBottomLine={false}
									hideResultsOnClickOut={false}
									resultRenderFunction={this.renderLandingSearchResults}
									loaderOffset={-20}
									padding={'10px 0px'}/>
							</div>
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
												return <img style={styles.featurePreviewImage} src={'http://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451416401/editing_hires_svywu2.gif'}/>;
											case 'discussions':
												return <img style={styles.featurePreviewImage} src={'http://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451416396/discussion_hires_jhdoga.gif'}/>;
											case 'history':
												return <img style={styles.featurePreviewImage} src={'http://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451416390/history_hires_ou47rn.gif'}/>;
											case 'journals':
												return <img style={styles.featurePreviewImage} src={'http://res.cloudinary.com/pubpub/image/upload/c_scale,w_600/v1451417712/outputjournal_qcdqyh.gif'}/>;
											default:
												return <img style={styles.featurePreviewImage} src={'http://i.imgur.com/X5ZSCJT.jpg'}/>;
											}
										})()}
									</div>

								</div>
								<div style={globalStyles.clearFix}></div>
							</div>

							<div style={styles.footer}>
								<span style={styles.footerItem} key={'footerItem' + 0}><Link to={'/pub/about'} style={globalStyles.link}>About PubPub</Link></span>
								<span style={styles.footerSeparator}>|</span>
								<span style={styles.footerItem} key={'footerItem' + 1}><a target="_blank" style={globalStyles.link} href="http://www.twitter.com/isPubPub">@isPubPub</a></span>
								<span style={styles.footerSeparator}>|</span>
								<span style={styles.footerItem} key={'footerItem' + 2}><a target="_blank" style={globalStyles.link} href="http://eepurl.com/bLkuVn">Stay up to date</a></span>
								<span style={styles.footerSeparator}>|</span>
								<span style={styles.footerItem} key={'footerItem' + 3}><a target="_blank" style={globalStyles.link} href="mailto:pubpub@media.mit.edu">Contact</a></span>
							 </div>
						</div>
							
						: <LandingBody componentsArray={componentsArray} journalID={journalID} journalData={this.props.journalData.get('journalData')} query={this.props.query} setQueryHandler={this.setQuery}/>
				}

			</div>
		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
		landingData: state.landing,
		path: state.router.location.pathname,
		query: state.router.location.query,
	};
})( Radium(Landing) );

styles = {
	container: {

		height: '100%',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: globalStyles.headerFont,
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			height: 'auto',
			overflow: 'hidden',
		},
	},
	top: {
		backgroundColor: globalStyles.headerText,
		overflow: 'hidden',
		height: 400
	},
	topPub: {
		fontWeight: 900,
		fontStyle: 'italic',
		textAlign: 'center',
		fontSize: '90px',
		margin: '30px 0px 0px 0px',
		color: globalStyles.headerBackground,

	},
	subheader: {
		color: globalStyles.headerBackground,
		textAlign: 'center',
		fontSize: '40px',
		margin: 0
	},
	showMeScience: {
		width: 250,
		height: 80,
		lineHeight: '80px',
		textAlign: 'center',
		fontSize: '22px',
		backgroundColor: globalStyles.headerBackground,
		margin: '80px auto',
		':active': {
			position: 'relative',
			top: '1px',
		},
	},
	scienceText: {
		textDecoration: 'none',
		color: globalStyles.headerText,
		width: '100%',
		height: '100%',
		display: 'block',
		':hover': {
			color: globalStyles.headerHover,
		},
	},
	search: {
		width: 'calc(100% - 60px)',
		padding: '10px 30px',
		backgroundColor: 'white',
		color: '#888',
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
		':hover': {
			color: globalStyles.sideHover,
		},
	},
	centerMedium: {
		fontSize: '20px',
		textAlign: 'center',
		fontFamily: globalStyles.headerFont,
		color: '#A8A8A8',
	},
	centerTitle: {
		fontSize: '40px',
		textAlign: 'center',
		fontFamily: globalStyles.headerFont,
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
	footer: {
		padding: '50px 0px',
		backgroundColor: globalStyles.headerBackground,
		color: globalStyles.headerText,
		fontSize: '18px',
		textAlign: 'center',
	},
	footerItem: {
		color: '#aaa',
		':hover': {
			color: '#fff',
		},
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'block',
			padding: '15px 0px',
		},
	},
	footerSeparator: {
		padding: '0px 30px',
		'@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
			display: 'none',
		}
	},


};
