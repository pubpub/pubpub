import React, {PropTypes} from 'react';
import Media from './baseMediaPlugin';
import createPubPubPlugin from './PubPub';
import ErrorMsg from './ErrorPlugin';

let STLViewer = 'div';

const InputFields = [
  {title: 'color', type: 'color'},
  {title: 'preload', type: 'preload'},
  {title: 'source', type: 'asset', params: {assetType: ("stl") }},
];

const Config = {
  title: 'stl',
  inline: true,
  autocomplete: true,
  color: 'rgba(158,219,176,0.5)',
};

const STL_WRAPPER_CLASS = 'pub-stl-wrapper';
const STL_CLASS = 'pub-stl';

const EditorWidget = (inputProps) => (<span>3D Object: {(((inputProps.source) ? inputProps.source.label : false) || 'Empty')}</span>);


const Plugin = React.createClass({
  propTypes: {
    url: PropTypes.string,
    error: PropTypes.string,
    children: PropTypes.string,
    source: PropTypes.object,
  },
  componentDidMount(){
      STLViewer = require('stl-viewer');
  },

  playModel: function() {
    this.setState({playingModel: true});
  },
  renderModel: function (color, url) {
      return (<Media className = {STL_WRAPPER_CLASS}>
      <STLViewer className = {STL_CLASS}
        url= {url}
        width={400}
        height={400}
        modelColor={color}
        backgroundColor='#EAEAEA'
        rotate={true}
        orbitControls={true}
      />
      </Media>);
  },

  render: function() {
    if (!this.props.source || !this.props.source.url) {

      return (<span></span>);
		}
    const url = this.props.source.url;
    const modelColor = this.props.color;

    if(this.props.preload == "" || this.state.playingModel){
      return this.renderModel(modelColor, url);

    } else{
    return (<div width = {400} height = {400}  background-color='#EAEAEA'>
      <button onClick={this.playModel}>Show Rendering</button>
    </div>);
  }
  }
});
function renderModel(color, url){
    return (<Media className = {STL_WRAPPER_CLASS}>
    <STLViewer className = {STL_CLASS}
      url= {url}
      width={400}
      height={400}
      modelColor={color}
      backgroundColor='#EAEAEA'
      rotate={true}
      orbitControls={true}
    />
    </Media>);
  };

export default createPubPubPlugin(Plugin, Config, InputFields, EditorWidget);
