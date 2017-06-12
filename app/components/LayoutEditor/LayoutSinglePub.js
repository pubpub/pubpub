import React, { PropTypes } from 'react';

import AuthorString from 'components/AuthorString/AuthorString'
import Link from 'components/Link/Link';
import dateFormat from 'dateformat';

let styles = {};

const SinglePub = ({ pub, showPreview, showAuthor=true, showFeatureDate=false, journal, pubFeature, pubStyle="preview", size=150 }) => {

  const labels = pub.labels || [];
  const authorString = (pub && pub.contributors);

  if (pubStyle === 'preview') {
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
            {(pubFeature && showFeatureDate) ? <p>Featured on {dateFormat(pubFeature.updatedAt, 'mmmm dd, yyyy')}</p> : null }
            {(showAuthor) ? <AuthorString contributors={pub.contributors}/> : null }
          </div>
        </div>
      </div>
    );
  } else if (pubStyle === 'magazine') {
    return (

      <div style={styles.featureWrapper}>
        <div style={styles.featureTable}>
          <div style={{width: size}}>
              <Link to={{ pathname: '/pub/' + pub.slug, query: { context: journal.slug } }}>
                <img src={pub.avatar} style={styles.sizeImage} />
              </Link>
              <h2 style={styles.magazineDescription}><Link to={{ pathname: '/pub/' + pub.slug, query: { context: journal.slug } }}>{pub.title}</Link></h2>
          </div>
        </div>
      </div>

    );
  }

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
  magazineDescription: {
    padding: '0.3em 0.15em',
    textAlign: 'center',
    lineHeight: 1.25,
  },
  sizeImage: {
    width: '100%',
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
