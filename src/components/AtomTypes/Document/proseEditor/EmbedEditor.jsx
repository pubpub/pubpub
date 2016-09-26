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
      <div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'inline')} style={[this.props.embedAttrs.align === 'inline' && styles.activeAlign]}>Inline</div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'full')} style={[this.props.embedAttrs.align === 'full' && styles.activeAlign]}>Full</div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'left')} style={[this.props.embedAttrs.align === 'left' && styles.activeAlign]}>Left</div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'right')} style={[this.props.embedAttrs.align === 'right' && styles.activeAlign]}>Right</div>
        <input type="text" onChange={this.sizeChange} defaultValue={this.props.embedAttrs.size}/>
        <textarea type="text" onChange={this.captionChange} defaultValue={this.props.embedAttrs.caption}></textarea>
      </div>
	  );

	}
});

const styles = {};

export default Radium(EmbedEditor);
