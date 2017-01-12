import React, { PropTypes } from 'react';
import Radium from 'radium';
import { Link } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { NonIdealState } from '@blueprintjs/core';
import { PreviewPub } from 'components';

import { globalMessages } from 'utils/globalMessages';
import { FormattedMessage } from 'react-intl';


let styles;

export const JournalCollection = React.createClass({
	propTypes: {
		journal: PropTypes.object,
		collection: PropTypes.string,
	},

	render() {
		const journal = this.props.journal || {};
		const collection = this.props.collection || '';
		const pubFeatures = journal.pubFeatures || [];
		const pubs = pubFeatures.filter((pubFeature)=> {
			const pub = pubFeature.pub || {};
			const labels = pub.labels || [];
			return labels.reduce((previous, current)=> {
				if (current.journalId === journal.id && current.title === collection) { return true; }
				return previous;
			}, false);
		});
		return (
			<div style={styles.container}>
				<h2>{collection}</h2>
				<p>{collection.description}</p>
				{!pubs.length &&
					<NonIdealState
						description={'Pubs have not yet been added into this collection.'}
						title={'Empty Collection'}
						visual={'application'} />
				}

				{pubs.map((pubFeature, index)=> {
					return <PreviewPub key={'collectionItem-' + index} pub={pubFeature.pub} />;
				})}

			</div>
		);
	}
});

export default Radium(JournalCollection);

styles = {
	container: {
		
	},
	buttonLink: {
		textDecoration: 'none',
	},
};
