import React, { PropTypes } from 'react';

import { CodeEditor }  from '@pubpub/editor';
import LayoutPubsList from './LayoutPubsList';
import LayoutSinglePub from './LayoutSinglePub'
import jsx from 'jsx-transform';

const LayoutEditor = React.createClass({
  getInitialState: function() {
    return {
      mode: 'edit'
    };
  },

  getSinglePub: function(slug) {
    const journal = this.props.journalData.journal;
    const pubFeatures = journal.pubFeatures;
    const pub = pubFeatures.find((pubFeature) => (pubFeature.pub.slug === slug));
    return pub.pub;
  },
	onChange: function(codeContent) {
    try {
      const createElem = React.createElement;

      const PubsList = (props) => {
        return (<div>
          <LayoutPubsList journal={this.props.journalData.journal} {...props}/>
          </div>
        );
      }

      const Pub = (props) => {
        const slug = props.slug;
        const pub = this.getSinglePub(slug);
        return (<div>
            <LayoutSinglePub journal={this.props.journalData.journal} pub={pub} {...props}/>
          </div>
        );
      }


      const compiled = jsx.fromString(codeContent, {
        factory: 'createElem'
      });
      const elem = eval(compiled);
      this.setState({elem});
    } catch (err) {
      console.log(err);
    }
	},


  handleEditModeChange: function(mode) {
    this.setState({mode});
  },

	render: function() {
    const { elem, mode } = this.state;
    const { journalData } = this.props;

    const DisplayElem = elem;

		return (
      <div>

        <div className={'pt-card pt-elevation-3'} style={{ padding: '0em', margin: '0em 0em 2em' }}>
          <div style={{ minHeight: '45px', backgroundColor: '#ebf1f5', padding: '0.5em', textAlign: 'right', borderBottom: '1px solid rgba(16, 22, 26, 0.15)' }}>
            <div className={'pt-button-group'}>
              <div className={`pt-button${mode === 'edit' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'edit')}>Edit</div>
              <div className={`pt-button${mode === 'preview' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'preview')}>Preview</div>
              <div className={`pt-button${mode === 'side' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'side')}>Side By Side</div>
            </div>

          </div>
          {(mode === 'edit' || mode === 'side') ?
          <CodeEditor onChange={this.onChange} initialContent={`<div><h1>JODS</h1><PubsList n={2} order={['ageofentanglement','designandscience']} /></div>`} {...this.props} />
          : null }
          {(mode === 'preview' || mode === 'side') ? elem : null }
      </div>

      </div>
		);
	}
});

export default LayoutEditor;
