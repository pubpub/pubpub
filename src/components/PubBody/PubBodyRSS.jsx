import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {IntlProvider} from 'react-intl';
import dateFormat from 'dateformat';

import {globalStyles} from 'utils/styleConstants';
import {parsePluginString} from 'utils/parsePlugins';
import ResizingText from 'utils/ResizingText';
import {globalMessages} from 'utils/globalMessages';

import {Markdown, SelectionPopup, Reference, License} from 'components';


import {FormattedMessage} from 'react-intl';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		isPublished: PropTypes.bool,
		isPage: PropTypes.bool,
		markdown: PropTypes.string,
		pubURL: PropTypes.string,
		isFeatured: PropTypes.bool,
		errorView: PropTypes.bool,
		discussionCount: PropTypes.number,
	},
	getDefaultProps: function() {
		return {
		};
	},

	getInitialState() {
		return {
		};
	},

	componentDidMount() {
	},

	componentWillReceiveProps(nextProps) {
	},

	findFirstImage: function(markdown) {
		const imageRegex = /\[\[{"pluginType":"image".*?\]\]/g;
		const matches = markdown.match(imageRegex);
		if (matches && matches.length > 0) {
			const images = matches.map((match) => parsePluginString(match)).filter((image) => (!!image.source && !!image.source.url));
			if (images.length > 0 && images[0].source.url) {
				return images[0].source.url;
			}
			return null;
		}
		return null;
	},


	render: function() {

		return (
			<html lang="en" prefix="op: http://media.facebook.com/op#">
				 <head>
					 	<meta charSet="utf-8"/>
					 	<link rel="canonical" href={this.props.pubURL}/>
					 	<meta property="op:markup_version" content="v1.0"/>
						<meta property="og:title" content={this.props.title}/>
						<meta property="og:description" content={this.props.abstract}/>
						<meta property="og:image" content={this.findFirstImage(this.props.markdown) || 'https://pbs.twimg.com/profile_images/718534268373311489/nP5WoROK.jpg'}/>
						<meta property="fb:pages" content="228105957546675" />


				 </head>
				 <body>
				 <article>

						<header>
							<h1>{this.props.title}</h1>
							<address>{this.props.authorString}</address>
							{(this.props.abstract) ? <h2>{this.props.abstract}</h2> : null }
							{ /*
								(this.props.discussionCount > 0) ? <h3 className="op-kicker">{this.props.discussionCount} comments. <a href={this.props.pubURL}>Click here to read and participate</a></h3> : null
							*/ }
							<time className="op-published" dateTime={dateFormat(this.props.firstPublishedDate, "isoDateTime")}>{dateFormat(this.props.firstPublishedDate, "fullDate")}</time>
	 					 	<time className="op-modified"  dateTime={dateFormat(this.props.lastPublishedDate, "isoDateTime")}>{dateFormat(this.props.lastPublishedDate, "fullDate")}</time>
						</header>

					 {!this.props.isFeatured && !this.props.errorView && !this.props.isPage
						 ? <div style={styles.submittedNotification}>This Pub has been submitted to - but is not yet featured in - this journal.</div>
						 : null
					 }

					 <Markdown mode="rss" markdown={this.props.markdown} isPage={this.props.isPage}/>
				 <footer>
					 {this.props.isFeatured && !this.props.errorView && this.props.isPublished && !this.props.isPage
						 ? <div id="pub-license"><License /></div>
						 : null
					 }
				 </footer>

			 </article>
			 </body>
	 </html>
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
		// transition: '.3s linear opacity .25s',
		// padding: '0px 4em 50px',
		// fontFamily: globalStyles.headerFont,
		// lineHeight: '1.58',
		// textRendering: 'optimizeLegibility',
		// WebkitFontSmoothing: 'antialiased',
		// '@media screen and (min-resolution: 3dppx), screen and (max-width: 767px)': {
		// 	padding: '0px 1em 50px',
		// },
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
	// referenceNumber: {
	// 	color: '#222',
	// 	paddingRight: '10px',
	// 	fontSize: '1em',
	// },
	footNote: {
		color: '#222',
		paddingRight: '10px',
		fontSize: '0.75em',
		cursor: 'pointer',
	},
	footnoteHeader: {
		marginBottom: '0px',
		paddingBottom: '0px',
	},
	submittedNotification: {
		backgroundColor: '#373737',
		textAlign: 'center',
		fontSize: '18px',
		padding: '15px',
		margin: '5px',
		color: 'white',
	},

};

export default Radium(PubBody);
