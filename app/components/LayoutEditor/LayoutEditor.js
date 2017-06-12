import React, { PropTypes } from 'react';

import { CodeEditor }  from '@pubpub/editor';
import LayoutPubsList from './LayoutPubsList';
import LayoutRenderer from './LayoutRenderer';
import LayoutSinglePub from './LayoutSinglePub'
import jsx from 'jsx-transform';

let styles = {};

const LayoutEditor = React.createClass({
  getInitialState: function() {
    return {
      initialContent: this.props.initialContent,
      codeContent: this.props.initialContent,
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
      this.setState({ codeContent });
      if (this.props.onChange) {
        this.props.onChange(codeContent);
      }
    } catch (err) {
      console.log('Got err', err);
    }
	},


  handleEditModeChange: function(mode) {
    this.setState({mode, initialContent: this.state.codeContent });
  },

	render: function() {
    const { codeContent, mode, initialContent } = this.state;
    const { journal } = this.props;

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
              <CodeEditor onChange={this.onChange} initialContent={initialContent} />
            </div>
            : null }
            {(mode === 'preview' || mode === 'side') ?
             <div style={styles.item}>
               <div style={styles.previewWrapper}>
                 <LayoutRenderer content={codeContent} journal={journal} />
              </div>
             </div>
            : null }
          </div>
      </div>

      </div>
		);
	}
});


styles = {
  previewWrapper: {
    padding: '15px 15px'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-around'
  },
  item: {
    width: '50%',
    flexGrow: 2,
    minHeight: 600,
  }
}

export default LayoutEditor;
