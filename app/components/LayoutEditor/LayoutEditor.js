import React, { PropTypes } from 'react';

import { CodeEditor }  from '@pubpub/editor';
import jsx from 'jsx-transform';

function RenderedPubs(props) {
  console.log(props.n, Array(props.n));
  return (<ul>
    {Array(props.n).fill().map((n, index) => {
      return <li>{props.name} {index}</li>
    })}
    </ul>
  );
}

const LayoutEditor = React.createClass({
  getInitialState: function() {
    return {
      elem: null
    };
  },
	onChange: function(item) {
    try {
      const createElem = React.createElement;
      const compiled = jsx.fromString(item, {
        factory: 'createElem'
      });
      const elem = eval(compiled);
      this.setState({elem});
    } catch (err) {
      console.log(err);
    }
	},


  handleEditModeChange: function(mode) {

  },

	render: function() {
    const { elem } = this.state;
    const DisplayElem = elem;
    const mode = 'rich';
		return (
      <div>

        <div className={'pt-card pt-elevation-3'} style={{ padding: '0em', margin: '0em 0em 2em' }}>
          <div style={{ minHeight: '45px', backgroundColor: '#ebf1f5', padding: '0.5em', textAlign: 'right', borderBottom: '1px solid rgba(16, 22, 26, 0.15)' }}>
            <div className={'pt-button-group'}>
              <div className={`pt-button${mode === 'rich' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'edit')}>Edit</div>
              <div className={`pt-button${mode === 'rich' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'preview')}>Preview</div>
              <div className={`pt-button${mode === 'rich' ? ' pt-active' : ''}`} onClick={this.handleEditModeChange.bind(this, 'side')}>Side By Side</div>

              <button className={'pt-button pt-icon-trash pt-minimal'} style={{ margin: '0em 1em' }} onClick={this.props.onFileDelete} />
            </div>

          </div>
          <CodeEditor onChange={this.onChange} initialContent={'<div><h1>JODS</h1><RenderedPubs n={5} name="Pub"/></div>'} {...this.props} />
          {(elem) ? elem : null}
      </div>

      </div>
		);
	}
});

export default LayoutEditor;
