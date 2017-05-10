import React, { PropTypes } from 'react';

import Link from 'components/Link/Link';
import dateFormat from 'dateformat';

let styles = {};

const SinglePub = ({ pub, showPreview, journal, pubFeature }) => {


  const labels = pub.labels || [];

  return (
    <div style={styles.featureWrapper}>
      <div style={styles.featureTable}>
        {(showPreview) ?
        <div style={styles.imageWrapper}>
            <Link to={{ pathname: '/pub/' + pub.slug, query: { context: journal.slug } }}>
              <img src={pub.avatar} style={styles.featureImage} />
            </Link>
        </div>
        : null
        }
        <div style={styles.featureDetails}>
          <h4><Link to={{ pathname: '/pub/' + pub.slug, query: { context: journal.slug } }}>{pub.title}</Link></h4>
          <p>{pub.description}</p>
          {(pubFeature) ? <p>Featured on {dateFormat(pubFeature.updatedAt, 'mmmm dd, yyyy')}</p> : null }
        </div>
      </div>
    </div>
  );
}

export default SinglePub;

styles = {
	featureWrapper: {
		// padding: '0em 0em 1em',
		margin: '0em 0em 1em 0em',
		borderBottom: '1px solid #CCC',
	},
	featureTable: {
		display: 'table',
		width: '100%',
	},
	imageWrapper: {
		display: 'table-cell',
		width: '100px',
	},
	featureImage: {
		width: '100px',
		paddingRight: '1em',
	},
	featureDetails: {
		display: 'table-cell',
		verticalAlign: 'top',
	},
	buttons: {
		display: 'table-cell',
		width: '1%',
	},
};
