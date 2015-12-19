import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {Autocomplete} from '../';
import {globalStyles} from '../../utils/styleConstants';
import {LandingBody} from '../../components';
import { Link } from 'react-router';
const HoverLink = Radium(Link);

let styles = {};

const Landing = React.createClass({
	propTypes: {
		journalData: PropTypes.object,
		landingData: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
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

	render: function() {

		const metaData = {
			title: 'PubPub'
		};
		const componentsArray = JSON.parse(this.props.journalData.getIn(['journalData', 'design', 'layoutString']).replace(/(['"])?([a-zA-Z0-9_]+)(['"])?: /g, '"$2": ').replace(/'/g, '"'));
		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />

				{
					this.props.journalData.get('baseSubdomain') === null
						? null
						: <LandingBody componentsArray={componentsArray}/>
				}

				<div style={styles.top}>
					<h1 style={styles.topPub}>PubPub</h1>
					<h2 style={styles.subheader}>Open Publishing</h2>
					<div key="showMeScience" style={styles.showMeScience}><Link style={styles.scienceText} to={'/pub/sample'}>Show Me Science</Link></div>
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
						<p>PubPub explores the relationship between multiculturalism and romance tourism.</p>
						<p>With influences as diverse as Munch and Miles Davis, new tensions are distilled from both opaque and transparent discourse.</p>
						<p>Ever since I was a teenager I have been fascinated by the ephemeral nature of meaning. What starts out as contemplation soon becomes finessed into a cacophony of lust, leaving only a sense of failing and the dawn of a new understanding.</p>
						<p>As momentary forms become clarified through studious and critical practice, the viewer is left with an epitaph for the possibilities of our existence.</p>
					</div>
				</div>

			</div>
		);
	}

});

export default connect( state => {
	return {
		journalData: state.journal,
		landingData: state.landing
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
		maxWidth: 800,
		padding: 20,
		margin: '60px auto',
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

};
