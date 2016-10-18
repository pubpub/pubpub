import ElementPortal from 'react-element-portal';
import Radium from 'radium';
import React, {PropTypes} from 'react';

const popupKeyframes = Radium.keyframes({
  '0%': {opacity: '0', transform: 'matrix(.97,0,0,1,0,12)'},
	'20%': {opacity: '0.7', transform: 'matrix(.99,0,0,1,0,2)'},
	'40%': {opacity: '0.7', transform: 'matrix(1,0,0,1,0,-1)'},
	'70%': {opacity: '1', transform: 'matrix(1,0,0,1,0,0)'},
  '100%': {opacity: '1', transform: 'matrix(1,0,0,1,0,0)'},
}, 'popup');



export const EmbedEditor = React.createClass({
	propTypes: {
		status: PropTypes.oneOf(['loading', 'connected', 'reconnecting', 'disconnected', 'timeout', 'unknown']),
		embedAttrs: PropTypes.object,
    updateParams: PropTypes.func,
  },

	getInitialState: function() {
		return {caption: null};
	},

  setEmbedAttribute: function(key, value, evt) {
		const obj = {};
		obj[key] = value;
		this.props.updateParams(obj);
    // this.props.saveCallback(key, value, evt);
  },

  changeCaption: function(evt) {
		const cap = this.refs.caption.value;
		this.props.updateParams({caption: cap});
		this.setState({caption: cap});
		this.refs.caption.focus();
  },

	preventClick: function(evt) {
		// evt.preventDefault();
		evt.stopPropagation();
		this.refs.caption.focus();
	},

	render: function() {

		const {participants, status} = this.props;

		return (
      <div className={'contrastbox'} style={styles.box}>

        <label htmlFor={'test'}>
          Alignment
        </label>

        <div style={styles.alignDiv} name={'test'}>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'inline')} style={styles.alignOption(this.props.embedAttrs.align, 'inline')}>Inline</div>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'full')} style={styles.alignOption(this.props.embedAttrs.align, 'full')}>Full</div>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'left')} style={styles.alignOption(this.props.embedAttrs.align, 'left')}>Left</div>
          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'right')} style={styles.alignOption(this.props.embedAttrs.align, 'right')}>Right</div>
        </div>

        <label htmlFor={'captionNote'}>
          Caption
        </label>
        <input mousedown={this.preventClick} draggable="false"  className="caption" onClick={this.preventClick} ref="caption" value={this.state.caption || this.props.embedAttrs.caption} onChange={this.changeCaption} type="text" id={'captionNote'} name={'caption'}/>

      </div>
	  );

	}
});

const styles = {
  box: {
    padding: '0.6em 1.2em',
    fontSize: '0.8em',
    border: 'none',
    boxShadow: '0px 0px 2px #808284',
		// animation: 'x 180ms forwards linear',
		// animationName: popupKeyframes,
  },
  alignDiv: {
    paddingBottom: '0.5em',
  },
  alignOption: function(activeAlign, option) {
		return {
			fontWeight: (activeAlign === option) ? '700' : 400,
	    display: 'inline-block',
	    paddingRight: '0.8em',
	    cursor: 'pointer',
		};
  }
};

export default EmbedEditor;
