import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';

import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';

import { NonIdealState } from '@blueprintjs/core';
import { PreviewPub } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const JournalPage = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		page: PropTypes.object,
	},

	render() {
		const journal = this.props.journal || {};
		const page = this.props.page || {};
		const pageText = page.description || '';

		const pubFeatures = journal.pubFeatures || [];
		const pubs = pubFeatures.filter((pubFeature)=> {
			const pub = pubFeature.pub || {};
			const labels = pub.labels || [];
			return labels.reduce((previous, current)=> {
				if (current.journalId === journal.id && current.slug === page.slug) { return true; }
				return previous;
			}, false);
		});

		return (
			<div style={styles.container}>
				<h2 style={styles.pageHeader}>{page.title}</h2>

				<div className={'journal-page-content'}>
					<ReactMarkdown source={pageText} />
					{/*<MDReactComponent 
						text={pageText}
						markdownOptions={{
							html: false,
							typographer: true,
							linkify: true,
						}}
						plugins={[sub, sup]} /> */}
				</div>

				{!pubs.length && !page.description &&
					<NonIdealState
						description={'Pubs have not yet been added into this page.'}
						title={'Empty Page'}
						visual={'application'} />
				}

				{page.description &&
					<h2 style={styles.pubsHeader}>Pubs</h2>
				}
				{pubs.map((pubFeature, index)=> {
					return <PreviewPub key={'pageItem-' + index} pub={pubFeature.pub} />;
				})}

			</div>
		);
	}
});

export default Radium(JournalPage);

styles = {
	container: {
		
	},
	buttonLink: {
		textDecoration: 'none',
	},
	pageHeader: {
		paddingBottom: '1em',
	},
	pubsHeader: {
		margin: '1em 0em 0em',
		padding: '1em 0em',
		borderTop: '1px solid #F3F3F4',
	},
};
