import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { NonIdealState } from '@blueprintjs/core';
import { PreviewPub } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const JournalPage = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		page: PropTypes.string,
	},

	render() {
		const journal = this.props.journal || {};
		const page = this.props.page || '';
		const pubFeatures = journal.pubFeatures || [];
		const pubs = pubFeatures.filter((pubFeature)=> {
			const pub = pubFeature.pub || {};
			const labels = pub.labels || [];
			return labels.reduce((previous, current)=> {
				if (current.journalId === journal.id && current.title === page) { return true; }
				return previous;
			}, false);
		});
		return (
			<div style={styles.container}>
				<h2>{page}</h2>
				<p>{page.description}</p>
				{!pubs.length &&
					<NonIdealState
						description={'Pubs have not yet been added into this page.'}
						title={'Empty Page'}
						visual={'application'} />
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
};
