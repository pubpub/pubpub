import React, {PropTypes} from 'react';
import Radium, {Style} from 'radium';
import {globalStyles} from 'utils/styleConstants';
import {Markdown, SelectionPopup, Reference, License} from 'components';
import ResizingText from 'utils/ResizingText';

import {globalMessages} from 'utils/globalMessages';
import {parsePluginString} from 'utils/parsePlugins';

import {FormattedMessage} from 'react-intl';

let styles = {};

const PubBodyRSS = React.createClass({
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
	},
	getDefaultProps: function() {
		return {
		};
	},

	getInitialState() {
		return {
		};
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

						<div id="pubBodyContent"> {/* Highlights are dependent on the id 'pubBodyContent' */}
							<Markdown mode="rss" markdown={this.props.markdown} isPage={this.props.isPage}/>
						</div>

						{this.props.isFeatured && !this.props.errorView && this.props.isPublished && !this.props.isPage
							? <div id="pub-license"><License /></div>
							: null
						}
					</div>
				</div>

			</div>
		);
	}
});


styles = {
	container: {
		width: '100%',
		borderRadius: 1,
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
	submittedNotification: {
		backgroundColor: '#373737',
		textAlign: 'center',
		fontSize: '18px',
		padding: '15px',
		margin: '5px',
		color: 'white',
	},

};

export default Radium(PubBodyRSS);
