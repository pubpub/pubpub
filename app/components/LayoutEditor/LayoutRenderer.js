import React, { PropTypes } from 'react';

import LayoutPubsList from './LayoutPubsList';
import LayoutSinglePub from './LayoutSinglePub'
import jsx from 'jsx-transform';

const LayoutRenderer = React.createClass({
  getInitialState: function() {
    this.hasError = false;
    this.errorTimeout = null;
    return {
      elem: null
    };
  },

  componentDidMount: function() {
    const { content, journal } = this.props;
    if (content && journal) {
      this.renderContent(content, journal);
    }
  },

  getSinglePub: function({slug, journal}) {
    const pubFeatures = journal.pubFeatures;
    const pub = pubFeatures.find((pubFeature) => (pubFeature.pub.slug === slug));
    if (pub) {
      return pub.pub;
    } else {
      return null;
    }  },
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
        this.setState({elem, err: null});
        this.hasError = false;
      } catch (err) {
        if (!this.state.elem) {
          this.setState({err: null});
        }
        this.hasError = true;
        if (this.errorTimeout) {
          window.clearTimeout(this.errorTimeout);
        }
        this.errorTimeout = window.setTimeout(this.checkError, 1000);
        console.log('Got err!', err);
      }
  },
  checkError: function() {
    if (this.hasError) {
      this.errorTimeout = null;
      this.setState({ err: true });
    }
  },
	componentWillReceiveProps: function(nextProps) {
    if (this.props.content !== nextProps.content) {
      this.renderContent(nextProps.content, nextProps.journal);
    }
	},
  render() {
    const { elem, err } = this.state;
    return (<div>
      {(err) ?
        <div className="pt-callout pt-intent-danger" style={{marginBottom: '20px'}}>
          <h5>Error</h5>
          The current HTML isn't valid, please fix it before saving.
        </div>
        : null}
      {elem}
    </div>)
  }

});

export default LayoutRenderer;
