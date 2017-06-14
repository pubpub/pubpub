import { ExportButton, bibtexToCSL } from '@pubpub/editor';
import React, { PropTypes } from 'react';

import { Link } from 'react-router';
import { PUBPUB_CONVERSION_URL } from 'configURLs';
import Radium from 'radium';
import RenderFile from 'components/RenderFile/RenderFile';
import dateFormat from 'dateformat';
import { globalStyles } from 'utils/globalStyles';
import { putDefaultFile } from './actionsFiles';

let styles;

export const PubContentFiles = React.createClass({
	propTypes: {
		version: PropTypes.object,
		pub: PropTypes.object,
		query: PropTypes.object,
	},

  getCurrentVersion: function(versions) {
    const query = this.props.location.query;
    return versions.sort((foo, bar)=> {
      // Sort so that most recent is first in array
      if (foo.createdAt > bar.createdAt) { return -1; }
      if (foo.createdAt < bar.createdAt) { return 1; }
      return 0;
    }).reduce((previous, current, index, array)=> {
      const previousDate = new Date(previous.createdAt).getTime();
      const currentDate = new Date(current.createdAt).getTime();

      if (!previous.id) { return current; } // If this is the first loop
      if (query.version === current.hash) { return current; } // If the query version matches current
      if (!query.version && currentDate > previousDate) { return current; }
      return previous;

    }, {});
  },

	render() {

    const pub = this.props.pub;
		const version = this.getCurrentVersion(pub.versions);
    const files = version.files;
		const authorNames = pub.contributors.map((contributor) => (contributor.user.firstName + contributor.user.lastName));

		const defaultFile = version.defaultFile;
		const mainFile = files.reduce((previous, current)=> {
			if (defaultFile === current.name) { return current; }
			if (!defaultFile && current.name.split('.')[0] === 'main') { return current; }
			return previous;
		}, files[0]);


		const bibtexFile = files.reduce((previous, current)=> {
			if (current.name === 'references.bib') { return current; }
			return previous;
		}, undefined);

		const localReferences = bibtexFile ? bibtexToCSL(bibtexFile.newContent || bibtexFile.content) : [];

		return (
			<div>

        {(mainFile.type === 'text/markdown') ?
          <ExportButton
            className="pt-icon-export"
            style= {styles.exportButton}
            title={pub.title}
            authors={authorNames}
            content={mainFile.content}
            allFiles={files}
            allReferences={localReferences}
            converterURL={PUBPUB_CONVERSION_URL}
            />
          : null
        }
			</div>
		);
	},

});

export default Radium(PubContentFiles);

styles = {
  exportButton: {
    height: 24,
    minHeight: 24,
    lineHeight: '24px',
    marginBottom: 15,
  }
};
