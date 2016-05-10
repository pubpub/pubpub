import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {Markdown, SelectionPopup, Reference, License} from 'components';
import ResizingText from 'utils/ResizingText';

import {globalMessages} from 'utils/globalMessages';
import {parsePluginString} from 'utils/parsePlugins';

import {FormattedMessage} from 'react-intl';

let styles = {};

const PubBody = React.createClass({
	propTypes: {
		status: PropTypes.string,
		isPublished: PropTypes.bool,
		isPage: PropTypes.bool,
		markdown: PropTypes.string,
		pubURL: PropTypes.string,
		addSelectionHandler: PropTypes.func,
		styleScoped: PropTypes.string,
		showPubHighlights: PropTypes.bool,
		isFeatured: PropTypes.bool,
		errorView: PropTypes.bool,
		minFont: PropTypes.number,
		maxFont: PropTypes.number,
		showPubHighlightsComments: PropTypes.bool,
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


	render: function() {

		return (
			<div style={styles.container}>

				<div id={this.props.isPage ? 'pageContent' : 'pubContent'} style={[styles.contentContainer, globalStyles[this.props.status]]} >
					<div id="pub-wrapper">
						{!this.props.isFeatured && !this.props.errorView && !this.props.isPage
							? <div style={styles.submittedNotification}>This Pub has been submitted to - but is not yet featured in - this journal.</div>
							: null
						}

						<header>
						</header>

						<div id="pubBodyContent">

							{this.props.pubURL ?
								<div className="onlineURL">This publication can be found online at {this.props.pubURL}. </div>
							: null}

							<Markdown markdown={this.props.markdown} isPage={this.props.isPage}/>

						</div>


						<footer>
							{this.props.isFeatured && !this.props.errorView && this.props.isPublished && !this.props.isPage
								? <div id="pub-license"><License /></div>
								: null
							}
						</footer>

					</div>


				</div>

			</div>
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
