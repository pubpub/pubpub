import React, { PropTypes } from 'react';

import LayoutPubsList from './LayoutPubsList';
import LayoutSinglePub from './LayoutSinglePub'
import jsx from 'jsx-transform';

const getSinglePub =  function({journal, slug}) {
  const pubFeatures = journal.pubFeatures;
  const pub = pubFeatures.find((pubFeature) => (pubFeature.pub.slug === slug));
  return pub.pub;
};


const LayoutRenderer = React.createClass({
  getInitialState: function() {
    return {
      elem: null
    };
  },

  componentDidMount: function() {
    const {content, journal} = this.props;
    if (content && journal) {
      this.renderContent(content, journal);
    }
  },

  getSinglePub: function(slug) {
    const journal = this.props.journal;
    const pubFeatures = journal.pubFeatures;
    const pub = pubFeatures.find((pubFeature) => (pubFeature.pub.slug === slug));
    return pub.pub;
  },
  renderContent: function(content, journal) {
      try {
        const PubsList = (props) => {
          return (<div>
            <LayoutPubsList journal={journal} {...props}/>
            </div>
          );
        }

        const Pub = (props) => {
          const slug = props.slug;
          const pub = this.getSinglePub({journal, slug});
          return (<div>
              <LayoutSinglePub journal={journal} pub={pub} {...props}/>
            </div>
          );
        }

        const createElem = React.createElement;
        const compiled = jsx.fromString(content, {
          factory: 'createElem'
        });
        const elem = eval(compiled);
        this.setState({elem});
      } catch (err) {

      }
  },
	componentWillReceiveProps: function(nextProps) {
    if (this.props.content !== nextProps.content) {
      this.renderContent(nextProps.content);
    }
	},
  render() {
    const { elem } = this.state;
    return (<div>{elem}</div>)
  }

});

export default LayoutRenderer;
