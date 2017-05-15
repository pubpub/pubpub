import React, { PropTypes } from 'react';

import LayoutPubsList from './LayoutPubsList';
import LayoutSinglePub from './LayoutSinglePub'
import jsx from 'jsx-transform';

const getSinglePub =  function({journal, slug}) {
  const pubFeatures = journal.pubFeatures;
  const pub = pubFeatures.find((pubFeature) => (pubFeature.pub.slug === slug));
  return pub.pub;
};

const LayoutRenderer = ({content, journal}) => {

  const PubsList = (props) => {
    return (<div>
      <LayoutPubsList journal={this.props.journal} {...props}/>
      </div>
    );
  }

  const Pub = (props) => {
    const slug = props.slug;
    const pub = this.getSinglePub({journal, slug});
    return (<div>
        <LayoutSinglePub journal={this.props.journal} pub={pub} {...props}/>
      </div>
    );
  }

  const createElem = React.createElement;
  const compiled = jsx.fromString(content, {
    factory: 'createElem'
  });
  const elem = eval(compiled);
  return (<div>{elem}</div>);
};


export default LayoutRenderer;
