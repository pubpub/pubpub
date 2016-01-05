import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {PubSelectionPopup} from '../';
import {globalStyles} from '../../utils/styleConstants';
import {Reference} from '../';
import { Link } from 'react-router';
import {loadCss} from '../../utils/loadingFunctions';
import {scienceStyle, magazineStyle} from './pubStyles';
import cssConvert from '../../utils/cssToRadium';
// import ResizingText from './ResizingText';
import dateFormat from 'dateformat';

import {globalMessages} from '../../utils/globalMessages';
import {FormattedMessage} from 'react-intl';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		title: PropTypes.string,
		abstract: PropTypes.string,
		authorsNote: PropTypes.string,
		htmlTree: PropTypes.array,
		authors: PropTypes.array,
		addSelectionHandler: PropTypes.func,
		style: PropTypes.object,
		showPubHighlights: PropTypes.bool,
		references: PropTypes.array,
		minFont: PropTypes.number,
		firstPublishedDate: PropTypes.string,
		lastPublishedDate: PropTypes.string
	},
	getDefaultProps: function() {
		return {
			htmlTree: [],
			authors: [],
			style: {
				type: 'science',
				googleFontURL: undefined,
				cssObjectString: {},
			},
		};
	},

	statics: {
		printStyles: {

		}
	},

	getInitialState() {
		return {
			htmlTree: [],
			TOC: []
		};
	},

	componentDidMount() {
		loadCss(this.props.style.googleFontURL);
	},

	componentWillReceiveProps(nextProps) {
		if (this.props.style.googleFontURL !== nextProps.style.googleFontURL) {
			// console.log('load new fonts!');
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
			const objectString = this.props.style.cssObjectString || '';
			cssObject = cssConvert(objectString);
			// console.log('cssObject', cssObject);
			break;
		default:
			cssObject = scienceStyle;
			break;
		}

		const defaultContentRules = {};
		Object.keys(scienceStyle).map((cssRule)=> {
			cssRule.split(',').map((splitRule)=> {
				defaultContentRules['#pubContent ' + splitRule.replace(/ /g, '')] = scienceStyle[cssRule];
			});
		});

		const pubContentRules = {};
		Object.keys(cssObject).map((cssRule)=> {
			cssRule.split(',').map((splitRule)=> {
				pubContentRules['#pubContent ' + splitRule.replace(/ /g, '')] = cssObject[cssRule];
			});
		});

		return ({
			...defaultContentRules,
			...pubContentRules,
			'.marking': {
				backgroundColor: 'rgba(124, 235, 124, 0.7)',
			},
			'.tempHighlight': {
				backgroundColor: 'rgba(200,200,200, 0.7)',
			},
			'.selection': {
				backgroundColor: this.props.showPubHighlights ? 'rgba(195, 245, 185, 0.6)' : 'rgba(195, 245, 185, 0.0)',
				cursor: this.props.showPubHighlights ? 'pointer' : 'text',
			},
			'.selection-active': {
				backgroundColor: 'rgba(78, 164, 61, 0.6)',
			},
		});
	},

	render: function() {
		return (
			// <ResizingText fontRatio={60} minFont={this.props.minFont}>

			<div style={styles.container}>

				<Style rules={this.compileStyleRules()}/>

				<div id="pubContent" style={[styles.contentContainer, globalStyles[this.props.status]]} className={this.printStyleClass.pubContent}>
					{this.props.authorsNote
						? <div id={'pub-authorsNote'} className={this.printStyleClass.authorsNote}>{this.props.authorsNote}</div>
						: null
					}
					
					<div id={'pub-title'} className={this.printStyleClass.title}>{this.props.title}</div>
					<div id={'pub-authors'} className={this.printStyleClass.authors} style={[this.props.authors.length === 0 && {display: 'none'}]}> 
						<span><FormattedMessage {...globalMessages.by}/> </span>
						{
							this.props.authors.map((author, index)=>{
								return (index === this.props.authors.length - 1
									? <Link to={'/user/' + author.username} key={'pubAuthorLink-' + index} style={globalStyles.link}><span key={'pubAuthor-' + index} className={'pub-author'}>{author.name}</span></Link>
									: <Link to={'/user/' + author.username} key={'pubAuthorLink-' + index} style={globalStyles.link}><span key={'pubAuthor-' + index} className={'pub-author'}>{author.name}, </span></Link>);
							})
						}
					</div>

					{this.props.firstPublishedDate !== this.props.lastPublishedDate
						? <div id={'pub-dates'} className={this.printStyleClass.dates}>
							<span><FormattedMessage {...globalMessages.firstPublished}/> </span>
							{dateFormat(this.props.firstPublishedDate, 'mm/dd/yy')}
							<span style={styles.dateSeparator}>|</span>
							<span><FormattedMessage {...globalMessages.lastPublished}/> </span>
							{dateFormat(this.props.lastPublishedDate, 'mm/dd/yy')}
						</div>
						: <div id={'pub-dates'} className={this.printStyleClass.dates} style={[this.props.firstPublishedDate === undefined && {display: 'none'}]}>
							<span><FormattedMessage {...globalMessages.published}/> </span>
							{dateFormat(this.props.firstPublishedDate, 'mm/dd/yy')}
						</div>
					}

					<div id={'pub-abstract'}>{this.props.abstract}</div>
					<div id={'pub-header-divider'}></div>

					<div id="pubBodyContent">
						{/* For Highlights to work, no divs can be placed before htmlTree */}
						{this.props.htmlTree}

						{this.props.addSelectionHandler
							? <PubSelectionPopup addSelectionHandler={this.props.addSelectionHandler}/>
							: null
						}

					</div>
					{this.props.references && this.props.references.length
						? <div id={'pub-references'}>
							<h1><FormattedMessage {...globalMessages.references}/></h1>

							{
								this.props.references.map((reference, index)=>{
									return (
										<div key={'pubReference-' + index} className={'pub-reference'}>
											<span style={styles.referenceNumber}>[{index + 1}]</span>
											<Reference citationObject={reference} mode={'mla'} />
										</div>
									);
								})
							}

						</div>
						: null
					}

				</div>

			</div>
			// </ResizingText>
		);
	}
});


styles = {
	container: {
		width: '100%',
		// overflow: 'hidden',
		borderRadius: 1,
		// minHeight: 'calc(100vh - 2 * ' + globalStyles.headerHeight + ' + 2px)',
	},
	contentContainer: {
		transition: '.3s linear opacity .25s',
		padding: '0px 10px 50px 10px',
		fontFamily: globalStyles.headerFont,
	},
	loading: {
		opacity: 0,
	},
	loaded: {
		opacity: 1
	},
	dateSeparator: {
		padding: '0px 10px',
	},
	referenceNumber: {
		color: '#222',
		paddingRight: '10px',
		fontSize: '14px',
	},

};

export default Radium(PubBody);
