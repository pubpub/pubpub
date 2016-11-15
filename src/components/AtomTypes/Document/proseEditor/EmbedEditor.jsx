import ElementPortal from 'react-element-portal';
import Radium from 'radium';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
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

  changeFigureName: function(evt) {
		const figure = this.refs.caption.value;
		this.props.updateParams({figureName: figure});
		this.setState({figureName: figure});
		this.refs.figureName.focus();
  },


	preventClick: function(evt) {
		// evt.preventDefault();
		evt.stopPropagation();
		this.refs.caption.focus();
	},

	render: function() {

		const {participants, status} = this.props;

		return (
      <ReactCSSTransitionGroup
        transitionName="popup"
        transitionAppear={true}
        transitionAppearTimeout={180}>
      <div key="boxWrapper" className={'contrastbox arrow_box'} style={styles.box}>

        <div style={styles.alignDiv} name={'test'}>

          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'left')} style={styles.alignOption(this.props.embedAttrs.align, 'left')}>
            <svg style={styles.icon({selected: (this.props.embedAttrs.align === 'left')})} className="icon align">
              <use xlinkHref="/icons/align.svg#left-align" />
            </svg>
          </div>

          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'full')} style={styles.alignOption(this.props.embedAttrs.align, 'full')}>
            <svg style={styles.icon({selected: (this.props.embedAttrs.align === 'full')})} className="icon align">
              <use xlinkHref="/icons/align.svg#middle-align" />
            </svg>
          </div>

          <div onClick={this.setEmbedAttribute.bind(this, 'align', 'right')} style={styles.alignOption(this.props.embedAttrs.align, 'right')}>
            <svg style={styles.icon({selected: (this.props.embedAttrs.align === 'right')})} className="icon align" >
              <use xlinkHref="/icons/align.svg#right-align" />
            </svg>
          </div>
        </div>

        <label style={styles.label} htmlFor={'captionNote'}>
          Caption
        </label>
        <input style={styles.input} mousedown={this.preventClick} draggable="false"  className="caption" onClick={this.preventClick} ref="caption" value={this.state.caption || this.props.embedAttrs.caption} onChange={this.changeCaption} type="text" id={'captionNote'} name={'caption'}/>


        {/*

        <label style={styles.label} htmlFor={'figureName'}>
          Figure Name
        </label>
        <input style={styles.input} draggable="false"  className="caption" ref="figureName" value={this.state.figureName || this.props.embedAttrs.figureName} onChange={this.changeFigureName} type="text" id={'figureName'} name={'figure'}/>
        */}

      </div>
      </ReactCSSTransitionGroup>
	  );

	}
});

const styles = {
  icon: function({selected}) {
    return {
      width: '20px',
      height: '20px',
      backgroundColor: (selected) ? 'white' : undefined,
      borderRadius: '2px',
      padding: '3px',
      boxShadow: (selected) ? '0px 0px 2px #808284' : undefined,
    };
  },
  input: {
    width: '100%',
  },
  label: {
    lineHeight: '1.35em',
    fontSize: '0.75em',
    fontFamily: 'Open Sans',
  },
  box: {
    padding: '0.6em 1.2em',
    fontSize: '0.8em',
    border: 'none',
    boxShadow: '0px 0px 2px #808284',
    // transition: 'popupKeyframe 200ms linear',
		// animation: 'popupKeyframe 180ms forwards linear',
		// animationName: popupKeyframes,
  },
  alignDiv: {
    paddingBottom: '0.5em',
    textAlign: 'center',
  },
  alignOption: function(activeAlign, option) {
		return {
			fontWeight: (activeAlign === option) ? '700' : 400,
	    display: 'inline-block',
	    paddingRight: '0.8em',
	    cursor: 'pointer',
      width: '20px',
		};
  }
};

export default EmbedEditor;
