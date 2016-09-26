import ElementPortal from 'react-element-portal';
import Radium from 'radium';
import React, {PropTypes} from 'react';

export const EmbedEditor = React.createClass({
	propTypes: {
		status: PropTypes.oneOf(['loading', 'connected', 'reconnecting', 'disconnected', 'timeout', 'unknown']),
		coordinates: PropTypes.string,
		attributes: PropTypes.object,
    saveCallback: PropTypes.func,

	render: function() {

		const {participants, status} = this.props;

		const loading = (status === 'loading' || status === 'reconnecting');
		const error = (status === 'reconnecting' || status === 'disconnected' || status === 'timeout');


		return (
      <div style={[styles.embedLayoutEditor, {left: this.state.embedLayoutCoords.left - 2, top: this.state.embedLayoutCoords.bottom}]}>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'inline')} style={[this.state.embedAttrs.align === 'inline' && styles.activeAlign]}>Inline</div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'full')} style={[this.state.embedAttrs.align === 'full' && styles.activeAlign]}>Full</div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'left')} style={[this.state.embedAttrs.align === 'left' && styles.activeAlign]}>Left</div>
        <div onClick={this.setEmbedAttribute.bind(this, 'align', 'right')} style={[this.state.embedAttrs.align === 'right' && styles.activeAlign]}>Right</div>
        <input type="text" onChange={this.sizeChange} defaultValue={this.state.embedAttrs.size}/>
        <textarea type="text" onChange={this.captionChange} defaultValue={this.state.embedAttrs.caption}></textarea>
      </div>
	  );

	}
});

export default Radium(EmbedEditor);
