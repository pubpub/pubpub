import React, { PropTypes } from 'react';

import { CodeEditor }  from '@pubpub/editor';
import LayoutPubsList from './LayoutPubsList';
import LayoutSinglePub from './LayoutSinglePub'
import jsx from 'jsx-transform';

let styles = {};

const LayoutEditor = React.createClass({
  getInitialState: function() {
    return {
      mode: 'edit'
    };
  },

  getSinglePub: function(slug) {
    const journal = this.props.journal;
    const pubFeatures = journal.pubFeatures;
    const pub = pubFeatures.find((pubFeature) => (pubFeature.pub.slug === slug));
    return pub.pub;
  },
	onChange: function(codeContent) {
    try {
      const createElem = React.createElement;

      const PubsList = (props) => {
        return (<div>
          <LayoutPubsList journal={this.props.journal} {...props}/>
          </div>
        );
      }

      const Pub = (props) => {
        const slug = props.slug;
        const pub = this.getSinglePub(slug);
        return (<div>
            <LayoutSinglePub journal={this.props.journal} pub={pub} {...props}/>
          </div>
        );
      }


      const compiled = jsx.fromString(codeContent, {
        factory: 'createElem'
      });
      const elem = eval(compiled);
      if (this.props.onChange) {
        this.props.onChange(codeContent);
      }
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
    const { journal, initialContent } = this.props;

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
          <div style={styles.container}>
            {(mode === 'edit' || mode === 'side') ?
            <div style={styles.item}>
              <CodeEditor onChange={this.onChange} initialContent={initialContent} {...this.props} />
            </div>
            : null }
            {(mode === 'preview' || mode === 'side') ? <div style={styles.item}>{elem}</div> : null }
          </div>
      </div>

      </div>
		);
	}
});


styles = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around'
  },
  item: {
    width: '50%',
    flexGrow: 2,
  }
}

export default LayoutEditor;
