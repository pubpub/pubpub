import ElementPortal from 'react-element-portal';
import Radium from 'radium';
import React, {PropTypes} from 'react';

export const EmbedEditor = React.createClass({
	propTypes: {
		status: PropTypes.oneOf(['loading', 'connected', 'reconnecting', 'disconnected', 'timeout', 'unknown']),
		coordinates: PropTypes.string,
		embedAttrs: PropTypes.object,
    saveCallback: PropTypes.func,
  },

  setEmbedAttribute: function(key, value, evt) {
    this.props.saveCallback(key, value, evt);
  },
	render: function() {

		const {participants, status} = this.props;

		return (
      <div className={'contrastbox'} style={styles.box}>

        <label htmlFor={'test'}>
          Alignment
        </label>

        <div style={styles.alignDiv} name={'test'}>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'inline')} style={[styles.alignOption, this.props.embedAttrs.align === 'inline' && styles.activeAlign]}>Inline</div>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'full')} style={[styles.alignOption, this.props.embedAttrs.align === 'full' && styles.activeAlign]}>Full</div>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'left')} style={[styles.alignOption, this.props.embedAttrs.align === 'left' && styles.activeAlign]}>Left</div>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'right')} style={[styles.alignOption, this.props.embedAttrs.align === 'right' && styles.activeAlign]}>Right</div>
        </div>

        <label htmlFor={'sizeNote'}>
          Size
        </label>
        <input type="text" id={'sizeNote'} name={'size'}/>

        <label htmlFor={'captionNote'}>
          Caption
        </label>
        <input type="text" id={'captionNote'} name={'caption'}/>

      </div>
	  );

	}
});

const styles = {
  box: {
    padding: '0.6em 1.2em',
    fontSize: '0.8em'
  },
  alignDiv: {
    paddingBottom: '0.5em',
  },
  alignOption: {
    display: 'inline-block',
    paddingRight: '0.8em',
    cursor: 'pointer',
  }
};

export default Radium(EmbedEditor);
