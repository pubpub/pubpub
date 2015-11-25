import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import Radium from 'radium';
import DocumentMeta from 'react-document-meta';
import {Autocomplete} from '../';
import { Link } from 'react-router';
import {globalStyles} from '../../utils/styleConstants';


let styles = {};

const Landing = React.createClass({
	propTypes: {
		landingData: PropTypes.object,
		dispatch: PropTypes.func
	},

	statics: {
		// fetchData: function(getState, dispatch) {
		// 	return dispatch(getProjects());
		// }
	},

	renderLandingSearchResults: function(results) {
		return (
			<div style={styles.results}>
				{

					results.map((item, index)=>{
						return (<div key={'collabSearchUser-' + index} style={styles.result}>
							
							<div style={styles.imageWrapper}>
								<img style={styles.image} src={item.thumbnail} />
							</div>
							<div style={styles.name}>{item.name}</div>
							<div style={styles.name}>{item.title}</div>

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


		return (
			<div style={styles.container}>

				<DocumentMeta {...metaData} />
				<div style={styles.top}>
					<h1 style={styles.topPub}>PubPub</h1>
					<h2 style={styles.subheader}>Open Publishing</h2>
					<div key="showMeScience" style={styles.showMeScience}><Link style={styles.scienceText} to={'/pub/fake'}>Show Me Science</Link></div>
				</div>
				<div style={styles.search}>
					<Autocomplete 
						autocompleteKey={'landingSearch'} 
						route={'autocompletePubsAndUsers'} 
						placeholder="Search Pubs and People" 
						height={40}
						showBottomLine={false}
						hideResultsOnClickOut={false}
						resultRenderFunction={this.renderLandingSearchResults}/>
				</div>
				<div style={styles.lower}>
					<div style={styles.textDark}>
						<p>PubPub explores the relationship between multiculturalism and romance tourism.</p>
						<p>With influences as diverse as Munch and Miles Davis, new tensions are distilled from both opaque and transparent discourse.</p>
						<p>Ever since I was a teenager I have been fascinated by the ephemeral nature of meaning. What starts out as contemplation soon becomes finessed into a cacophony of lust, leaving only a sense of failing and the dawn of a new understanding.</p>
						<p>As momentary forms become clarified through studious and critical practice, the viewer is left with an epitaph for the possibilities of our existence.</p>
					</div>
				</div>
				{/*
				<div>
					<h2 style={styles.text}>Landing</h2>
					<Link to={`/subdomain`}> subdomain </Link> | 
					<Link to={`/pub/cat/edit`}> edit </Link> | 
					<Link to={`/explore`}> explore </Link> | 
					<Link to={`/profile/istravis`}> profile </Link> | 
					<Link to={`/pub/cat`}> reader </Link> | 
				</div>
				*/}
				

			</div>
		);
	}

});

export default connect( state => {
	return {landingData: state.landing};
})( Radium(Landing) );

styles = {
	container: {

		height: '100%',
		overflow: 'hidden',
		overflowY: 'scroll',
		fontFamily: globalStyles.headerFont,
		'@media screen and (min-resolution: 3dppx), (max-width: 767px)': {
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
		padding: '20px 0px 20px 30px',
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
	}


};
