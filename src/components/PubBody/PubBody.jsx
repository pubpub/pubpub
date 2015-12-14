import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {PubSelectionPopup} from '../';
import {globalStyles} from '../../utils/styleConstants';
import { Link } from 'react-router';
import {loadCss} from '../../utils/loadingFunctions';
import {scienceStyle, magazineStyle} from './pubStyles';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		title: PropTypes.string,
		abstract: PropTypes.string,
		htmlTree: PropTypes.array,
		authors: PropTypes.array,
		addSelectionHandler: PropTypes.func,
		style: PropTypes.object,
	},
	getDefaultProps: function() {
		return {
			htmlTree: [],
			authors: [],
			style: {
				type: 'science',
				googleFontURL: 'https://fonts.googleapis.com/css?family=Open+Sans|Indie+Flower',
				cssObject: {
					'#pub-title': {
						color: 'red',
					},
					'h1': {
						fontFamily: 'Indie Flower',
						color: 'blue',
					},
					'p': {
						fontFamily: 'Indie Flower',
						color: 'green',
					}
				},
			},
		};
	},

	getInitialState() {
		return {
			htmlTree: [],
			TOC: [],
		};
	},

	componentDidMount() {
		loadCss(this.props.style.googleFontURL);
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.style.googleFontURL !== nextProps.style.googleFontURL) {
			console.log('load new fonts!');
			loadCss(nextProps.style.googleFontURL);
		}
	},

	compileStyleRules: function() {
		// console.log('compiling rules');
		
		let cssObject = {};
		switch (this.props.style.type) {
		case 'science':
			cssObject = scienceStyle;
			break;
		case 'magazine': 
			cssObject = magazineStyle;
			break;
		case 'custom': 
			cssObject = this.props.style.cssObject;
			break;
		default: 
			cssObject = scienceStyle;
			break;
		}
		// console.log(cssObject);
		const pubContentRules = {};
		Object.keys(cssObject).map((cssRule)=> {
			cssRule.split(',').map((splitRule)=> {
				pubContentRules['#pubContent ' + splitRule] = cssObject[cssRule];
			});
			
			// console.log(pubContentRules);
		});

		return ({
			...pubContentRules, 
			'.marking': {
				backgroundColor: 'rgba(124, 235, 124, 0.7)',
			},
			'.tempHighlight': {
				backgroundColor: 'rgba(200,200,200, 0.7)',
			},
			'.selection': {
				backgroundColor: 'rgba(195, 245, 185, 0.7)',
			},
		});
	},

	render: function() {
		// console.log(this.props.htmlTree);
		return (
			<div style={styles.container}>

				<Style rules={this.compileStyleRules()}/>

				<div id="pubContent" style={[styles.contentContainer, styles[this.props.status]]}>

					<div id={'pub-title'} style={styles.pubTitle}>{this.props.title}</div>
					<div id={'pub-authors'} style={styles.authors}> <span>by </span>
						{
							this.props.authors.map((author, index)=>{
								return (index === this.props.authors.length - 1
									? <Link to={'/profile/' + author.username} key={'pubAuthorLink-' + index} style={globalStyles.link}><span key={'pubAuthor-' + index} className={'pub-author'} style={styles.author}>{author.name}</span></Link>
									: <Link to={'/profile/' + author.username} key={'pubAuthorLink-' + index} style={globalStyles.link}><span key={'pubAuthor-' + index} className={'pub-author'} style={styles.author}>{author.name}, </span></Link>);
							})
						}
					</div>
					<div id={'pub-abstract'} style={styles.pubAbstract}>{this.props.abstract}</div>
					<div id={'pub-header-divider'} style={styles.headerDivider}></div>

					<div id="pubBodyContent">
						{this.props.addSelectionHandler
							? <PubSelectionPopup addSelectionHandler={this.props.addSelectionHandler}/>
							: null
						}
						
						{this.props.htmlTree}
					</div>

				</div>

			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		overflow: 'hidden',
		borderRadius: 1,
		// minHeight: 'calc(100vh - 2 * ' + globalStyles.headerHeight + ' + 2px)',
	},
	contentContainer: {
		transition: '.3s linear opacity .25s',
		padding: '0px 10px',
	},
	loading: {
		opacity: 0,
	},
	loaded: {
		opacity: 1
	},
	// pubTitle: {
	// 	textAlign: 'center',
	// 	fontSize: '40px',
	// 	margin: '50px 0px',
	// },
	// pubAbstract: {
	// 	textAlign: 'center',
	// 	color: '#777',
	// 	margin: '30px 0px',
	// },
	// headerDivider: {
	// 	height: 1,
	// 	width: '80%',
	// 	margin: '0 auto',
	// 	backgroundColor: '#DDD',
	// },
	// authors: {
	// 	textAlign: 'center',
	// 	color: '#555',
	// 	fontSize: '17px',
	// 	padding: '0px 50px',
	// },
	// author: {
	// 	color: '#555',
	// 	':hover': {
	// 		color: '#111',
	// 	},

	// },

};

export default Radium(PubBody);
